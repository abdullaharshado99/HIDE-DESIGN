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
  vintageEffect?: string;

  @Column({ nullable: true })
  fitStyle?: string;

  @Column({ nullable: true })
  printingTechnique?: string;

  @Column({ nullable: true })
  rhinestone?: string;

  @Column({ nullable: true })
  label?: string;

  @Column({ type: 'text', nullable: true })
  sizes?: string;

  @Column({ nullable: true })
  quantity?: string;

  @Column({ nullable: true })
  fileName?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ default: 'pending' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}