import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ROUTES } from '../../../core/constants/routes';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
})
export class NavComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public readonly routes = ROUTES;
  public readonly currentUser = this.authService.currentUser;

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/', ROUTES.LOGIN]);
  }
}
