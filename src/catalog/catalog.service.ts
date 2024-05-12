import { Injectable } from '@nestjs/common';
import { HierarchyConfig } from '../config/catalog/hierarchy';

@Injectable()
export class CatalogService {
  getHierarchy() {
    return HierarchyConfig;
  }
}
