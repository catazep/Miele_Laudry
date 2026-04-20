import { CycleStatus, DeviceType, InvoiceLine } from '../../core/models';

export interface CycleRow {
  id: string;
  userId: string;
  userAgent: string;
  deviceName: string;
  deviceType: DeviceType;
  startedAt: string;
  stoppedAt?: string;
  status: CycleStatus;
  invoiceLines: InvoiceLine[];
}
