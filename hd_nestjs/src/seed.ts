import 'reflect-metadata';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { Quote } from './entities/quote.entity';
import { User } from './entities/user.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'hide_design',
  password: process.env.DB_PASSWORD ?? 'hide_design',
  database: process.env.DB_NAME ?? 'hide_design',
  entities: [User, Product, Quote],
  synchronize: true,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    console.log(`📍 Connecting to: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'hide_design'}`);
    
    await dataSource.initialize();
    console.log('✅ Database connection established');
    
    const users = dataSource.getRepository(User);
    const email = (process.env.ADMIN_EMAIL ?? 'admin@hidesdesign.com').toLowerCase();
    const existing = await users.findOne({ where: { email } });
    if (!existing) {
      console.log(`👤 Creating admin user: ${email}`);
      await users.save(users.create({
        email,
        passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD ?? 'change-this-password', 12),
        role: 'admin',
      }));
      console.log('✅ Admin user created');
    } else {
      console.log(`✅ Admin user already exists: ${email}`);
    }
    console.log('✅ Product seeding skipped (managed via admin panel)');
    
    console.log('🎉 Seeding completed successfully!');
    await dataSource.destroy();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message);
    console.error('Error details:', error);
    await dataSource.destroy().catch(() => {});
    process.exit(1);
  }
}

seed().catch(async (error) => {
  console.error(error);
  if (dataSource.isInitialized) await dataSource.destroy();
  process.exit(1);
});