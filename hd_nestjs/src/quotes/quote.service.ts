import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from '../entities/quote.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Injectable()
export class QuoteService {
  constructor(@InjectRepository(Quote) private readonly quotes: Repository<Quote>) {}

  create(dto: CreateQuoteDto) { return this.quotes.save(this.quotes.create(dto)); }
  findAll() { return this.quotes.find({ order: { createdAt: 'DESC' } }); }
}