import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { IUser } from '../../shared/models/user.model';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { json } from 'stream/consumers';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, DatePipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  user$!: Observable<IUser>;

  ngOnInit(): void {
    this.onFetchSingleUser();
  }

  onFetchSingleUser() {
    this.user$ = this.apiService.getSingleUser(
      Math.round(Math.random() * 207 + 1)
    );
    this.cdr.markForCheck();
  }

  onDeleteUser() {
    this.user$ = EMPTY;
  }
}
