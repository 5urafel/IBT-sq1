const DELIVERY_AREAS = ["Bole", "Piassa", "Merkato", "Kazanchis"] as const;

type Area = (typeof DELIVERY_AREAS)[number];

type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

type Dish = {
  name: string;
  price: number; // Price in santim
};

type Order = {
  readonly id: number;
  customerName: string;
  area: Area;
  status: OrderStatus;
  dishes: Dish[];
  teleBirrPhone?: string;
  total: number; // Total in santim
};

// Format santim as Ethiopian Birr (ETB)
const formatETB = (amountInSantim: number): string => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
  }).format(amountInSantim / 100);
};

// Calculate delivery fee
function deliveryFee(order: Order): number {
  if (order.total > 50000) {
    return 0;
  }

  return order.area === "Bole" ? 4000 : 6000;
}

// Return a message for each order status
function statusMessage(status: OrderStatus): string {
  switch (status) {
    case "Pending":
      return "Your order is waiting for confirmation.";

    case "Preparing":
      return "Your food is being prepared.";

    case "Ready":
      return "Your order is ready for pickup.";

    case "Out for Delivery":
      return "Your order is on its way.";

    case "Delivered":
      return "Your order has been delivered.";
    case "Cancelled":
      return "Your order has been cancelled.";

    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}

// Generate order receipt
function receipt(order: Order): string {
  const fee = deliveryFee(order);
  const dishesList = order.dishes
    .map((dish) => `${dish.name}: ${formatETB(dish.price)}`)
    .join("\n");

  return `
========== ORDER RECEIPT ==========
Order ID: ${order.id}
Customer: ${order.customerName}
Delivery Area: ${order.area}

---------- ITEMS ----------
${dishesList}

Subtotal: ${formatETB(order.total)}
Delivery Fee: ${formatETB(fee)}
Total: ${formatETB(order.total + fee)}

Status: ${statusMessage(order.status)}
${order.teleBirrPhone ? `TeleBirr Phone: ${order.teleBirrPhone}` : ""}
===================================
`;
}
