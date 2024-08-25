import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { PageDto } from '../dto/PageDto.dto';

interface ApiPaginatedResponseOptions<TModel> {
  type: Type<TModel>;
  description: string;
  status: number;
}

export const ApiPaginatedResponse = <TModel>(
  options: ApiPaginatedResponseOptions<TModel>,
) => {
  const { type, description, status } = options;

  return applyDecorators(
    ApiExtraModels(PageDto, type),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(type) },
              },
            },
          },
        ],
      },
    }),
  );
};
