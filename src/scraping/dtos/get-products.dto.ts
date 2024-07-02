// src/dtos/YourDtoName.dto.ts

import {
  IsNumberString,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { HierarchyConfig } from 'src/config/catalog/hierarchy';
import { ApiProperty } from '@nestjs/swagger';

export class GetProductsParamsDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(HierarchyConfig.map(({ section }) => section))
  @ApiProperty({
    enum: HierarchyConfig.map(({ section }) => section),
    required: true,
  })
  section: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(HierarchyConfig.flatMap(({ categories }) => categories))
  @ApiProperty({
    enum: HierarchyConfig.flatMap(({ categories }) => categories),
    required: true,
  })
  category: string;
}

export class GetProducsQueryDto {
  @IsOptional()
  // @IsNumberString()
  @ApiProperty({
    type: Number,
    required: false,
  })
  from?: number;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    type: Number,
    required: false,
    maximum: 40,
  })
  size?: number;
}
