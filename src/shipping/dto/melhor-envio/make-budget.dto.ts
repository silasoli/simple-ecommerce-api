import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsPostalCode,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductDto } from '../../../orders/dto/order/product.dto';

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
