import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@services/api.service';
import { ITodo } from '@shared/models/todo.model';

const todos: ITodo[] = [
  {
    id: 127,
    todo: 'Prepare a dish from a foreign culture',
    completed: false,
    userId: 7,
  },
];

fdescribe('ApiService: unit test', () => {
  let apiService: ApiService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    apiService = TestBed.inject(ApiService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('retrieving of a random todo', () => {
    let actualTodos: ITodo[] | undefined;

    apiService.getRandomTodo().subscribe((otherTodos) => {
      actualTodos = otherTodos;
    });

    const request = controller.expectOne(
      'https://dummyjson.com/todos/random/1'
    );

    request.flush(todos);
    controller.verify();

    expect(actualTodos).toEqual(todos);
  });

  it('passes through search errors', () => {
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ErrorEvent('API Error');

    let actualError: HttpErrorResponse | undefined;

    apiService.getRandomTodo().subscribe({
      next: () => {
        fail('next handler must not be called');
      },
      error: (error) => {
        actualError = error;
      },
      complete: () => {
        fail('complete handler must not be called');
      },
    });
    controller
      .expectOne('https://dummyjson.com/todos/random/1')
      .error(errorEvent, { status, statusText });

    if (!actualError) {
      throw new Error('Error needs to be defined');
    }
    expect(actualError.error).toBe(errorEvent);
    expect(actualError.status).toBe(status);
    expect(actualError.statusText).toBe(statusText);
  });
});
