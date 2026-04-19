export type DeviceType = 'washer' | 'dryer';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  tariffId: number;
}
