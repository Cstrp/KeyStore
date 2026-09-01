import type { CreateOrderDto } from './dto/create-order.dto';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import type { Order } from '../../types';

@AllowAnonymous()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findById(id);
  }

  @Post('create')
  public async create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(dto);
  }
}
