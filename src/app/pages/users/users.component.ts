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
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, DatePipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit, AfterViewInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @ViewChild('movingElement') movingElement!: ElementRef<HTMLDivElement>;

  user$!: Observable<IUser>;

  loadingSig = signal<boolean>(false);

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.movingElement) {
      const el = this.movingElement.nativeElement;

      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;
      // add animation
      el.addEventListener('mousedown', (event: MouseEvent) => {
        isDragging = true;

        offsetX = (event.clientX - el.getBoundingClientRect().left) / 2;
        offsetY = event.clientY - el.getBoundingClientRect().top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      const onMouseMove = (event: MouseEvent) => {
        if (isDragging) {
          el.style.top = `${event.clientY - offsetY * 2}px`;
          el.style.left = `${event.clientX - offsetX - 120}px`;
        }
      };

      const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
    }
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

  onDeleteUser() {
    this.user$ = EMPTY;
  }
}
