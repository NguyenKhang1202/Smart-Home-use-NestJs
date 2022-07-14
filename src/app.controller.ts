import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { ConfigService } from '@nestjs/config';

@Controller('home')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
