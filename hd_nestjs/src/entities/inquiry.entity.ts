import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  userId?: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  category!: string;

  @Column()
  productCategory!: string;

  @Column({ nullable: true })
  productDetail?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  fabricType?: string;

  @Column({ nullable: true })
  gsm?: string;

  @Column({ nullable: true })
  fitStyle?: string;

  @Column({ nullable: true })
  label?: string;

  @Column({ type: 'text', nullable: true })
  sizes?: string;

  @Column({ nullable: true })
  quantity?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;
}