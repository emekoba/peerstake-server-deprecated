import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/entities/Admin';
import { Customer } from 'src/entities/Customer';
import { CustomerService } from 'src/services/customer.service';
import { CustomerController } from '../controllers/customer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Admin])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
