import { EVENTS, type PaymentReceivedEvent } from '../../events';
import { DeliveryService } from './delivery.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeliveryListeners {
  public constructor(private readonly delivery: DeliveryService) {}

  @OnEvent(EVENTS.PAYMENT_PROCESSED)
  public async onPaymentProcessed(event: PaymentReceivedEvent): Promise<void> {
    await this.delivery.deliver(event.orderId);
  }
}
