export type CycleStatus = 'in-progress' | 'completed' | 'cancelled' | 'failure';

export interface InvoiceLine {
  name: string;
  totalPrice: number;
  currency: string;
}

export interface PayloadCycle {
  startedAt: string;
  stoppedAt?: string;
  status: CycleStatus;
  userId: string;
  userAgent: string;
  deviceId: string;
  invoiceLines: InvoiceLine[];
}

export interface Cycle extends PayloadCycle {
  id: string;
}
