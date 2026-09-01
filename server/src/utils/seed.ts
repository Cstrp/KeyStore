import { keys } from '../constants';
import { CURRENCY, PRODUCT_TYPE } from '../enums';
import type { StorageService } from '../storage';
import type { DeliveryRecord, Order, Product, ProductKey } from '../types';

export const seed = async (storage: StorageService): Promise<void> => {
  const products: Product[] = [
    {
      sku: 'TOPUP-STEAM-1290',
      name: 'Баланс Steam',
      type: PRODUCT_TYPE.TOPUP,
      price: 1290,
      currency: CURRENCY.RUB,
      image: 'assets/steam.png',
      active: true,
    },
    {
      sku: 'KEY-CS2-PRIME',
      name: 'CS2 Прайм',
      type: PRODUCT_TYPE.KEY,
      price: 1490,
      currency: CURRENCY.RUB,
      image: 'assets/cs2.png',
      active: true,
    },
    {
      sku: 'SUB-ROBLOX-PREMIUM',
      name: 'Roblox Премиум',
      type: PRODUCT_TYPE.SUBSCRIPTION,
      price: 799,
      currency: CURRENCY.RUB,
      image: 'assets/roblox.png',
      active: true,
    },
    {
      sku: 'SUB-TELEGRAM-PREMIUM',
      name: 'Telegram Премиум',
      type: PRODUCT_TYPE.SUBSCRIPTION,
      price: 1390,
      currency: CURRENCY.RUB,
      image: 'assets/telegram.png',
      active: true,
    },
    {
      sku: 'TOPUP-PLAYSTATION',
      name: 'Баланс PlayStation',
      type: PRODUCT_TYPE.TOPUP,
      price: 2190,
      currency: CURRENCY.RUB,
      image: 'assets/playstation.png',
      active: true,
    },
    {
      sku: 'TOPUP-PUBG-UC',
      name: 'PUBG UC',
      type: PRODUCT_TYPE.TOPUP,
      price: 1190,
      currency: CURRENCY.RUB,
      image: 'assets/pubg.png',
      active: true,
    },
    {
      sku: 'SUB-CHATGPT-PLUS',
      name: 'ChatGPT Plus',
      type: PRODUCT_TYPE.SUBSCRIPTION,
      price: 1990,
      currency: CURRENCY.RUB,
      image: 'assets/chatgpt.png',
      active: true,
    },
    {
      sku: 'GIFT-APP-STORE',
      name: 'Код App Store',
      type: PRODUCT_TYPE.GIFTCARD,
      price: 2590,
      currency: CURRENCY.RUB,
      image: 'assets/app-store.png',
      active: true,
    },
    {
      sku: 'TOPUP-TIKTOK-COINS',
      name: 'Монеты TikTok',
      type: PRODUCT_TYPE.TOPUP,
      price: 790,
      currency: CURRENCY.RUB,
      image: 'assets/tiktok.png',
      active: true,
    },
    {
      sku: 'TOPUP-STEAM-2290',
      name: 'Баланс Steam',
      type: PRODUCT_TYPE.TOPUP,
      price: 2290,
      currency: CURRENCY.RUB,
      image: 'assets/steam.png',
      active: true,
    },
    {
      sku: 'GIFT-STEAM',
      name: 'Подарочная карта Steam',
      type: PRODUCT_TYPE.GIFTCARD,
      price: 1690,
      currency: CURRENCY.RUB,
      image: 'assets/steam.png',
      active: true,
    },
    {
      sku: 'GIFT-ROBLOX',
      name: 'Карта Roblox',
      type: PRODUCT_TYPE.GIFTCARD,
      price: 890,
      currency: CURRENCY.RUB,
      image: 'assets/roblox.png',
      active: true,
    },
    {
      sku: 'SUB-CHATGPT-PRO',
      name: 'ChatGPT Pro',
      type: PRODUCT_TYPE.SUBSCRIPTION,
      price: 2990,
      currency: CURRENCY.RUB,
      image: 'assets/chatgpt.png',
      active: true,
    },
    {
      sku: 'SUB-PLAYSTATION-PLUS',
      name: 'PlayStation Plus',
      type: PRODUCT_TYPE.SUBSCRIPTION,
      price: 2490,
      currency: CURRENCY.RUB,
      image: 'assets/playstation.png',
      active: true,
    },
    {
      sku: 'GIFT-TIKTOK',
      name: 'Баланс магазина TikTok',
      type: PRODUCT_TYPE.GIFTCARD,
      price: 1390,
      currency: CURRENCY.RUB,
      image: 'assets/tiktok.png',
      active: true,
    },
  ];

  for (const product of products) {
    await storage.set('products', product.sku, product);
  }

  for (const [index, code] of keys.entries()) {
    const id = `key-${index + 1}`;

    if (!(await storage.get<ProductKey>('keys', id))) {
      await storage.set('keys', id, {
        id,
        code,
        sku: products[index % products.length].sku,
        status: 'available',
      } satisfies ProductKey);
    }
  }

  const storedKeys = await storage.list<ProductKey>('keys');
  const availableKeys = storedKeys.filter(
    (key) => keys.includes(key.code) && key.status === 'available',
  );
  const demoKeys = storedKeys.filter((key) => key.code.startsWith('DEMO-'));
  const deliveries = await storage.list<DeliveryRecord>('deliveries');

  for (const demoKey of demoKeys) {
    if (demoKey.status === 'sold' && demoKey.orderId) {
      const order = await storage.get<Order>('orders', demoKey.orderId);
      const replacement = availableKeys.shift();

      if (!order || !replacement) {
        throw new Error(`Cannot replace invalid key ${demoKey.id}`);
      }

      replacement.sku = order.sku;
      replacement.status = 'sold';
      replacement.orderId = order.id;
      order.code = replacement.code;

      await storage.set('keys', replacement.id, replacement);
      await storage.set('orders', order.id, order);

      for (const delivery of deliveries) {
        if (delivery.orderId === order.id && delivery.code === demoKey.code) {
          delivery.code = replacement.code;
          await storage.set('deliveries', delivery.requestId, delivery);
        }
      }
    }

    await storage.delete('keys', demoKey.id);
  }

  for (const [index, code] of keys.entries()) {
    const id = `key-${index + 1}`;
    const storedKey = await storage.get<ProductKey>('keys', id);

    if (storedKey?.status === 'available') {
      await storage.set('keys', id, {
        id,
        code,
        sku: products[index % products.length].sku,
        status: 'available',
      } satisfies ProductKey);
    }
  }
};
