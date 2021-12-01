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
import { LoginDto } from 'src/dto/customer.dto';
import { AdminService } from 'src/services/admin.service';
import { validator } from 'src/utils/validator';
import { Middleware, UseMiddleware } from 'src/middleware';

@Controller('admin')
export class CustomerController {
  constructor(private readonly adminService: AdminService) {}

  @Middleware
  async userGuard(req, resp, next) {
    await this.adminService.adminTokenMiddleWare(req, resp);
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
      const response = await this.adminService.login(body);

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

  @Get('all-customers')
  async getBalanceController(@Req() req, @Res() resp) {
    let { adminId } = req.query;

    const errorMsgs = validator([
      {
        name: 'customer id',
        value: +adminId,
        options: { required: true, isNumber: true },
      },
    ]);

    if (errorMsgs) {
      throw new NotAcceptableException(null, errorMsgs?.[0].msg?.[0]);
    }

    const customers = await this.adminService.getAllCustomers(adminId);

    resp.json({
      code: 0,
      description: 'operation successful',
      customers,
    });
  }
}
