import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

import { DevicesService } from '../../core/services/devices.service';
import { TariffsService } from '../../core/services/tariffs.service';
import { AuthService } from '../../core/services/auth.service';
import { DeviceType, Tariff } from '../../core/models';
import {
  LateralTab,
  LateralTabsComponent,
} from '../../shared/components/lateral-tabs/lateral-tabs.component';

const DEVICE_ICONS: Record<DeviceType, string> = {
  washer: 'fa-solid fa-shirt',
  dryer: 'fa-solid fa-wind',
  dishwasher: 'fa-solid fa-utensils',
  sterilizer: 'fa-solid fa-flask',
  'washer-disinfector': 'fa-solid fa-shield-halved',
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
  imports: [MatTabsModule, MatButtonModule, LateralTabsComponent, DecimalPipe, TitleCasePipe],
})
export class DevicesComponent {
  private readonly devicesService = inject(DevicesService);
  private readonly tariffsService = inject(TariffsService);
  public readonly authService = inject(AuthService);

  public readonly deviceGroups = toSignal(
    combineLatest([this.devicesService.getAll(), this.tariffsService.getAll()]).pipe(
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

  public readonly matTabGroupMaxWidth = computed(() =>
    Math.min(this.deviceGroups().length * 320, 960),
  );

  public readonly selectedDeviceIndex = signal(0);

  public onTypeTabChange(): void {
    this.selectedDeviceIndex.set(0);
  }

  public addDevice(): void {
    console.log('Add device');
  }

  public addCycle(): void {
    console.log('Add cycle');
  }
}
