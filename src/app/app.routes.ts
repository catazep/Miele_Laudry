import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { ROUTES } from './core/constants/routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: ROUTES.CYCLES,
    pathMatch: 'full',
  },
  {
    path: ROUTES.LOGIN,
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: ROUTES.CYCLES,
    loadComponent: () =>
      import('./features/cycles/cycles-list/cycles-list.component').then(
        (m) => m.CyclesListComponent,
      ),
    canActivate: [authGuard],
  },
];
