import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stake } from 'src/entities/Stake';
import { Repository } from 'typeorm';
import messenger from 'src/utils/messenger';

@Injectable()
export class StakeService {
  constructor(@InjectRepository(Stake) private stakeRepo: Repository<Stake>) {}

  async createStake(req_payload) {}
}
