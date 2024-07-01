import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  GreetingsService,
  IGreetings,
} from './core/services/greetings.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private greetingsService = inject(GreetingsService);

  greetings$!: Observable<IGreetings>;

  sayHello() {
    this.greetings$ = this.greetingsService.getGreetings();
  }
}
