import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CycleRow } from '../cycle-row.model';

@Component({
  selector: 'app-cycles-list',
  templateUrl: './cycles-list.component.html',
  styleUrls: ['./cycles-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatTooltipModule, MatButtonModule, DatePipe],
})
export class CyclesListComponent {
  public readonly cycles = input<CycleRow[]>([]);

  public readonly displayedColumns = ['user', 'device', 'period', 'status', 'invoice'];
  public readonly dateFormat = 'dd.MM.yy [HH:mm]';

  public viewInvoice(cycle: CycleRow) {
    console.log(cycle.invoiceLines);
  }
}
