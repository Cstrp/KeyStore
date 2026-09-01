import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import type { Product } from '../../types';

@AllowAnonymous()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  public async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':sku')
  public async findOne(@Param('sku') sku: string): Promise<Product> {
    return this.productsService.findBySku(sku);
  }
}
