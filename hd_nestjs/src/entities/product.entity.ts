import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true, length: 60 })
  articleNumber?: string;

  @Column({ length: 160 })
  name?: string;

  @Column({ length: 30 })
  category?: string;

  @Column({ length: 30 })
  audience?: string;

  @Column({ length: 120 })
  material?: string;

  @Column({ type: 'text' })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number | null;

  @Column({ length: 3, default: 'USD' })
  currency?: string;

  @Column({ length: 1500 })
  imageUrl?: string;

  @Column({ default: true })
  published?: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}