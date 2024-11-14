import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsInt,
  IsUrl,
  Min,
  Length,
  ArrayNotEmpty,
  ArrayMinSize,
  IsPositive,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo Lote não pode estar vazio.' })
  @IsString({ message: 'O campo Lote deve ser uma string.' })
  @Length(3, 50, { message: 'O campo Lote deve ter entre 3 e 50 caracteres.' })
  batch: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo Nome não pode estar vazio.' })
  @IsString({ message: 'O campo Nome deve ser uma string.' })
  @Length(3, 255, {
    message: 'O campo Nome deve ter entre 3 e 255 caracteres.',
  })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'O campo Marca deve ser uma string.' })
  @Length(2, 100, {
    message: 'O campo Marca deve ter entre 2 e 100 caracteres.',
  })
  brand: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'O campo Código deve ser uma string.' })
  @Length(3, 50, {
    message: 'O campo Código deve ter entre 3 e 50 caracteres.',
  })
  code?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo Descrição não pode estar vazio.' })
  @IsString({ message: 'O campo Descrição deve ser uma string.' })
  @Length(10, 1000, {
    message: 'O campo Descrição deve ter entre 10 e 1000 caracteres.',
  })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo Preço não pode estar vazio.' })
  @IsInt({
    message: 'O campo Preço deve ser um número inteiro representando centavos.',
  })
  @Min(0, { message: 'O campo Preço deve ser um valor positivo.' })
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty({ message: 'O campo Categoria não pode estar vazio.' })
  @IsString()
  // @IsArray({ message: 'O campo Categoria deve ser um array.' })
  // @ArrayNotEmpty({ message: 'O campo Categoria não pode ser um array vazio.' })
  // @ArrayMinSize(1, { message: 'O campo Categoria deve ter pelo menos 1 item.' })
  category: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo Imagem não pode estar vazio.' })
  @IsString({ message: 'O campo Imagem deve ser uma string.' })
  @IsUrl({}, { message: 'O campo Imagem deve ser uma URL válida.' })
  main_image_url: string;

  @IsOptional()
  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @IsUrl({}, { each: true })
  images: string[];

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo Quantidade não pode estar vazio.' })
  @IsInt({ message: 'O campo Quantidade deve ser um número inteiro.' })
  @Min(0, { message: 'O campo Quantidade deve ser um valor positivo.' })
  quantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty({ message: 'O campo Sub Categoria não pode estar vazio.' })
  @IsArray({ message: 'O campo Sub Categoria deve ser um array.' })
  @ArrayNotEmpty({
    message: 'O campo Sub Categoria não pode ser um array vazio.',
  })
  @ArrayMinSize(1, {
    message: 'O campo Sub Categoria deve ter pelo menos 1 item.',
  })
  subcategory: string[];

  @ApiProperty()
  @IsOptional()
  @IsInt({
    message:
      'O campo Preço com Desconto deve ser um número inteiro representando centavos.',
  })
  @Min(0, { message: 'O campo Preço com Desconto deve ser um valor positivo.' })
  discount_price?: number;

  @ApiProperty({ example: 11 })
  @IsOptional()
  @IsInt({ message: 'O campo Largura deve ser um número inteiro.' })
  @Min(0, { message: 'O campo Largura deve ser um valor positivo.' })
  width: number;

  @ApiProperty({ example: 17 })
  @IsOptional()
  @IsInt({ message: 'O campo Altura deve ser um número inteiro.' })
  @Min(0, { message: 'O campo Altura deve ser um valor positivo.' })
  height: number;

  @ApiProperty({ example: 11 })
  @IsOptional()
  @IsInt({ message: 'O campo Comprimento deve ser um número inteiro.' })
  @Min(0, { message: 'O campo Comprimento deve ser um valor positivo.' })
  length: number;

  @ApiProperty({ example: 0.3 })
  @IsNumber({}, { message: 'O campo Peso deve ser um número.' })
  @IsPositive({ message: 'O campo Peso deve ser um valor positivo.' })
  weight: number;

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'Esse campo deve ser um boleano.' })
  @IsNotEmpty()
  isFeatured: boolean;

  @ApiProperty({ example: false })
  @IsBoolean({ message: 'Esse campo deve ser um boleano.' })
  @IsNotEmpty()
  isNewCollection: boolean;
}
