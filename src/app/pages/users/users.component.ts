import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  Host,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { EMPTY, map, Observable, of, tap } from 'rxjs';
import { IUser } from '../../shared/models/user.model';
import { AsyncPipe, DatePipe, JsonPipe, NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ReusableCardComponent } from '../../shared/components/reusable-card/reusable-card.component';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, DatePipe, NgClass, ReusableCardComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  animations: [
    trigger('pulsation', [
      transition('* => *', [
        animate(
          '1s',
          keyframes([
            style({ transform: 'scale(1)', offset: 0 }),
            style({ transform: 'scale(1.2)', offset: 0.5 }),
            style({ transform: 'scale(1)', offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit, AfterViewInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @ViewChild('movingElement') movingElement!: ElementRef<HTMLDivElement>;

  user$!: Observable<IUser>;

  loadingSig = signal<boolean>(false);
  animateStateSig = signal<string>('start');

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.movingElement) {
      this.initializeDraggable(this.movingElement.nativeElement);
    }
    this.startAnimationLoop();
  }

  private initializeDraggable(element: HTMLElement) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    const dragMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      pos3 = event.clientX;
      pos4 = event.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };

    const elementDrag = (event: MouseEvent) => {
      event.preventDefault();
      pos1 = pos3 - event.clientX;
      pos2 = pos4 - event.clientY;
      pos3 = event.clientX;
      pos4 = event.clientY;

      element.style.top = element.offsetTop - pos2 + 'px';
      element.style.left = element.offsetLeft - pos1 + 'px';
    };

    const closeDragElement = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };

    element.onmousedown = dragMouseDown;
  }

  private startAnimationLoop() {
    setInterval(() => {
      this.animateStateSig.set(
        this.animateStateSig() === 'start' ? 'end' : 'start'
      );
    }, 1000);
  }

  onFetchSingleUser() {
    this.loadingSig.set(true);
    this.apiService
      .getSingleUser(Math.round(Math.random() * 207 + 1))
      .pipe(
        map((user) => (this.user$ = of(user))),
        tap(() => this.loadingSig.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.cdr.markForCheck();
  }
}
