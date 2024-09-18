import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsPostalCode,
  ValidateNested,
} from 'class-validator';
import { ProductDto } from '../../../orders/dto/create-order.dto';
import { Type } from 'class-transformer';

export class MakeBudgetDto {
  @ApiProperty({ required: true })
  @IsPostalCode('BR')
  postal_code: string;

  @ApiProperty({ type: [ProductDto], description: 'List of products' })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
