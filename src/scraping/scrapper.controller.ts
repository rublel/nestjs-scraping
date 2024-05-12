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
import { Product } from './entities/product.entity';
import { ApiRecordsResponse } from 'src/config/documentation/api.response.decorator';
import {
  GetProducsQueryDto,
  GetProductsParamsDto,
} from './dtos/get-products.dto';
import { GetProductParamsDto } from './dtos/get-product.dto';

@ApiTags(ScrapperService.name)
@Controller('scrapper')
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Get('decathlon/:section/:category')
  @ApiRecordsResponse({ type: [Product], status: 200, isArray: true })
  @HttpCode(HttpStatus.OK)
  async getCatalogData(
    @Param() { section, category }: GetProductsParamsDto,
    @Query() { from, size }: GetProducsQueryDto,
  ) {
    return this.scrapperService.exec({
      section,
      category,
      from,
      size,
    });
  }

  @Get('decathlon/:section/:category/:reference')
  @ApiRecordsResponse({ type: Product, status: 200, isArray: false })
  @HttpCode(HttpStatus.OK)
  async getProductData(
    @Param() { section, category, reference }: GetProductParamsDto,
  ) {
    return this.scrapperService.search({ section, category, reference });
  }
}
