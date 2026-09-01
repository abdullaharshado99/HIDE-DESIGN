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
    const products = dataSource.getRepository(Product);
    const catalogue = [
      ['HD-M01', 'The Regent', 'men', 'Wool · Tailored Double-Breasted', '/images/men/men-01.jpg'],
      ['HD-M02', 'The Heritage', 'men', 'Tweed · Classic Longline', '/images/men/men-02.jpg'],
      ['HD-M03', 'The Executive', 'men', 'Wool Blend · Modern Fit', '/images/men/men-03.jpg'],
      ['HD-M04', 'The Sovereign', 'men', 'Cashmere Blend · Luxury Finish', '/images/men/men-04.jpg'],
      ['HD-M05', 'The Traveller', 'men', 'Wool · Relaxed Tailoring', '/images/men/men-05.jpg'],
      ['HD-W01', 'The Elena', 'women', 'Wool · Sculpted Silhouette', '/images/women/women-01.jpg'],
      ['HD-W02', 'The Camille', 'women', 'Tweed · Soft Tailoring', '/images/women/women-02.jpg'],
      ['HD-W03', 'The Victoria', 'women', 'Wool Blend · Refined Fit', '/images/women/women-03.jpg'],
      ['HD-W04', 'The Celeste', 'women', 'Cashmere Blend · Signature Finish', '/images/women/women-04.jpg'],
      ['HD-W05', 'The Grace', 'women', 'Wool · Contemporary Longline', '/images/women/women-05.jpg'],
    ] as const;
    
    let productCount = 0;
    for (const [articleNumber, name, audience, material, imageUrl] of catalogue) {
      const exists = await products.findOne({ where: { articleNumber } });
      if (!exists) {
        await products.save(products.create({ articleNumber, name, audience, material, imageUrl, category: 'coats', description: material, price: null, currency: 'USD', published: true }));
        productCount++;
      }
    }
    if (productCount > 0) {
      console.log(`📦 Created ${productCount} products`);
    } else {
      console.log('✅ All products already exist');
    }
    
    console.log('🎉 Seeding completed successfully!');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
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