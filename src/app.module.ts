import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { CustomerModule } from './modules/customer.module';
import { StakeModule } from './modules/stake.module';
import { Customer } from './entities/Customer';
import { Wallet } from './entities/Wallet';
import { Stake } from './entities/Stake';

config();

const {
  DB_PORT: port,
  DB_USERNAME: username,
  DB_PASSWORD: password,
  DB_HOST: host,
  DB_NAME: database,
} = process.env;

const dbConfig: TypeOrmModuleOptions = {
  host,
  port: 3306,
  username,
  password,
  database,
  type: 'mysql',
  entities: [Customer, Wallet, Stake],
  synchronize: true,
};

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([Customer]),
    CustomerModule,
    StakeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
