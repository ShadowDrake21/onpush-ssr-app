import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, FETCH_BASE_URL } from '../constants/api.constants';
import { ITodo } from '../../shared/models/todo.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getRandomQuote() {}

  getRandomTodo(count: number = 1): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(`${API_BASE_URL}todos/random/${count}`);
  }
}
