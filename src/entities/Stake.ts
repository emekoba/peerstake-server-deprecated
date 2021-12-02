import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './Customer';
import { Currencies } from '../enums';

@Entity()
export class Stake {
  constructor(data?: Stake) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => (this[index] = data[index]));
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  amount?: number;

  @Column({ type: 'enum', enum: Currencies, default: Currencies.NAIRA })
  currency?: number;

  @OneToMany(() => Customer, (customer) => customer.stake)
  @JoinColumn()
  customers?: Customer[];

  // @Column({ type: 'timestamp' })
  // createdAt?: Date;

  // @Column({ type: 'timestamp' })
  // updatedAt?: Date;
}
