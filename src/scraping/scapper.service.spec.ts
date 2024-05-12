import { Test, TestingModule } from '@nestjs/testing';
import { ScrapperService } from './scrapper.service';
import { CatalogService } from '../catalog/catalog.service';

describe('ScrapperService', () => {
  let scrapper: ScrapperService;
  let catalog: CatalogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapperService, CatalogService],
    }).compile();

    scrapper = module.get<ScrapperService>(ScrapperService);
    catalog = module.get<CatalogService>(CatalogService);
  });

  it('should be defined', () => {
    expect(scrapper).toBeDefined();
  });

  it('should return a list of products', async () => {
    const hierarchy = catalog.getHierarchy();
    const sections = hierarchy.map((el) => el.section);

    for (const section of sections) {
      const { categories } = hierarchy.find((el) => el.section === section);
      for (const category of categories) {
        console.log(`🔍 Scraping section ${section} for category ${category}`);
        const { records, totalSize } = await scrapper.exec({
          section,
          category,
        });
        expect(records).toBeDefined();
        expect(records).toBeInstanceOf(Array);
        expect(records.length).toBeGreaterThan(0);
        expect(totalSize).toBeDefined();
        expect(totalSize).toBeGreaterThan(0);
        console.log(
          `✅ Scraping section ${section} for category ${category} returned ${totalSize} records`,
        );
      }
    }
  }, 1200000);
});
