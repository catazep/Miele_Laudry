export interface Tariff extends PayloadTariff {
  id: string;
}

export interface PayloadTariff {
  name: string;
  price: number;
  currency: string;
}
