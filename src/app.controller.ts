import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/status')
  async serverStatus(@Req() req, @Res() resp) {
    const routes = (global as any).app
      .getHttpServer()
      ._events.request._router.stack.map((item) => item.route?.path)
      .filter((item) => item);

    resp.json({ status: 'Application server is up', routes });
  }
}
