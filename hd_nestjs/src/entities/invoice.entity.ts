import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 160 })
  name?: string;

  @Column({ length: 190 })
  email?: string;

  @Column({ length: 40 })
  phone?: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  company?: string | null;

  @Column({ length: 160 })
  productName?: string;

  @Column({ length: 60 })
  articleNumber?: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  color?: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  fabricType?: string | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  fabricGsm?: string | null;

  @Column({ type: 'text', array: true, nullable: true })
  sizes?: string[] | null;

  @Column({ type: 'int' })
  quantity?: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  unit?: string | null;

  @Column({ type: 'text', nullable: true })
  additionalNotes?: string | null;

  @Column({ type: 'varchar', length: 1500, nullable: true })
  designFileUrl?: string | null;

  @Column({ type: 'text', nullable: true })
  specifications?: string | null;

  @Column({ length: 30, default: 'new' })
  status?: string;

  @CreateDateColumn()
  createdAt?: Date;
}