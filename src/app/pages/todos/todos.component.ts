import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {
  concatMap,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { ITodo } from '../../shared/models/todo.model';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    CardModule,
    DropdownModule,
    FormsModule,
    AsyncPipe,
    JsonPipe,
    ButtonModule,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements OnInit {
  private apiService = inject(ApiService);
  private cdRef = inject(ChangeDetectorRef);

  selectedRandomCount: SelectItem = { label: `${1}`, value: 1 };

  todos$!: Observable<ITodo[]>;

  ngOnInit(): void {}

  onTodosFetch() {
    this.todos$ = this.apiService
      .getRandomTodo(this.selectedRandomCount.value)
      .pipe(shareReplay());
  }

  onRegenerateTodo(replace_id: number) {
    this.todos$
      .pipe(
        concatMap((existingTodos) =>
          this.apiService.getRandomTodo().pipe(
            map((newTodo) => {
              const updatedTodos = existingTodos.map((todo) =>
                todo.id === replace_id ? newTodo[0] : todo
              );
              return updatedTodos;
            })
          )
        ),
        tap(() => this.cdRef.markForCheck())
      )
      .subscribe((updateTodos) => {
        this.todos$ = of(updateTodos);
      });
  }

  generateItemsCount(num: number): SelectItem[] {
    let arr: SelectItem[] = [];

    for (let i = 1; i <= num; i++) {
      arr.push({ label: `${i}`, value: i });
    }

    return arr;
  }
}
