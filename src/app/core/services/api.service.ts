import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { ITodo } from '@shared/models/todo.model';
import { IQuote } from '@shared/models/quote.model';
import { IUser } from '@shared/models/user.model';
import { IRecipeWithAddInfo } from '@shared/models/recipe.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getRandomTodo(count: number = 1): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(`${API_BASE_URL}todos/random/${count}`);
  }

  getRandomQuote(count: number = 1): Observable<IQuote[]> {
    return this.http.get<IQuote[]>(`${API_BASE_URL}quotes/random/${count}`);
  }

  getSingleUser(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${API_BASE_URL}users/${id}`);
  }

  searchRecipe(query: string): Observable<IRecipeWithAddInfo> {
    return this.http.get<IRecipeWithAddInfo>(`${API_BASE_URL}recipes/search`, {
      params: new HttpParams().append('q', query),
    });
  }
}
