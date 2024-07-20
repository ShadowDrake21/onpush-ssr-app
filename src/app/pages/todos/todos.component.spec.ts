// Angular stuff
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

// services
import { ApiService } from '@services/api.service';

// components
import { TodosComponent } from './todos.component';

// interfaces
import { ITodo } from '@shared/models/todo.model';

fdescribe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let apiService: ApiService;
  let httpMock: HttpTestingController;
  let cdRef: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TodosComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [ApiService, ChangeDetectorRef],
    }).compileComponents();

    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    cdRef = TestBed.inject(ChangeDetectorRef);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch todos on onTodosFetch', () => {
    const { mockTodos } = todoSpyHelper(apiService, component);

    expect(apiService.getRandomTodo).toHaveBeenCalledWith(1);
    component.todos$.subscribe((todos) => {
      expect(todos).toEqual(mockTodos);
    });
    expect(component.actionTitle$$.getValue()).toBe('Regenerate!');
  });

  it('should show retrieved todos in ui', () => {
    todoSpyHelper(apiService, component);

    fixture.detectChanges();

    const renderedTodo = fixture.debugElement.query(
      By.css('[data-testingId="todo"')
    );

    expect(renderedTodo).toBeTruthy();
  });

  it('should delete a todo on onClick', fakeAsync(() => {
    const { mockTodos } = todoSpyHelper(apiService, component);

    component.todos$ = of(mockTodos);
    fixture.detectChanges();
    flush();

    let renderedTodo = fixture.debugElement.query(
      By.css('[data-testingId="todo"')
    );
    expect(renderedTodo).toBeTruthy();

    component.onRemoveTodo(mockTodos[0].id);
    component.todos$.subscribe();
    uiUpdate<TodosComponent>(fixture);

    renderedTodo = fixture.debugElement.query(By.css('[data-testingId="todo"'));

    expect(renderedTodo).toBeNull();
  }));

  it('should change a todo on onClick', fakeAsync(() => {
    const { mockTodos } = todoSpyHelper(apiService, component);

    component.todos$ = of(mockTodos);
    uiUpdate<TodosComponent>(fixture);

    let renderedTodo = fixture.debugElement.query(
      By.css('[data-testingId="todo"')
    );
    expect(renderedTodo).toBeTruthy();

    component.onRegenerateTodo(mockTodos[0].id);

    component.todos$ = of([
      { id: 45, todo: 'Regenerated todo', completed: true, userId: 45 },
    ]);
    uiUpdate<TodosComponent>(fixture);

    renderedTodo = fixture.debugElement.query(By.css('[data-testingId="todo"'));
    expect(renderedTodo.nativeElement.textContent).toContain(
      'Regenerated todo'
    );
  }));
});

function todoSpyHelper(apiService: ApiService, component: TodosComponent) {
  const mockTodos: ITodo[] = [
    {
      id: 1,
      todo: 'Test Todo',
      completed: false,
      userId: 4,
    },
  ];

  spyOn(apiService, 'getRandomTodo').and.returnValue(of(mockTodos));

  component.onTodosFetch();

  return { mockTodos };
}

function uiUpdate<T>(fixture: ComponentFixture<T>) {
  fixture.detectChanges();
  flush();
}
