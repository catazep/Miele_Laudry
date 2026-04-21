export type DeviceType = 'washer' | 'dryer' | 'dishwasher' | 'sterilizer' | 'washer-disinfector';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  tariffId: string;
}
