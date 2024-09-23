import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

export class ProductDto {
  @ApiProperty({ description: 'Unique identifier for the product' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Quantity of the product' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
