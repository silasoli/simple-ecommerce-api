import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsUUID,
  IsInt,
  Min,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsEnum,
  Length,
  ValidateIf,
} from 'class-validator';
import { BillingType } from '../../asaas/dto/payments/create-charge-asaas.dto';
import { CreateCostumerAsaasDto } from '../../asaas/dto/customers/create-customers-asaas.dto';

export class ProductDto {
  @ApiProperty({ description: 'Unique identifier for the product' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Quantity of the product' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantidade: number;
}

export class CardDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the card holder' })
  holderName: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Card number' })
  number: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Expiration month of the card' })
  expiryMonth: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Expiration year of the card' })
  expiryYear: string;

  @IsNotEmpty()
  @Length(3, 4)
  @ApiProperty({ description: 'CCV code of the card' })
  ccv: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [ProductDto], description: 'List of products' })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  @ApiProperty({ description: 'Payment method' })
  @IsNotEmpty()
  @IsEnum(BillingType)
  billingType: BillingType;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCostumerAsaasDto)
  customer: CreateCostumerAsaasDto;

  @ValidateIf((o) => o.billingType === BillingType.CREDIT_CARD)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  @ApiProperty({
    description: 'Credit card information for the transaction',
    type: CardDto,
  })
  card: CardDto;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  remoteIp: string;
}
