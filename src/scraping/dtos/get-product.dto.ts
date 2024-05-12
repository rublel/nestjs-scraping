import { IsNotEmpty, IsNumberString } from 'class-validator';
import { GetProductsParamsDto } from './get-products.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetProductParamsDto extends GetProductsParamsDto {
  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({
    type: Number,
    required: true,
  })
  reference: string;
}
