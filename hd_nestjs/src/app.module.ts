import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './products/product.module';
import { QuoteModule } from './quotes/quote.module';
import { InvoicesModule } from './invoices/invoice.module';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Quote } from './entities/quote.entity';
import { Invoice } from './entities/invoice.entity';
import { Inquiry } from './entities/inquiry.entity';
import { CustomerModule } from './customers/customer.module';
import { InquiryModule } from './inquiries/inquiry.module';
import { WardrobeItem } from './entities/wardrobe-item.entity';
import { WardrobeModule } from './wardrobe/wardrobe.module';
import { Order } from './entities/order.entity';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USER', 'hide_design'),
        password: config.get('DB_PASSWORD', 'hide_design'),
        database: config.get('DB_NAME', 'hide_design'),
        entities: [
          User,
          Product,
          Quote,
          Invoice,
          Inquiry,
          WardrobeItem,
          Order
        ],
        synchronize:
          config.get('DB_SYNCHRONIZE', 'false') === 'true',
        ssl:
          config.get('DB_SSL', 'false') === 'true'
            ? {
              rejectUnauthorized: false,
            }
            : false,
      }),
    }),

    AuthModule,
    ProductModule,
    QuoteModule,
    InvoicesModule,
    InquiryModule,
    CustomerModule,
    WardrobeModule,
    OrderModule
  ],

  controllers: [
    AppController,
    HealthController,
  ],

  providers: [
    AppService,
  ],
})
export class AppModule { }