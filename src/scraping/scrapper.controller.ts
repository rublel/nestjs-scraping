/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Product } from './product.entity';
import { ApiRecordsResponse } from 'src/config/documentation/api.response.decorator';

@ApiTags(ScrapperService.name)
@Controller('scrapper')
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Get('decathlon/:section/:category')
  @ApiParam({ name: 'from', type: 'number', required: false })
  @ApiParam({ name: 'size', type: 'number', required: false })
  @ApiRecordsResponse({ type: [Product], status: 200, isArray: true })
  @HttpCode(HttpStatus.OK)
  async getCatalogData(
    @Param('section') section: string,
    @Param('category') category: string,
    @Query('from') from?: number,
    @Query('size') size?: number,
  ) {
    return this.scrapperService.exec({ section, category, from, size });
  }

  @Get('decathlon/:section/:category/:id')
  @ApiRecordsResponse({ type: Product, status: 200, isArray: false })
  @HttpCode(HttpStatus.OK)
  async getProductData(
    @Param('section') section: string,
    @Param('category') category: string,
    @Param('id') id: string,
  ) {
    return this.scrapperService.search({ section, category, id });
  }
}
