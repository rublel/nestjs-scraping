import { Module } from '@nestjs/common';
import { GcsController } from './gcs.controller';
import { GCSService } from './gcs.service';
import { ScrapperModule } from 'src/scraping/scrapper.module';

@Module({
  imports: [ScrapperModule],
  controllers: [GcsController],
  providers: [GCSService],
  exports: [],
})
export class GcsModule {}
