import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ROUTES } from '../../../core/constants/routes';
import { CycleRow } from '../cycle-row.model';
import { MergePeriodPipe } from '../../../shared/pipes/merge-period.pipe';

@Component({
  selector: 'app-cycles-list',
  templateUrl: './cycles-list.component.html',
  styleUrls: ['./cycles-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatTooltipModule, MatButtonModule, MergePeriodPipe],
})
export class CyclesListComponent {
  private readonly router = inject(Router);

  public readonly cycles = input<CycleRow[]>([]);

  public readonly displayedColumns = ['user', 'device', 'tariff', 'period', 'status', 'invoice'];

  public viewInvoice(cycle: CycleRow): void {
    this.router.navigate(['/', ROUTES.CYCLES.ROOT, ROUTES.CYCLES.INVOICE, cycle.id]);
  }
}
