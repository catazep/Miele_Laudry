import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CyclesService } from '../../core/services/cycles.service';
import { DevicesService } from '../../core/services/devices.service';
import { CycleRow } from './cycle-row.model';
import { CyclesListComponent } from './cycles-list/cycles-list.component';

@Component({
  selector: 'app-cycles',
  templateUrl: './cycles.component.html',
  styleUrls: ['./cycles.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, CyclesListComponent],
})
export class CyclesComponent {
  private readonly cyclesService = inject(CyclesService);
  private readonly devicesService = inject(DevicesService);

  public readonly cycleRows$: Observable<CycleRow[]> = combineLatest([
    this.cyclesService.getAll(),
    this.devicesService.getAll(),
  ]).pipe(
    map(([cycles, devices]) =>
      cycles
        .map((cycle): CycleRow | undefined => {
          const device = devices.find((d) => d.id === cycle.deviceId);

          if (!device) {
            console.error(`Device ${cycle.deviceId} missing.`);

            return undefined;
          }

          return {
            id: cycle.id,
            userId: cycle.userId,
            userAgent: cycle.userAgent,
            deviceName: device?.name ?? 'Unknown device',
            deviceType: device?.type,
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
