import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  menuItems: MenuItem[] = [
    { label: 'Main', routerLink: '/main' },
    { label: 'Todos', routerLink: '/todos' },
    { label: 'Quotes', routerLink: '/quotes' },
    { label: 'Users', routerLink: '/users' },
    { label: 'Recipes', routerLink: '/recipes' },
  ];
}
