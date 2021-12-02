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
import { StakeService } from 'src/services/stake.service';
import { CustomerService } from 'src/services/customer.service';
import { validator } from 'src/utils/validator';
import { Middleware, UseMiddleware } from 'src/middleware';

@Controller('stake')
export class StakeController {
  constructor(
    private readonly stakeService: StakeService,
    private readonly customerService: CustomerService,
  ) {}

  @Middleware
  async userGuard(req, resp, next) {
    await this.customerService.userTokenMiddleWare(req, resp);
  }

  @Post('create-stake')
  async createStakeController(
    @Req() req,
    @Res({ passthrough: true }) resp,
    @Body() body,
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
      const response = await this.stakeService.createStake(body);

      //* return response from server
      return {
        stake: response,
        message: 'operation successful',
      };
    } else {
      throw new NotAcceptableException(null, 'Could Not Create Stake');
    }
  }
}
