import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { LoginDto, RegDto } from 'src/dto/customer.dto';
import { CustomerService } from 'src/services/customer.service';
import { validator } from 'src/utils/validator';
import { Middleware, UseMiddleware } from 'src/middleware';
import { Customer } from 'src/entities/Customer';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Middleware
  async userGuard(req, resp, next) {
    await this.customerService.userTokenMiddleWare(req, resp);
  }

  @Post('login')
  async loginController(
    @Req() req,
    @Res({ passthrough: true }) resp,
    @Body() body: LoginDto,
  ) {
    const { password, email } = body;

    //* run validation on the request body. return a boolean to affrim that the syntax is correct.
    const hasError = validator([
      {
        name: 'email',
        value: email,
        options: { required: true, isEmail: true },
      },
      {
        name: 'password',
        value: password,
        options: {
          required: true,
          isPassword: true,
          lengthLesserThan: 20,
          lengthGreatherThan: 8,
        },
      },
    ]);

    //* If no errors are present, send request body to the service
    if (!hasError) {
      //* service performs all operations and returns a response
      const response = await this.customerService.login(body);

      //* return response from server
      return {
        // user: response.user,
        // token: response.token,
        message: 'operation successful',
      };
    } else {
      throw new NotFoundException(null, 'Invalid email/password');
    }
  }

  @Post('register')
  async regsiterController(
    @Req() req,
    @Res({ passthrough: true }) resp,
    @Body() body: RegDto,
  ) {
    const {
      username,
      password,
      cPassword,
      firstName,
      lastName,
      address,
      email,
    } = body;

    const hasError = validator([
      {
        name: 'password',
        value: password,
        options: {
          required: true,
          isString: true,
          lengthGreatherThan: 8,
          lengthLesserThan: 20,
          isPassword: true,
        },
      },
      {
        name: 'username',
        value: username,
        options: { required: true, isString: true },
      },
      {
        name: 'confirm password',
        value: cPassword,
        options: { required: true, isString: true, equalTo: password },
      },
      {
        name: 'address',
        value: address,
        options: { required: true, isString: true },
      },
      {
        name: 'firstname',
        value: firstName,
        options: { required: true, isString: true },
      },
      {
        name: 'lastname',
        value: lastName,
        options: { required: true, isString: true },
      },
      {
        name: 'email',
        value: email,
        options: { required: true, isString: true, isEmail: true },
      },
    ]);

    if (!hasError) {
      const user = await this.customerService.register(body);

      resp.json({ user, descrption: 'operaton sucessful', code: 0 });
    } else {
      throw new NotAcceptableException('', hasError?.[0].msg[0]);
    }
  }

  @Put('update')
  @UseMiddleware('userGuard')
  async updateCustomer(@Req() req, @Res() resp, @Body() body) {
    const { username, firstName, lastName, address, email } = body;

    const hasError = validator([
      {
        name: 'username',
        value: username,
        options: { required: true, isString: true },
      },
      {
        name: 'address',
        value: address,
        options: { required: true, isString: true },
      },
      {
        name: 'firstname',
        value: firstName,
        options: { required: true, isString: true },
      },
      {
        name: 'lastname',
        value: lastName,
        options: { required: true, isString: true },
      },
      {
        name: 'email',
        value: email,
        options: { required: true, isString: true, isEmail: true },
      },
    ]);

    if (!hasError) {
      const user = await this.customerService.updateCustomer(body);

      resp.json({ user, descrption: 'operaton sucessful', code: 0 });
    } else {
      throw new NotAcceptableException('', hasError?.[0].msg[0]);
    }
  }

  @Get('balance')
  async getBalanceController(@Req() req, @Res() resp) {
    let { customerId } = req.query;

    const errorMsgs = validator([
      {
        name: 'customer id',
        value: +customerId,
        options: { required: true, isNumber: true },
      },
    ]);

    if (errorMsgs) {
      throw new NotAcceptableException(null, errorMsgs?.[0].msg?.[0]);
    }

    const balance = await this.customerService.getCustomersBalance(customerId);

    resp.json({
      code: 0,
      description: 'operation successful',
      balance,
    });
  }
}
