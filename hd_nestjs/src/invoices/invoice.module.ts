import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AdminGuard } from '../auth/admin.guard';
import { Invoice } from '../entities/invoice.entity';
import { InvoicesController } from './invoice.controller';
import { InvoicesService } from './invoice.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice]), AuthModule],
  controllers: [InvoicesController],
  providers: [InvoicesService, AdminGuard],
})
export class InvoicesModule {}