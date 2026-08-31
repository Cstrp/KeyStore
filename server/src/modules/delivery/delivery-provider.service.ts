import type { DeliveryRecord, Order, ProductKey } from '../../types';
import { Injectable, Logger } from '@nestjs/common';
import { PRODUCT_KEY_STATUS } from '../../enums';
import { StorageService } from '../../storage';

@Injectable()
export class DeliveryProviderService {
  private readonly logger = new Logger(DeliveryProviderService.name);

  public constructor(private readonly storage: StorageService) {}

  public async issue(
    provider: 'A' | 'B',
    order: Order,
    requestId: string,
  ): Promise<string | undefined> {
    const existing = await this.storage.get<DeliveryRecord>(
      'deliveries',
      requestId,
    );

    if (existing?.status === 'success' && existing.code) {
      return existing.code;
    }

    const shouldFail = Math.random() < 0.15;

    const shouldTimeout = Math.random() < 0.15;

    if (shouldFail) {
      return undefined;
    }

    const code = await this.allocateKey(order, requestId, provider);

    if (!code) {
      return undefined;
    }

    if (shouldTimeout) {
      await new Promise<void>((resolve) => setTimeout(resolve, 8_000));
    }

    return code;
  }

  private async allocateKey(
    order: Order,
    requestId: string,
    provider: 'A' | 'B',
  ): Promise<string | undefined> {
    return this.storage.withLock(`inventory-${order.sku}`, async () => {
      const existing = await this.storage.get<DeliveryRecord>(
        'deliveries',
        requestId,
      );

      if (existing?.status === 'success' && existing.code) {
        return existing.code;
      }

      const keys = await this.storage.list<ProductKey>('keys');

      const key = keys.find(
        (item) => item.sku === order.sku && item.status === 'available',
      );

      if (!key) {
        await this.storage.set('deliveries', requestId, {
          requestId,
          orderId: order.id,
          sku: order.sku,
          provider,
          status: 'failed',
          reason: 'out_of_stock',
          createdAt: existing?.createdAt ?? new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } satisfies DeliveryRecord);

        return undefined;
      }

      key.status = PRODUCT_KEY_STATUS.SOLD;
      key.orderId = order.id;

      await this.storage.set('keys', key.id, key);

      const record: DeliveryRecord = {
        requestId,
        orderId: order.id,
        sku: order.sku,
        provider,
        status: 'success',
        code: key.code,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set('deliveries', requestId, record);

      this.logger.debug(`Issued ${key.code} via provider ${provider}`);

      return key.code;
    });
  }
}
