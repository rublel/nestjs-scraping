import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseMetadata,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

export const ApiRecordsResponse = <T>(
  options: ApiResponseMetadata,
): MethodDecorator => {
  const isArray = Array.isArray(options.type);
  const properties = isArray
    ? {
        records: {
          type: 'array',
          items: { $ref: getSchemaPath(options.type[0]) },
        },
        totalSize: { type: 'number', example: 1 },
      }
    : {
        record: { $ref: getSchemaPath(options.type as Type<unknown>) },
      };

  const dataDto: Type<T> = isArray ? options.type[0] : options.type;
  const responseOptions: ApiResponseOptions = {
    description: options.description,
    status: options.status,
    schema: {
      type: 'object',
      properties,
    },
  };

  return applyDecorators(ApiExtraModels(dataDto), ApiResponse(responseOptions));
};
