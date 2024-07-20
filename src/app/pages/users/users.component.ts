// Angular stuff
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { AsyncPipe, DatePipe, JsonPipe, NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';

// components
import { ReusableCardComponent } from '@shared/components/reusable-card/reusable-card.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';

// utils
import { initializeDraggable } from '@shared/utils/dragElement.utils';

// css classes
import {
  usersParagraphClasses,
  usersSpanClasses,
} from '@shared/classes/ui.classes';

// interfaces
import { IUser } from '@shared/models/user.model';

// services
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    DatePipe,
    NgClass,
    ReusableCardComponent,
    SkeletonComponent,
  ],
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

  usersParagraphClasses = usersParagraphClasses;
  usersSpanClasses = usersSpanClasses;

  user$!: Observable<IUser>;

  loadingSig = signal<boolean>(false);
  animateStateSig = signal<string>('start');

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.movingElement) {
      initializeDraggable(this.movingElement.nativeElement);
    }
    this.startAnimationLoop();
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
