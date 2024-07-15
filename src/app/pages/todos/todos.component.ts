import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ApiService } from '@services/api.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import {
  BehaviorSubject,
  EMPTY,
  map,
  Observable,
  of,
  shareReplay,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { ITodo } from '@shared/models/todo.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { generateItemsCount } from '@shared/utils/select.utils';
import { getRandomPosition } from '@shared/utils/math.utils';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [NgClass, FormsModule, AsyncPipe, JsonPipe],
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

  selectedRandomCount: number = 1;

  todos$: Observable<ITodo[]> = EMPTY;

  actionTitle$$ = new BehaviorSubject<string>('Fetch!');

  private regenerateSubscription!: Subscription;

  onTodosFetch() {
    this.todos$ = this.apiService.getRandomTodo(this.selectedRandomCount).pipe(
      tap(() => {
        if (this.actionTitle$$.getValue() === 'Fetch!')
          this.actionTitle$$.next('Regenerate!');
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
      tap((todos) => {
        if (!todos.length) {
          this.actionTitle$$.next('Fetch!');
        }
        this.cdRef.detectChanges();
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

  generateItemsCount = generateItemsCount;

  outputImage(type: 'regenerate' | 'remove') {
    const section = this.section.nativeElement as HTMLElement;
    section.style.position = 'relative';
    const sectionWidth = section.clientWidth;
    const sectionHeight = section.clientHeight;

    if (section) {
      let imgObj: HTMLImageElement = document.createElement('img');

      Object.assign(imgObj.style, {
        position: 'absolute',
        zIndex: '100',
        width: '80px',
        height: '80px',
        top: this.getRandomPosition(0, sectionHeight - 80) + 'px',
        left: this.getRandomPosition(0, sectionWidth - 80) + 'px',
        transition: 'transform 1s ease-out, opacity 1s ease-in 1s',
      });

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

  getRandomPosition = getRandomPosition;

  ngOnDestroy(): void {
    if (this.regenerateSubscription) {
      this.regenerateSubscription.unsubscribe();
    }
  }
}
