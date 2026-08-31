import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from '../../storage';
import { ProductsService } from '../products';
import type { CreateOrderDto } from './dto/create-order.dto';
import type { Order } from '../../types';
import { randomUUID } from 'crypto';
import { CURRENCY, ORDER_STATUS } from '../../enums';
import { EVENTS } from '../../events';

@Injectable()
export class OrdersService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly storage: StorageService,
    private readonly events: EventEmitter2,
  ) {}

  public async findById(id: string): Promise<Order> {
    const order = await this.storage.get<Order>('orders', id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  public async create(dto: CreateOrderDto): Promise<Order> {
    const product = await this.productsService.findBySku(dto.sku);
    const now = new Date().toISOString();

    const order: Order = {
      id: randomUUID(),
      sku: product.sku,
      amount: product.price,
      currency: CURRENCY.RUB,
      status: ORDER_STATUS.CREATED,
      createdAt: now,
      updatedAt: now,
    };

    await this.storage.set('orders', order.id, order);
    this.events.emit(EVENTS.ORDER_CREATED, { orderId: order.id });

    return order;
  }

  public async update(order: Order): Promise<void> {
    order.updatedAt = new Date().toISOString();

    await this.storage.set('orders', order.id, order);
  }
}
