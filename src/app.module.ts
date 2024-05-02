import { Module } from '@nestjs/common';
import { ScrapperModule } from './scraping/scrapper.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ScrapperModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
