import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
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

  @ApiPropertyOptional({ description: 'Scale to filter by' })
  @IsOptional()
  // @IsArray()
  // @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  // @IsString({ each: true })
  @Type(() => String)
  @IsNumberString()
  @MinLength(2)
  @MaxLength(2)
  scale: string;


  @ApiPropertyOptional({ description: 'Ref to filter by' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'O campo Ref deve ser um número inteiro.',
  })
  // @Min(0, { message: 'O campo Preço deve ser um valor positivo.' })
  ref?: number;

  @ApiPropertyOptional({ description: 'Field to order by' })
  @IsOptional()
  @IsString()
  orderField?: string;
}
