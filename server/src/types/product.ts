import type { CURRENCY } from '../enums';

export const PRODUCT_TYPES = [
  'topup',
  'key',
  'subscription',
  'giftcard',
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];

export interface Product {
  readonly sku: string;
  readonly name: string;
  readonly type: ProductType;
  readonly price: number;
  readonly currency: keyof typeof CURRENCY;
  readonly image?: string;
  readonly active: boolean;
}

export interface ProductKey {
  id: string;
  code: string;
  sku: string;

  status: 'available' | 'reserved' | 'sold';

  orderId?: string;
}

export interface DeliveryRecord {
  readonly requestId: string;
  readonly orderId: string;
  readonly sku: string;

  provider?: string;
  status: 'pending' | 'success' | 'failed';

  code?: string;
  reason?: string;

  readonly createdAt: string;
  updatedAt: string;
}
