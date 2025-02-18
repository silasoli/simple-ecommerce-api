import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsInt, Min, IsOptional, IsString } from 'class-validator';

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

  // custom: [{ color, scale, quantity }]

  @ApiProperty({ description: 'Color of the product', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ description: 'Scale/Size of the product', required: false })
  @IsOptional()
  @IsString()
  scale?: string;
}
