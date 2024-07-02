import { Module } from '@nestjs/common';
import { ScrapperModule } from './scraping/scrapper.module';
import { ConfigModule } from '@nestjs/config';
import { CatalogModule } from './catalog/catalog.module';
import { GcsModule } from './gcs/gcs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScrapperModule,
    CatalogModule,
    GcsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
