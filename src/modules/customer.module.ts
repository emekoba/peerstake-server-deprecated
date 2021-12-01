import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/entities/Customer';
import { CustomerService } from 'src/services/customer.service';
import { CustomerController } from '../controllers/customer.controller';
import { config } from 'dotenv';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRE_TIME, jwt_secret } from 'src/constants';

config();

const jwtConfig = JwtModule.register({
  secret: jwt_secret,
  signOptions: { expiresIn: `${JWT_EXPIRE_TIME}s` },
});

@Module({
  imports: [jwtConfig, TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
