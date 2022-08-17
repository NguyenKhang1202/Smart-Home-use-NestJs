import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedGuard } from './auth/authenticated.guard';
@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get('/protected')
  @UseGuards(AuthenticatedGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
