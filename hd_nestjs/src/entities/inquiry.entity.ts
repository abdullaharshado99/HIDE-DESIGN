import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn()
  id!: number;

  // CUSTOMER INFORMATION
  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  // PRODUCT INFORMATION
  @Column()
  category!: string;

  @Column()
  productCategory!: string;

  @Column({ nullable: true })
  productDetail?: string;

  // FABRIC & STYLE
  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  fabricType?: string;

  @Column({ nullable: true })
  gsm?: string;

  @Column({ nullable: true })
  fitStyle?: string;

  // CUSTOMIZATION
  @Column({ nullable: true })
  label?: string;

  @Column({ type: 'text', nullable: true })
  sizes?: string;

  // OTHER
  @Column({ nullable: true })
  quantity?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;
}