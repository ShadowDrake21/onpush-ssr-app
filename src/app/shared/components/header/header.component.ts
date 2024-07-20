// Angular stuff
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// interfaces
import { IMenuItem } from '../../models/navbar.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  menuItems: IMenuItem[] = [
    { label: 'Main', routerLink: '/main' },
    { label: 'Todos', routerLink: '/todos' },
    { label: 'Quotes', routerLink: '/quotes' },
    { label: 'Users', routerLink: '/users' },
    { label: 'Recipes', routerLink: '/recipes' },
  ];
}
