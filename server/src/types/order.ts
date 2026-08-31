import { CURRENCY, ORDER_STATUS, type PAYMENT_EVENT_STATUS } from '../enums';

export interface Order {
  readonly id: string;
  readonly sku: string;
  readonly amount: number;
  readonly currency: [keyof typeof CURRENCY][number];
  status: ORDER_STATUS | PAYMENT_EVENT_STATUS;

  readonly createdAt: string;
  updatedAt: string;

  code?: string;
}
