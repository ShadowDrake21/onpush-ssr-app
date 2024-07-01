import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/main' },
  {
    path: 'main',
    loadComponent: () =>
      import('./pages/main/main.component').then((c) => c.MainComponent),
  },
];
