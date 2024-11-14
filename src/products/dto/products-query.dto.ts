import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PageOptionsDto } from '../../common/dto/PageOptionsDto.dto';

export class ProductsQueryDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  name: string;

  @ApiPropertyOptional({ description: 'Category to filter by' })
  @IsOptional()
  // @IsArray()
  // @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  // @IsString({ each: true })
  @Type(() => String)
  category: string;

  @ApiPropertyOptional({ description: 'Field to order by' })
  @IsOptional()
  @IsString()
  orderField?: string;
}
