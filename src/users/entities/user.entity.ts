import { Exclude } from 'class-transformer';
import { IsEnum } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 50 })
  username: string;

  @Exclude()
  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'smallint', default: null })
  age?: number;

  @Column({ type: 'varchar', length: 50 })
  fullName: string;

  @Column('text')
  role: string;

  @Column({ type: 'varchar', length: 50 })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
