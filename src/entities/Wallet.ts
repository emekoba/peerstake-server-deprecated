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
export class Wallet {
  constructor(data?: Wallet) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => (this[index] = data[index]));
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  balance?: number;

  @Column({ type: 'enum', enum: Currencies, default: Currencies.NAIRA })
  currency?: number;

  @OneToOne(() => Customer, (customer) => customer.wallet)
  @JoinColumn()
  customer?: Customer;

  // @Column({ type: 'timestamp' })
  // createdAt?: Date;

  // @Column({ type: 'timestamp' })
  // updatedAt?: Date;
}
