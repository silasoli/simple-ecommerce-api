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
  width: number;

  @ApiProperty({ required: true })
  height: number;

  @ApiProperty({ required: true })
  length: number;

  @ApiProperty({ required: true })
  weight: number;

  @ApiProperty({ required: true })
  description: string;

  @ApiProperty({ required: true })
  price: number;

  @ApiProperty({ required: true })
  category: string;

  @ApiProperty({ required: true })
  main_image_url: string;

  @ApiProperty({ required: true })
  images: string[];

  @ApiProperty({ required: true })
  quantity: number;

  @ApiProperty({ required: true })
  code?: string;

  @ApiProperty({ required: true, type: [], example: ['string'] })
  subcategory: string[];

  @ApiProperty({ required: true })
  discount_price?: number;
  
  @ApiProperty({ required: true })
  isFeatured: boolean;

  @ApiProperty({ required: true })
  isNewCollection: boolean;

  @ApiProperty({ required: true })
  createdAt: Date;

  @ApiProperty({ required: true })
  updatedAt: Date;

  @ApiProperty({ required: true })
  deletedAt: Date;
}