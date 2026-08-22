import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private readonly products: Repository<Product>) {}

  findPublished() {
    return this.products.find({ where: { published: true }, order: { createdAt: 'DESC' } });
  }

  findAll() {
    return this.products.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const product = await this.products.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Article not found');
    return product;
  }

  create(dto: CreateProductDto) {
    return this.products.save(this.products.create(dto));
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.products.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.products.remove(product);
    return { deleted: true };
  }
}