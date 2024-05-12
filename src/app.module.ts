import { Module } from '@nestjs/common';
import { ScrapperModule } from './scraping/scrapper.module';
import { ConfigModule } from '@nestjs/config';
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ScrapperModule, CatalogModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
