export const DEVICE_TYPES = [
  'washer',
  'dryer',
  'dishwasher',
  'sterilizer',
  'washer-disinfector',
] as const;

export type DeviceType = (typeof DEVICE_TYPES)[number];

export interface PayloadDevice {
  name: string;
  type: DeviceType;
  tariffId: string;
}

export interface Device extends PayloadDevice {
  id: string;
}
