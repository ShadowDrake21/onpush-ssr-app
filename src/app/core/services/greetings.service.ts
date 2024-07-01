import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface IGreetings {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class GreetingsService {
  constructor() {}

  private http = inject(HttpClient);

  getGreetings(): Observable<IGreetings> {
    return this.http.get<IGreetings>('/api/greetings');
  }
}
