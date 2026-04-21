import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CyclesService } from '../../core/services/cycles.service';
import { DevicesService } from '../../core/services/devices.service';
import { TariffsService } from '../../core/services/tariffs.service';
import { CycleRow } from './cycle-row.model';
import { CyclesListComponent } from './cycles-list/cycles-list.component';

@Component({
  selector: 'app-cycles',
  templateUrl: './cycles.component.html',
  styleUrls: ['./cycles.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, CyclesListComponent, RouterOutlet],
})
export class CyclesComponent {
  private readonly cyclesService = inject(CyclesService);
  private readonly devicesService = inject(DevicesService);
  private readonly tariffsService = inject(TariffsService);

  public readonly cycleRows$: Observable<CycleRow[]> = combineLatest([
    this.cyclesService.getAll(),
    this.devicesService.getAll(),
    this.tariffsService.getAll(),
  ]).pipe(
    map(([cycles, devices, tariffs]) =>
      cycles
        .map((cycle): CycleRow | undefined => {
          const device = devices.find((d) => d.id === cycle.deviceId);

          if (!device) {
            console.error(`Device ${cycle.deviceId} missing.`);
            return undefined;
          }

          const tariff = tariffs.find((t) => t.id === device.tariffId);

          if (!tariff) {
            console.error(`Tariff ${device.tariffId} missing.`);
            return undefined;
          }

          return {
            id: cycle.id,
            userId: cycle.userId,
            userAgent: cycle.userAgent,
            deviceName: device.name,
            deviceType: device.type,
            tariff: `${tariff.price} ${tariff.currency}`,
            startedAt: cycle.startedAt,
            stoppedAt: cycle.stoppedAt,
            status: cycle.status,
            invoiceLines: cycle.invoiceLines,
          };
        })
        .filter((row): row is CycleRow => !!row),
    ),
  );
}
