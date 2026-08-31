import type { CURRENCY, PAYMENT_EVENT_STATUS } from '../enums';

export type PaymentStatus = 'paid' | 'failed';

export type PaymentEventState = 'pending' | 'processed';

export interface PaymentEvent {
  readonly id: string;
  readonly eventId: string;
  readonly orderId: string;

  readonly status: PAYMENT_EVENT_STATUS;
  readonly amount: number;
  readonly currency: CURRENCY;

  state: PaymentEventState;

  readonly createdAt: string;
  processedAt?: string;
}
