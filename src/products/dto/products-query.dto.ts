import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PageOptionsDto } from '../../common/dto/PageOptionsDto.dto';

export class ProductsQueryDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  name: string;
}
