import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AdminGuard } from '../auth/admin.guard';
import { Quote } from '../entities/quote.entity';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';

@Module({
  imports: [TypeOrmModule.forFeature([Quote]), AuthModule],
  controllers: [QuoteController],
  providers: [QuoteService, AdminGuard],
})
export class QuoteModule {}