import { Status } from './status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  deviceName: string;

  @Column({ type: 'varchar' })
  roomId: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar', default: Status.OFF })
  status?: string;

  @Column({ type: 'int' })
  wattage: number;

  // = CreateDateColumn()
  @Column({
    type: 'datetime',
    default: () => 'NOW()',
  })
  startTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
// Nếu có default thì ko cần ? nữa
// Tuy nhiên nếu chỉ có ? thì bắt buộc cần có default
// vì khi ? nó không có giá trị mặc định
