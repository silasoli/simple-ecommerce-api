import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsEnum,
  ValidateIf,
  IsInt,
  Max,
  Min,
  IsOptional,
} from 'class-validator';
import { BillingType } from '../../asaas/dto/payments/create-charge-asaas.dto';
import { CreateCustomerAsaasDto } from '../../asaas/dto/customers/create-customers-asaas.dto';
import { ProductDto } from './order/product.dto';
import { CardDto } from './order/card.dto';
import { CreditCardHolderInfoDto } from './order/holder-info.dto';

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
  @Type(() => CreateCustomerAsaasDto)
  customer: CreateCustomerAsaasDto;

  @ValidateIf((o) => o.billingType === BillingType.CREDIT_CARD)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  @ApiProperty({
    description: 'Credit card information for the transaction',
    type: CardDto,
  })
  card: CardDto;

  @ValidateIf((o) => o.billingType === BillingType.CREDIT_CARD)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreditCardHolderInfoDto)
  @ApiProperty({
    description: 'Credit Card Holder Info',
    type: CreditCardHolderInfoDto,
  })
  creditCardHolderInfo: CreditCardHolderInfoDto;

  @ValidateIf((o) => o.billingType === BillingType.CREDIT_CARD)
  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(12)
  @ApiProperty({
    description: 'Number of installments (valid only for credit card payments)',
  })
  installmentCount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  shippingOptionId: number;
}
