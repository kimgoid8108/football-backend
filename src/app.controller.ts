import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {
      message: 'Football Squad Builder API',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        squads: '/api/squads',
      },
    };
  }
}
