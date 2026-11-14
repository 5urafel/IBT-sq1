export const DELIVERY_AREAS = [
  "Bole",
  "Piassa",
  "Merkato",
  "Kazanchis",
] as const;

export type Area = (typeof DELIVERY_AREAS)[number];

export type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type Dish = {
  name: string;
  price: number;
};

export type Order = {
  readonly id: number;
  customerName: string;
  area: Area;
  status: OrderStatus;
  dishes: Dish[];
  teleBirrPhone?: string;
  total: number;
};
