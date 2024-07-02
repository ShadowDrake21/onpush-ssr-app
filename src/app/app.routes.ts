import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/main' },
  {
    path: 'main',
    loadComponent: () =>
      import('./pages/main/main.component').then((c) => c.MainComponent),
  },
  {
    path: 'quotes',
    loadComponent: () =>
      import('./pages/quotes/quotes.component').then((c) => c.QuotesComponent),
  },
  {
    path: 'todos',
    loadComponent: () =>
      import('./pages/todos/todos.component').then((c) => c.TodosComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users/users.component').then((c) => c.UsersComponent),
  },
  {
    path: 'recipes',
    loadComponent: () =>
      import('./pages/recipes/recipes.component').then(
        (c) => c.RecipesComponent
      ),
  },
];
