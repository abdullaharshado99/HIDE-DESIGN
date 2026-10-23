import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column({ type: 'jsonb' })
    items!: any[];

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount!: number;

    @Column({ length: 20 })
    paymentMethod!: string; // 'COD' | 'Card'

    @Column({ type: 'text' })
    shippingAddress!: string;

    @Column({ length: 40 })
    phone!: string;

    @Column({ length: 30, default: 'pending' })
    status!: string; // 'pending' | 'paid' | 'shipped'

    @CreateDateColumn()
    createdAt!: Date;
}