import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodosComponent } from './todos.component';
import { ApiService } from '@services/api.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ITodo } from '@shared/models/todo.model';
import { of } from 'rxjs';

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

    expect(apiService.getRandomTodo).toHaveBeenCalledWith(1);
    component.todos$.subscribe((todos) => {
      expect(todos).toEqual(mockTodos);
    });
    expect(component.actionTitle$$.getValue()).toBe('Regenerate!');
  });
});
