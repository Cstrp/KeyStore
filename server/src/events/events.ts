export const EVENTS = {
  ORDER_CREATED: 'order.created',
  PAYMENT_RECEIVED: 'payment.received',
  PAYMENT_PROCESSED: 'payment.processed',

  DELIVERY_REQUESTED: 'delivery.requested',
  DELIVERY_SUCCEEDED: 'delivery.succeeded',
  DELIVERY_FAILED: 'delivery.failed',

  ORDER_DELIVERED: 'order.delivered',
  ORDER_RECOVERY_REQUIRED: 'order.recovery-required',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

export interface OrderCreatedEvent {
  readonly orderId: string;
}

export interface PaymentReceivedEvent {
  readonly eventId: string;
  readonly orderId: string;
}

export interface DeliveryRequestedEvent {
  readonly orderId: string;
}

export interface DeliverySucceededEvent {
  readonly orderId: string;
  readonly code: string;
}
