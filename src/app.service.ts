import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/entities/Customer';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  defaultUser = {
    id: 1,
    firstName: 'Russell',
    lastName: 'Jidechukwu',
    username: 'Emekoba',
    createdAt: new Date(),
    // updatedAt: new Date(),
    address: 'Area 3 Garki, Abuja, Nigeria',
    phone: '08076607130',
    email: 'rjemekoba@gmail.com',
    isBlocked: false,
    isLoggedIn: false,
    isValidated: true,
    hasAcceptedAgreement: true,
    gender: 'male',
    token: '',
    password: '',
    verificationId: '',
  };

  constructor(
    @InjectRepository(Customer)
    private readonly userRepo: Repository<Customer>,
  ) {}

  async onApplicationBootstrap() {
    let defaultUser = new Customer();
    defaultUser = { ...defaultUser, ...this.defaultUser };

    // this.userRepo.save(this.defaultUser);
  }
}
