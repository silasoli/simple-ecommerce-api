import { ApiProperty } from '@nestjs/swagger';
import { Orders, PaymentStatus } from '../../database/entities/order.entity';
import { PaymentDetailsResponse } from '../types/orders.types';
import { BillingType } from '../../asaas/dto/payments/create-charge-asaas.dto';

export class DigitableBillAsaasResponse {
  @ApiProperty({ required: true })
  identificationField: string;

  @ApiProperty({ required: true })
  nossoNumero: string;

  @ApiProperty({ required: true })
  barCode: string;
}

export class PixQrCodeAsaasResponse {
  @ApiProperty({ required: true })
  encodedImage: string;

  @ApiProperty({ required: true })
  payload: string;

  @ApiProperty({ required: true })
  expirationDate: string;
}

export class ProductOrderResponse {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  main_image_url: string

  @ApiProperty({ required: true })
  price: number;

  @ApiProperty({ required: true })
  discount_price?: number;

  @ApiProperty({ required: true })
  quantity: number;
}

export class CreateOrderResponseDto {
  constructor(order: Orders, paymentDetails: PaymentDetailsResponse) {
    return {
      id: order.id,
      products: order.products,
      amount: order.amount,
      status: order.status,
      billingType: order.billingType,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      ...paymentDetails,
    };
  }

  @ApiProperty({ required: true })
  id: string;

  
  @ApiProperty({ required: true })
  billingType: BillingType;

  @ApiProperty({ required: true, type: () => ProductOrderResponse })
  products: ProductOrderResponse[];

  @ApiProperty({ required: true })
  status: PaymentStatus;

  @ApiProperty({ required: true })
  amount: number;

  @ApiProperty({ required: true })
  createdAt: Date;

  @ApiProperty({ required: true })
  updatedAt: Date;

  @ApiProperty()
  PIX?: PixQrCodeAsaasResponse;
  @ApiProperty()
  BOLETO?: DigitableBillAsaasResponse;
}
