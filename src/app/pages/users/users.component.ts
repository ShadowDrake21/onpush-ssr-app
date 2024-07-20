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

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  usersParagraphClasses = usersParagraphClasses;
  usersSpanClasses = usersSpanClasses;

  user$!: Observable<IUser>;

  loadingSig = signal<boolean>(false);
  animateStateSig = signal<string>('start');

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
