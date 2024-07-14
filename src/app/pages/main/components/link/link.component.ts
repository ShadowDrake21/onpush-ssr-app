import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'main-link',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  template: `
    <a
      [routerLink]="link"
      class="main-link block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
    >
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-right text-gray-900 dark:text-white"
      >
        <ng-content />{{ ' ' }}<fa-icon [icon]="faArrowRight" />
      </h5>
    </a>
  `,
  styleUrl: './link.component.css',
})
export class LinkComponent {
  faArrowRight = faArrowRight;

  @Input({ required: true }) link: string = '';
}
