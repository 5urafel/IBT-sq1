import {
  InMemoryOrderRepository,
  OrderService,
  OrderNotFoundError,
  PaymentDeclinedError,
} from "./orders/index.ts";

import { seedOrders } from "./seed-orders.ts";

// Initialize repository
const repository = new InMemoryOrderRepository(seedOrders);

// Inject repository into service
const service = new OrderService(repository);

console.log("========== ALL ORDERS ==========");
console.log(repository.all());

console.log("\n========== FIND ORDER ==========");
console.log(service.find(1));

console.log("\n========== DELIVERY FEES ==========");
console.log(service.feesByArea());

console.log("\n========== CUSTOMER NAMES ==========");
console.log(service.summarise("customerName"));

console.log("\n========== ORDER STATUSES ==========");
console.log(service.summarise("status"));

console.log("\n========== ORDER TOTALS ==========");
console.log(service.summarise("total"));

// Test missing order
try {
  service.find(999);
} catch (error) {
  if (error instanceof OrderNotFoundError) {
    console.error(error.message);
    console.error("Missing order ID:", error.id);
  } else {
    throw error;
  }
}

// Test payment error
const paymentError = new PaymentDeclinedError(
  "0912345678",
  "Insufficient balance",
);

console.log("\n========== PAYMENT ERROR ==========");
console.log(paymentError.message);
