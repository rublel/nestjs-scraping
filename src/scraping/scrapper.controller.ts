/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';

@Controller()
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Get('decathlon/:gender/:category')
  async getCatalogData(
    @Param('gender') gender: string,
    @Param('category') category: string,
    @Query('from') from: number,
    @Query('size') size: number,
  ) {
    return this.scrapperService.exec({ gender, category, from, size });
  }
}
