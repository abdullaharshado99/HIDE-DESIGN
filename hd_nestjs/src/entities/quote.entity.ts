import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 160 })
  name?: string;

  @Column({ length: 190 })
  email?: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  phone?: string | null;

  @Column({ length: 80 })
  category?: string;

  @Column({ type: 'text' })
  message?: string;

  @Column({ length: 30, default: 'new' })
  status?: string;

  @CreateDateColumn()
  createdAt?: Date;
}