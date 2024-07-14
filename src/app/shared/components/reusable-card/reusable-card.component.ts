import { Component } from '@angular/core';

@Component({
  selector: 'app-reusable-card',
  standalone: true,
  imports: [],
  template: `
    <div
      class="relative z-10 w-full max-w-full p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <ng-content />
    </div>
  `,
  styleUrl: './reusable-card.component.css',
})
export class ReusableCardComponent {}
