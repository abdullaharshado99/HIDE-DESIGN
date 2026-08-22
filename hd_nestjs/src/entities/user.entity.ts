import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type UserRole = 'admin' | 'customer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 190 })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: ['admin', 'customer'], default: 'customer' })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;
}