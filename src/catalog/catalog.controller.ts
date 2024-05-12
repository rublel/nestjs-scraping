import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { HierarchyConfigResponse } from 'src/config/catalog/hierarchy';

@ApiTags(CatalogService.name)
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('decathlon/hierarchy')
  @ApiResponse({
    type: HierarchyConfigResponse,
    status: 200,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  async getCatalogData() {
    return this.catalogService.getHierarchy();
  }
}
