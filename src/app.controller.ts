import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/questions')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':quizId')
  async GetQuestion(@Query() quizId : number): Promise<string> {
    return this.appService.getHello();
  }
}
