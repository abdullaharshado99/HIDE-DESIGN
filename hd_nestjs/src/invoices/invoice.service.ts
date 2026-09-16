import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { CreateCustomInquiryDto } from '../quotes/dto/create-quote.dto';

@Injectable()
export class InvoicesService {
  constructor(@InjectRepository(Invoice) private readonly invoices: Repository<Invoice>) {}

  create(dto: CreateCustomInquiryDto) {
    return this.invoices.save(this.invoices.create(dto));
  }

  findAll() {
    return this.invoices.find({ order: { createdAt: 'DESC' } });
  }
}