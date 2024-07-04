import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {
  map,
  Observable,
  of,
  shareReplay,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { ITodo } from '../../shared/models/todo.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    NgClass,
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
  animations: [
    trigger('flyToTop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(0)' }),
        animate(
          '2s ease-out',
          style({ opacity: 1, transform: 'translateY(-100vh)' })
        ),
      ]),
      transition(':leave', [animate('1s ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class TodosComponent implements OnDestroy {
  @ViewChild('todos') section!: ElementRef;

  private apiService = inject(ApiService);
  private cdRef = inject(ChangeDetectorRef);

  selectedRandomCount: SelectItem = { label: `${1}`, value: 1 };

  todos$!: Observable<ITodo[]>;

  actionTitle: string = 'Fetch!';

  private regenerateSubscription!: Subscription;

  onTodosFetch() {
    this.todos$ = this.apiService
      .getRandomTodo(this.selectedRandomCount.value)
      .pipe(
        tap(() => {
          if (this.actionTitle === 'Fetch!') this.actionTitle = 'Regenerate!';
          this.cdRef.markForCheck();
        }),
        shareReplay()
      );
  }

  onRegenerateTodo(replace_id: number) {
    this.regenerateSubscription = this.todos$
      .pipe(
        switchMap((existingTodos) =>
          this.apiService
            .getRandomTodo()
            .pipe(
              map((newTodo) =>
                existingTodos.map((todo) =>
                  todo.id === replace_id ? newTodo[0] : todo
                )
              )
            )
        ),
        tap(() => {
          this.outputImage('regenerate');
          this.cdRef.markForCheck();
        })
      )
      .subscribe((updateTodos) => {
        this.todos$ = of(updateTodos);
      });
  }

  onRemoveTodo(removeId: number) {
    this.todos$ = this.todos$.pipe(
      map((allTodos) => allTodos.filter((todo) => todo.id !== removeId)),
      tap(() => {
        this.cdRef.markForCheck();
        this.outputImage('remove');
      }),
      shareReplay()
    );
  }

  onToggleCompleteness(todoId: number) {
    this.todos$ = this.todos$.pipe(
      map((todos) =>
        todos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        )
      ),
      tap(() => this.cdRef.markForCheck())
    );
  }

  generateItemsCount(num: number): SelectItem[] {
    let arr: SelectItem[] = [];

    for (let i = 1; i <= num; i++) {
      arr.push({ label: `${i}`, value: i });
    }

    return arr;
  }

  outputImage(type: 'regenerate' | 'remove') {
    const section = this.section.nativeElement as HTMLElement;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    if (section) {
      let imgObj: HTMLImageElement = document.createElement('img');
      imgObj.style.position = 'absolute';
      imgObj.style.zIndex = '100';
      imgObj.style.width = '80px';
      imgObj.style.height = '80px';
      imgObj.style.top = this.getRandomPosition(0, winHeight - 80) + 'px';
      imgObj.style.left = this.getRandomPosition(0, winWidth - 80) + 'px';
      imgObj.style.transition = 'transform 1s ease-out, opacity 1s ease-in 1s';

      if (type === 'regenerate') {
        imgObj.src = '/assets/images/laugh.png';
      } else {
        imgObj.src = '/assets/images/oh-no.png';
      }

      section.appendChild(imgObj);

      setTimeout(() => {
        imgObj.style.transform = 'translateY(-100vh)';
        imgObj.style.opacity = '0';
        setTimeout(() => {
          if (section.contains(imgObj)) {
            section.removeChild(imgObj);
          }
        }, 1000);
      }, 1000);
    }
  }

  private getRandomPosition(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  ngOnDestroy(): void {
    if (this.regenerateSubscription) {
      this.regenerateSubscription.unsubscribe();
    }
  }
}
