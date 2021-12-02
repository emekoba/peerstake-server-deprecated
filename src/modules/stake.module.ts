import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stake } from 'src/entities/Stake';
import { Customer } from 'src/entities/Customer';
import { StakeService } from 'src/services/stake.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Stake])],
  controllers: [],
  providers: [StakeService],
})
export class StakeModule {}
