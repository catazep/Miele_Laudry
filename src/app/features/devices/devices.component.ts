import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { combineLatest, Subject, throwError } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, take } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';

import { CyclesService } from '../../core/services/cycles.service';
import { DevicesService } from '../../core/services/devices.service';
import { TariffsService } from '../../core/services/tariffs.service';
import { AuthService } from '../../core/services/auth.service';
import { DeviceType, PayloadCycle, PayloadDevice, PayloadTariff, Tariff } from '../../core/models';
import {
  LateralTab,
  LateralTabsComponent,
} from '../../shared/components/lateral-tabs/lateral-tabs.component';
import {
  ConfirmCycleDialogComponent,
  ConfirmCycleDialogData,
} from './confirm-cycle-dialog/confirm-cycle-dialog.component';
import {
  AddDeviceDialogComponent,
  AddDeviceDialogResult,
} from './add-device-dialog/add-device-dialog.component';

const DEVICE_ICONS: Record<DeviceType, string> = {
  washer: 'fa-solid fa-shirt',
  dryer: 'fa-solid fa-wind',
  dishwasher: 'fa-solid fa-utensils',
  sterilizer: 'fa-solid fa-flask',
  'washer-disinfector': 'fa-solid fa-shield-halved',
};

// Hardcoded names
const CYCLE_INVOICE_NAMES: Record<DeviceType, string> = {
  washer: 'Washing cycle',
  dryer: 'Drying cycle',
  dishwasher: 'Dishwashing cycle',
  sterilizer: 'Sterilization cycle',
  'washer-disinfector': 'Disinfection cycle',
};

interface DeviceGroupItem {
  id: string;
  name: string;
  type: DeviceType;
  tariff: Tariff | undefined;
}

interface DeviceGroup {
  type: DeviceType;
  tabs: LateralTab[];
  devices: DeviceGroupItem[];
}

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    LateralTabsComponent,
    DecimalPipe,
    TitleCasePipe,
  ],
})
export class DevicesComponent {
  private readonly devicesService = inject(DevicesService);
  private readonly tariffsService = inject(TariffsService);
  private readonly cyclesService = inject(CyclesService);
  private readonly dialog = inject(MatDialog);
  private readonly toastr = inject(ToastrService);
  public readonly authService = inject(AuthService);

  private readonly refreshSubject = new Subject<void>();

  public readonly deviceGroups = toSignal(
    this.refreshSubject
      .pipe(
        startWith(undefined),
        switchMap(() =>
          combineLatest([this.devicesService.getAll(), this.tariffsService.getAll()]),
        ),
      )
      .pipe(
        map(([devices, tariffs]) => {
          const types = [...new Set(devices.map((d) => d.type))] satisfies DeviceType[];
          return types.map((type) => {
            const groupDevices = devices
              .filter((d) => d.type === type)
              .map((d) => ({ ...d, tariff: tariffs.find((t) => t.id === d.tariffId) }));

            const icon = DEVICE_ICONS[type];
            return {
              type,
              tabs: groupDevices.map((d) => ({ label: d.name, icon }) satisfies LateralTab),
              devices: groupDevices,
            } satisfies DeviceGroup;
          });
        }),
      ),
    { initialValue: [] satisfies DeviceGroup[] },
  );

  public readonly matTabGroupMaxWidth = computed(() => {
    const minLengthAllowe = this.deviceGroups().length < 2 ? 2 : this.deviceGroups().length;
    return Math.min(minLengthAllowe * 320, 960);
  });

  public readonly selectedDeviceIndex = signal(0);

  public onTypeTabChange(): void {
    this.selectedDeviceIndex.set(0);
  }

  public addDevice(): void {
    const dialogRef = this.dialog.open(AddDeviceDialogComponent);

    dialogRef
      .afterClosed()
      .pipe(
        filter((result): result is AddDeviceDialogResult => !!result),
        switchMap((result) => {
          const tariffPayload: PayloadTariff = result.tariff;
          return this.tariffsService.create(tariffPayload).pipe(
            switchMap((tariff) =>
              this.devicesService
                .create({
                  ...result.device,
                  tariffId: tariff.id,
                } satisfies PayloadDevice)
                .pipe(
                  // Normally this is backend job,
                  // But just for fun and demonstration of error handling and rollback
                  catchError((err) =>
                    this.tariffsService
                      .delete(tariff.id)
                      .pipe(switchMap(() => throwError(() => err))),
                  ),
                ),
            ),
          );
        }),
        take(1),
      )
      .subscribe({
        next: () => {
          this.refreshSubject.next();
          this.toastr.success('Device added successfully', 'Success');
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to add device');
        },
      });
  }

  public startCycle(device: DeviceGroupItem): void {
    const dialogRef = this.dialog.open<ConfirmCycleDialogComponent, ConfirmCycleDialogData>(
      ConfirmCycleDialogComponent,
      {
        data: { deviceName: device.name } satisfies ConfirmCycleDialogData,
      },
    );

    dialogRef
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => {
          const user = this.authService.currentUser()!;
          const payload: PayloadCycle = {
            startedAt: new Date().toISOString(),
            status: 'in-progress',
            userId: user.id,
            userAgent: navigator.userAgent,
            deviceId: device.id,
            invoiceLines: device.tariff
              ? [
                  {
                    name: CYCLE_INVOICE_NAMES[device.type],
                    totalPrice: device.tariff.price,
                    currency: device.tariff.currency,
                  },
                ]
              : [],
          };
          return this.cyclesService.create(payload);
        }),
        take(1),
      )
      .subscribe({
        next: () => this.toastr.success(`Cycle started for ${device.name}`, 'Success'),
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to start cycle');
        },
      });
  }
}
