import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 50 })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'smallint' })
  age: number;

  @Column({ type: 'varchar', length: 50 })
  fullName: string;

  @Column('text')
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
