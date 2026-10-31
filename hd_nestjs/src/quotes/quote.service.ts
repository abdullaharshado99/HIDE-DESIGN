import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from '../entities/quote.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Injectable()
export class QuoteService {
  constructor(@InjectRepository(Quote) private readonly quotes: Repository<Quote>) { }

  create(dto: CreateQuoteDto) {
    const newQuote = this.quotes.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      category: dto.category,
      message: dto.message,
      imageUrl: dto.imageUrl,
    });

    return this.quotes.save(newQuote);
  }

  findAll() { return this.quotes.find({ order: { createdAt: 'DESC' } }); }

  async remove(id: number) {
    const quote = await this.quotes.findOne({ where: { id } });
    if (!quote) throw new NotFoundException('Quote not found');
    await this.quotes.remove(quote);
    return { deleted: true, id };
  }
}