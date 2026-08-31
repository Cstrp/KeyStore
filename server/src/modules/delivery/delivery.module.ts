import { DeliveryProviderService } from './delivery-provider.service';
import { DeliveryListeners } from './delivery.listeners';
import { DeliveryService } from './delivery.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [DeliveryService, DeliveryListeners, DeliveryProviderService],
})
export class DeliveryModule {}
