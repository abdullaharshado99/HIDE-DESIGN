import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wardrobe_items')
export class WardrobeItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column({ length: 60 })
    articleNumber!: string;

    @Column({ length: 160 })
    name!: string;

    @Column({ length: 1500 })
    imageUrl!: string;

    @Column({ length: 120, nullable: true })
    material?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price?: number | null;

    @Column({ length: 3, default: 'USD' })
    currency!: string;

    @CreateDateColumn()
    createdAt!: Date;
}