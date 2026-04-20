import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { ROUTES } from './core/constants/routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: ROUTES.CYCLES.ROOT,
    pathMatch: 'full',
  },
  {
    path: ROUTES.LOGIN,
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: ROUTES.CYCLES.ROOT,
    loadComponent: () =>
      import('./features/cycles/cycles.component').then((m) => m.CyclesComponent),
    canActivate: [authGuard],
    children: [
      {
        path: `${ROUTES.CYCLES.INVOICE}/:cycleId`,
        loadComponent: () =>
          import('./features/cycles/invoice-dialog/invoice-dialog.component').then(
            (m) => m.InvoiceDialogComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: ROUTES.CYCLES.ROOT },
];
