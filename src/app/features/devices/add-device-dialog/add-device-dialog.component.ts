import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';

import { DEVICE_TYPES, DeviceType, PayloadDevice, PayloadTariff } from '../../../core/models';

export interface AddDeviceDialogResult {
  device: Omit<PayloadDevice, 'tariffId'>;
  tariff: PayloadTariff;
}

@Component({
  selector: 'app-add-device-dialog',
  templateUrl: './add-device-dialog.component.html',
  styleUrls: ['./add-device-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatAutocompleteModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
})
export class AddDeviceDialogComponent {
  public readonly dialogRef = inject(MatDialogRef<AddDeviceDialogComponent>);

  public readonly deviceTypes: { value: DeviceType; label: string }[] = DEVICE_TYPES.map((type) => ({
    value: type,
    label: type.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('-'),
  }));
  private readonly allCurrencies: string[] = Intl.supportedValuesOf('currency');

  public readonly form = new FormGroup({
    device: new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: Validators.required }),
      type: new FormControl<DeviceType>(DEVICE_TYPES[0], { nonNullable: true, validators: Validators.required }),
    }),
    tariff: new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: Validators.required }),
      price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
      currency: new FormControl('', { nonNullable: true, validators: Validators.required }),
    }),
  });

  public readonly filteredCurrencies = toSignal(
    this.form.controls.tariff.controls.currency.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filter = value.toLowerCase();
        return this.allCurrencies.filter((currency) => currency.toLowerCase().includes(filter));
      }),
    ),
    { initialValue: this.allCurrencies },
  );

  public submit(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.getRawValue() as AddDeviceDialogResult);
  }

  public cancel(): void {
    this.dialogRef.close(null);
  }
}
