import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto, RegDto } from 'src/dto/customer.dto';
import { Customer } from 'src/entities/Customer';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import messenger from 'src/utils/messenger';
import { UserToken } from 'src/interfaces';
import { JWT_EXPIRE_TIME, BCRYPT_SALT } from 'src/constants';

@Injectable()
export class CustomerService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
  ) {}

  reviseUserPayload(customer: Customer): Customer {
    delete customer.id;
    delete customer.password;
    delete customer.isLoggedIn;
    delete customer.verificationId;
    delete customer.token;

    return customer;
  }

  async userTokenMiddleWare(req, resp, options?: { noTimeout: boolean }) {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedException(
        'Unauthorized request',
        'This is an unauthorized request',
      );
    }

    const token = (authorization as string).match(/(?<=([b|B]earer )).*/g)?.[0];

    const unTokenized: UserToken = this.jwtService.decode(token) as UserToken;

    let user: Customer;

    try {
      user = await this.customerRepo.findOne({ id: unTokenized.userId });
    } catch (e) {
      if (e.name === 'EntityNotFound')
        throw new UnauthorizedException(
          'Unauthorized request',
          'This is an unauthorized request',
        );
      else {
        throw new InternalServerErrorException('Internal server error', e);
      }
    }

    if (!options?.noTimeout) {
      if (
        user.token &&
        new Date().getTime() - unTokenized.date <= JWT_EXPIRE_TIME * 1000
      ) {
        this.customerRepo.save({
          id: user.id,
          token: this.jwtService.sign({
            userId: user.id,
            date: new Date().getTime(),
          }),
        });
      } else {
        throw new UnauthorizedException(null, 'Session timeout');
      }
    }

    delete user.password;
    req.user = user;
  }

  async login({
    email,
    password,
  }: LoginDto): Promise<{ user: Customer; token: string }> {
    //* instanitate user of type Entity User
    let user: Customer;

    //* check if user exists in the database else throw Not Found Exception (Email Not Found)
    try {
      user = await this.customerRepo.findOneOrFail({
        where: { email },
      });
    } catch (exp) {
      throw new NotFoundException(null, 'Email Not Found');
    }

    //* check if password provided by user matches the password on the database else
    //* throw Not Acceptable Error (Invalid password)
    if (!(await bcrypt.compare(password, user.password))) {
      // Logger.error('Invalid email/password').console();
      throw new NotAcceptableException(null, 'Invalid password');
    }

    let token: any = {
      custId: user.id,
      date: new Date().getTime(),
    };

    token = await this.jwtService.signAsync(token);

    try {
      //* save the status of the user (logged in), the time of login and the new token generated
      //* for them back into the database
      await this.customerRepo.save({
        token,
        isLoggedIn: true,
        id: user.id,
        updatedAt: new Date(),
      });

      //* remove certain fields from the user before sending their info back as a response
      this.reviseUserPayload(user);

      //* send mail to user verifying they are the ones that logged in.
      messenger(user.email, 'You logged in', {
        text: 'A login has been identified on your account if this was not you, click here to reset password',
      });

      return { user, token };
    } catch (exp) {
      // Logger.error(exp).console();
      throw new InternalServerErrorException(null, 'Request processing error');
    }
  }

  async register(user: RegDto) {
    let {
      username,
      firstName,
      lastName,
      address,
      email,
      password,
      haveAgreed,
    } = user;

    try {
      password = await bcrypt.hash(password, BCRYPT_SALT);

      let user = new Customer();

      let emailValidationToken = Math.random()
        .toString()
        .match(/(?<=\d\.)\d+/g)[0];

      emailValidationToken = emailValidationToken.slice(
        emailValidationToken.length - 5,
        emailValidationToken.length,
      );

      user = {
        ...user,
        username,
        firstName,
        lastName,
        password,
        hasAcceptedAgreement: haveAgreed,
        address,
        email,
        verificationId: emailValidationToken, //UUID,
      };

      user = await this.customerRepo.save(user);

      // mail sent here is by a UUID link
      // sendMail(user.email, 'Email Verifiaction', {
      //   text: `Use this link to verify your email: ${process.env.BASE_URL}api/auth/user/emailVerification/${UUID}`,
      // });

      // mail sent here is by token
      messenger(user.email, 'Email Verification', {
        text: `Use this token to validate you mail before logging into the app: ${emailValidationToken}`,
      });

      return user;
    } catch (exp) {
      // Logger.error(exp).console();

      if (exp.errno !== 1062) {
        throw new InternalServerErrorException(null, exp);
      } else {
        throw new NotAcceptableException(null, 'user already exists');
      }
    }
  }

  async socialLogin({ uid, haveAgreed, type }) {
    let customer: Customer;
    let token: any;
    let fbUser: any;

    // try {
    //   fbUser = (await this.app.auth().getUser(uid))?.toJSON();
    //   const verificationId = uuid.v4();

    //   user = new User();
    //   user = {
    //     ...user,
    //     email: fbUser.email,
    //     hasAcceptedAgreement: haveAgreed,
    //   };
    //   user = await this.customerRepo.save(user);
    //   token = await this.tokenCreator(user);

    //   const newUser = await this.customerRepo.save({
    //     id: user.id,
    //     token,
    //     isLoggedIn: true,
    //     updatedAt: new Date(),
    //   });
    //   user = Object.assign(user, newUser);

    //   this.makeUserForPublicView(user);

    //   sendMail(user.email, 'You logged in', {
    //     text:
    //       'A facebook login has been identified on your account if this was not you, click here to reset password',
    //   });

    //   return { user, token };
    // } catch (exp) {
    //   if (exp.errno === 1062) {
    //     user = await this.customerRepo.findOne({
    //       where: { email: fbUser.email },
    //     });

    //     token = await this.tokenCreator(user);

    //     const newUser = await this.customerRepo.save({
    //       token,
    //       isLoggedIn: true,
    //       id: user.id,
    //       updatedAt: new Date(),
    //       hasAcceptedAgreement: haveAgreed,
    //     });

    //     user = Object.assign(user, newUser);
    //     this.makeUserForPublicView(user);

    //     sendMail(user.email, 'You logged in', {
    //       text:
    //         'A facebook login has been identified on your account if this was not you, click here to reset password',
    //     });

    //     return { user, token };
    //   } else {
    //     Logger.error(exp).console();

    //     throw new InternalServerErrorException(
    //       null,
    //       'Request processing error',
    //     );
    //   }
    // }
  }

  async updateCustomer(updateCustomerDto) {
    const { customerId, header, description, expenses } = updateCustomerDto;

    // const { username, firstName, lastName, address, email } = body;

    let original_customer;

    let updated_customer;

    //* get original customer
    try {
      original_customer = await this.customerRepo.findOneOrFail({
        where: { id: customerId },
      });
    } catch (e) {
      // Logger.log(e).console();
      throw new NotFoundException(null, 'customer not found');
    }

    //* update original customer with new details
    try {
      updated_customer = this.customerRepo.save({
        id: customerId,
        header: header || original_customer.header,
        description: description || original_customer.description,
        updatedAt: new Date(),
      });
    } catch (e) {
      // Logger.error(e).console();
      throw new InternalServerErrorException(null, 'request processing');
    }

    return updated_customer;
  }

  async getCustomersBalance(id: number) {
    let customer = await this.customerRepo.findOneOrFail({
      where: { id },
    });

    console.log(customer);
  }
}
