import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmCycleDialogData {
  deviceName: string;
}

@Component({
  selector: 'app-confirm-cycle-dialog',
  templateUrl: './confirm-cycle-dialog.component.html',
  styleUrls: ['./confirm-cycle-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
})
export class ConfirmCycleDialogComponent {
  readonly data = inject<ConfirmCycleDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ConfirmCycleDialogComponent>);

  public confirm(): void {
    this.dialogRef.close(true);
  }

  public cancel(): void {
    this.dialogRef.close(false);
  }
}
