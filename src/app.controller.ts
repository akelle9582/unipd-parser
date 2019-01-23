import { Get, Post, Controller, Param, UseInterceptors, CacheInterceptor, Body } from '@nestjs/common';
import { AppService } from './app.service';

@UseInterceptors(CacheInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get(':id/:room')
  public async findOne(@Param() params) {
    return await this.appService.root(params.id, params.room);
  }

  @Get(':id/:room/:date')
  public async findWithDate(@Param() params) {
    return await this.appService.rootWithDate(params.id, params.room, params.date);
  }

  @Get('rooms')
  public async getRooms() {
    return await this.appService.getRooms();
  }

  @Post('add-heroku-app')
  public async addHerokuApp(@Body() body) {
    return await this.appService.addHerokuApp(body);
  }

  @Get()
  public root(): string {
    return 'hello world';
  }
}
