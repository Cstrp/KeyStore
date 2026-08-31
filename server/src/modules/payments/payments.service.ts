import type { PaymentWebhookDto } from './dto/payment-webhook.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { Order, PaymentEvent } from '../../types';
import { ORDER_STATUS, PAYMENT_EVENT_STATUS } from '../../enums';
import { Injectable } from '@nestjs/common';
import { StorageService } from '../../storage';
import { EVENTS } from '../../events';
import { OnEvent } from '@nestjs/event-emitter';
import type { PaymentReceivedEvent } from '../../events';
import type { OrderCreatedEvent } from '../../events';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly storage: StorageService,
    private readonly events: EventEmitter2,
  ) {}

  public async handleWebhook(dto: PaymentWebhookDto): Promise<void> {
    const result = await this.storage.withLock(
      `payment-${dto.event_id}`,
      async () => {
        const existing = await this.storage.get<PaymentEvent>(
          'payments',
          dto.event_id,
        );

        if (existing) {
          return existing;
        }

        const event: PaymentEvent = {
          id: dto.event_id,
          eventId: dto.event_id,
          orderId: dto.order_id,
          status: dto.status,
          amount: dto.amount,
          currency: dto.currency,
          state: 'pending',
          createdAt: dto.created_at,
        };

        await this.storage.set('payments', event.eventId, event);

        return event;
      },
    );

    await this.events.emitAsync(EVENTS.PAYMENT_RECEIVED, {
      eventId: result.eventId,
      orderId: result.orderId,
    });
  }

  @OnEvent(EVENTS.PAYMENT_RECEIVED)
  public async onPaymentReceived(event: PaymentReceivedEvent): Promise<void> {
    await this.process(event.eventId);
  }

  @OnEvent(EVENTS.ORDER_CREATED)
  public async onOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await this.processPendingForOrder(event.orderId);
  }

  public async processPendingForOrder(orderId: string): Promise<void> {
    const events = await this.storage.list<PaymentEvent>('payments');

    for (const event of events) {
      if (event.orderId === orderId && event.state === 'pending') {
        await this.process(event.eventId);
      }
    }
  }

  public async process(eventId: string): Promise<void> {
    await this.storage.withLock(`order-${eventId}`, async () => {
      const event = await this.storage.get<PaymentEvent>('payments', eventId);

      if (!event || event.state === 'processed') {
        return;
      }

      const order = await this.storage.get<Order>('orders', event.orderId);

      if (!order) return;

      order.status =
        event.status === PAYMENT_EVENT_STATUS.PAID
          ? PAYMENT_EVENT_STATUS.PAID
          : ORDER_STATUS.PAYMENT_FAILED;

      order.updatedAt = new Date().toISOString();

      await this.storage.set('orders', order.id, order);

      event.state = 'processed';
      event.processedAt = new Date().toISOString();

      await this.storage.set('payments', event.eventId, event);

      await this.events.emitAsync(EVENTS.PAYMENT_PROCESSED, {
        eventId: event.eventId,
        orderId: event.orderId,
      });
    });
  }
}
