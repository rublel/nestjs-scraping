import { Controller, Get } from '@nestjs/common';
import { GCSService } from './gcs.service';

@Controller('gcs')
export class GcsController {
  constructor(private readonly gcsService: GCSService) {}

  @Get('upload')
  async upload() {
    return this.gcsService.exec();
  }
}
