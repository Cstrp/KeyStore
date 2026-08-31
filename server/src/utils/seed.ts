import { keys } from '../constants';
import { CURRENCY, PRODUCT_TYPE } from '../enums';
import type { StorageService } from '../storage';
import type { Product, ProductKey } from '../types';

export const seed = async (storage: StorageService): Promise<void> => {
  const products: Product[] = [
    {
      sku: 'KEY-CS2-PRIME',
      name: 'CS2 Prime Status ключ',
      type: PRODUCT_TYPE.KEY,
      price: 1290,
      currency: CURRENCY.RUB,
      image: 'assets/cs2.png',
      active: true,
    },
  ];

  for (const product of products) {
    if (!(await storage.get<Product>('products', product.sku))) {
      await storage.set('products', product.sku, product);
    }
  }

  for (const [index, code] of keys.entries()) {
    const key: ProductKey = {
      id: `key-${index + 1}`,
      code,
      sku: 'KEY-CS2-PRIME',
      status: 'available',
    };

    if (!(await storage.get<ProductKey>('keys', key.id))) {
      await storage.set('keys', key.id, key);
    }
  }
};
