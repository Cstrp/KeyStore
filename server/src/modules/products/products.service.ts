import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from '../../storage';
import type { Product } from '../../types';

@Injectable()
export class ProductsService {
  constructor(private readonly storage: StorageService) {}

  public async findBySku(sku: string): Promise<Product> {
    const product = await this.storage.get<Product>('products', sku);

    if (!product || !product.active) {
      throw new NotFoundException(`Product with SKU ${sku} not found`);
    }

    return product;
  }

  public async findAll(): Promise<Product[]> {
    return this.storage.list<Product>('products');
  }
}
