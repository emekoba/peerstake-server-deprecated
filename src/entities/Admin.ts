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

@Entity()
export class Admin {
  constructor(data?: Admin) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => (this[index] = data[index]));
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'bool', default: false })
  isLoggedIn: boolean;

  @Column({ type: 'bool', default: false })
  isSuperAdmin: boolean;

  @ManyToOne(() => Admin, (admin) => admin.adminsCreated)
  creator?: Admin;

  @OneToMany(() => Admin, (admin) => admin.creator)
  adminsCreated?: Admin[];

  // @Column({ type: 'bool', default: false })
  // hasOnboarded: boolean;

  // @Column({ type: 'timestamp' })
  // createdAt: Date;

  // @Column({ type: 'timestamp' })
  // updatedAt: Date;

  // @Column({ type: 'timestamp' })
  // dateOfBirth: Date;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'varchar' })
  forgetPasswordToken: string;
}
