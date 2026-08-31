export const enum ORDER_STATUS {
  CREATED = 'created',
  PAID = 'paid',
  FAILED = 'failed',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  PAYMENT_FAILED = 'payment_failed',
  OUT_OF_STOCK = 'out_of_stock',
  DELIVERY_FAILED = 'delivery_failed',
}

export const enum PAYMENT_EVENT_STATUS {
  PAID = 'paid',
  PAYMENT_FAILED = 'failed',
  PENDING = 'pending',
  PROCESSED = 'processed',
  IGNORED = 'ignored',
}

export const enum PRODUCT_KEY_STATUS {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
}
