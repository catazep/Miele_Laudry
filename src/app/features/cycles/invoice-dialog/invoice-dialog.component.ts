import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { CyclesService } from '../../../core/services/cycles.service';
import { DevicesService } from '../../../core/services/devices.service';
import { InvoiceLine } from '../../../core/models';
import { ROUTES } from '../../../core/constants/routes';
import { of } from 'rxjs';

export interface InvoiceDialogData {
  userId: string;
  deviceName: string;
  invoiceLines: InvoiceLine[];
}

@Component({
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.component.html',
  styleUrls: ['./invoice-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
})
export class InvoiceDialogComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cyclesService = inject(CyclesService);
  private readonly devicesService = inject(DevicesService);

  public readonly selectedTab = signal(0);

  public readonly invoiceData = toSignal<InvoiceDialogData | undefined>(
    this.route.paramMap.pipe(
      map((p) => p.get('cycleId')!),
      switchMap((id) => this.cyclesService.getById(id)),
      switchMap((cycle) =>
        this.devicesService.getById(cycle.deviceId).pipe(
          map(
            (device) =>
              ({
                userId: cycle.userId,
                deviceName: device.name,
                invoiceLines: cycle.invoiceLines,
              }) satisfies InvoiceDialogData,
          ),
        ),
      ),
      catchError((err) => {
        console.error('Invoice fetch failed:', err);
        this.close();
        return of(undefined);
      }),
    ),
  );

  public close(): void {
    this.router.navigate(['/', ROUTES.CYCLES.ROOT]);
  }
}
