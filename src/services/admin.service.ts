import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/entities/Admin';
import { Repository } from 'typeorm';
import messenger from 'src/utils/messenger';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(Admin) private adminRepo: Repository<Admin>) {}

  async adminTokenMiddleWare(req, resp, options?: { noTimeout: boolean }) {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedException(
        'Unauthorized request',
        'This is an unauthorized request',
      );
    }

    // const token = (authorization as string).match(/(?<=([b|B]earer )).*/g)?.[0];

    // const unTokenized: UserToken = this.jwtService.decode(token) as UserToken;

    // let user: Customer;

    // try {
    //   user = await this.customerRepo.findOne({ id: unTokenized.userId });
    // } catch (e) {
    //   if (e.name === 'EntityNotFound')
    //     throw new UnauthorizedException(
    //       'Unauthorized request',
    //       'This is an unauthorized request',
    //     );
    //   else {
    //     throw new InternalServerErrorException('Internal server error', e);
    //   }
    // }

    // if (!options?.noTimeout) {
    //   if (
    //     user.token &&
    //     new Date().getTime() - unTokenized.date <= JWT_EXPIRE_TIME * 1000
    //   ) {
    //     this.customerRepo.save({
    //       id: user.id,
    //       token: this.jwtService.sign({
    //         userId: user.id,
    //         date: new Date().getTime(),
    //       }),
    //     });
    //   } else {
    //     throw new UnauthorizedException(null, 'Session timeout');
    //   }
    // }

    // delete user.password;
    // req.user = user;
  }

  async login(body) {}

  async createAdmin(adminId) {}

  async getAllCustomers(adminId) {}
}
