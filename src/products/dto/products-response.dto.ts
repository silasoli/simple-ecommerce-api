import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../database/entities/product.entity';

export class ProductsResponseDto {
  constructor(product: Product) {
    Object.assign(this, product);
  }

  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  batch: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  brand: string;

  @ApiProperty({ required: true })
  description: string;

  @ApiProperty({ required: true })
  price: number;

  @ApiProperty({ required: true, type: [], example: ['string'] })
  category: string[];

  @ApiProperty({ required: true })
  image_url: string;

  @ApiProperty({ required: true })
  quantity: number;

  @ApiProperty({ required: true })
  code?: string;

  @ApiProperty({ required: true, type: [], example: ['string'] })
  subcategory: string[];

  @ApiProperty({ required: true })
  discount_price?: number;

  @ApiProperty({ required: true })
  createdAt: Date;

  @ApiProperty({ required: true })
  updatedAt: Date;

  @ApiProperty({ required: true })
  deletedAt: Date;
}

