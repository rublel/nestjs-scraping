/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';

@Controller()
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Get('decathlon/:section/:category')
  async getCatalogData(
    @Param('section') section: string,
    @Param('category') category: string,
    @Query('from') from: number,
    @Query('size') size: number,
  ) {
    return this.scrapperService.exec({ section, category, from, size });
  }

  @Get('decathlon/:section/:category/:id')
  async getProductData(
    @Param('section') section: string,
    @Param('category') category: string,
    @Param('id') id: string,
  ) {
    return this.scrapperService.getProductData({ section, category, id });
  }
}
