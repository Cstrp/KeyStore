import { DeliveryProviderService } from './delivery-provider.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { Order, ProductKey } from '../../types';
import { Injectable } from '@nestjs/common';
import { StorageService } from '../../storage';
import { ORDER_STATUS } from '../../enums';
import { EVENTS } from '../../events';

@Injectable()
export class DeliveryService {
  public constructor(
    private readonly provider: DeliveryProviderService,
    private readonly storage: StorageService,
    private readonly events: EventEmitter2,
  ) {}

  public async deliver(orderId: string): Promise<void> {
    await this.storage.withLock(`delivery-order-${orderId}`, async () => {
      const order = await this.storage.get<Order>('orders', orderId);

      if (!order) {
        return;
      }

      if (order.status === 'delivered') {
        return;
      }

      if (
        order.status !== 'paid' &&
        order.status !== 'out_of_stock' &&
        order.status !== 'delivery_failed'
      ) {
        return;
      }

      order.status = ORDER_STATUS.DELIVERING;

      await this.storage.set('orders', order.id, order);

      this.events.emit(EVENTS.DELIVERY_REQUESTED, {
        orderId: order.id,
      });

      const requestId = `req-${order.id}`;

      let code = await this.withTimeout(
        this.provider.issue('A', order, requestId),
        5_000,
      );

      if (!code) {
        code = await this.withTimeout(
          this.provider.issue('B', order, requestId),
          5_000,
        );
      }

      if (!code) {
        order.status = (await this.hasStock(order))
          ? ORDER_STATUS.DELIVERY_FAILED
          : ORDER_STATUS.OUT_OF_STOCK;

        await this.storage.set('orders', order.id, order);

        this.events.emit(EVENTS.ORDER_RECOVERY_REQUIRED, {
          orderId: order.id,
        });

        return;
      }

      order.status = ORDER_STATUS.DELIVERED;
      order.code = code;

      await this.storage.set('orders', order.id, order);

      this.events.emit(EVENTS.DELIVERY_SUCCEEDED, {
        orderId: order.id,
        code,
      });

      this.events.emit(EVENTS.ORDER_DELIVERED, {
        orderId: order.id,
      });
    });
  }

  private async hasStock(order: Order): Promise<boolean> {
    const keys = await this.storage.list<ProductKey>('keys');

    return keys.some(
      (key) => key.sku === order.sku && key.status === 'available',
    );
  }

  private async withTimeout<T>(
    promise: Promise<T>,
    timeout: number,
  ): Promise<T | undefined> {
    let timer: NodeJS.Timeout | undefined;

    try {
      return await Promise.race([
        promise,

        new Promise<undefined>((resolve) => {
          timer = setTimeout(() => resolve(undefined), timeout);
        }),
      ]);
    } finally {
      if (timer) {
        clearTimeout(timer);
      }
    }
  }
}
