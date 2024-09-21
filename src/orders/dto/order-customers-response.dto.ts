import { ApiProperty } from '@nestjs/swagger';
import { Orders, PaymentStatus } from '../../database/entities/order.entity';
import { ProductOrderResponse } from './create-order-response.dto';
import { BillingType } from '../../asaas/dto/payments/create-charge-asaas.dto';
import { CustomerAddressResponseDto } from '../../customers/dto/customer-address-response.dto';

export class OrderCustomersResponseDto {
  constructor(order: Orders, customer: CustomerAddressResponseDto) {
    // console.log(order)
    order.external_customer_id = undefined;
    order.external_order_id = undefined;
 
    Object.assign(this, { ...order, customer });
  }

  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  external_customer_id: string;

  @ApiProperty({ required: true })
  external_order_id: string;

  @ApiProperty({ required: true, type: () => ProductOrderResponse })
  products: ProductOrderResponse[];

  @ApiProperty({ required: true })
  status: PaymentStatus;

  @ApiProperty({ required: true })
  billingType: BillingType;

  @ApiProperty({ required: true })
  amount: number;

  @ApiProperty({ required: true, type: () => CustomerAddressResponseDto })
  customer: CustomerAddressResponseDto;

  @ApiProperty({ required: true })
  createdAt: Date;

  @ApiProperty({ required: true })
  updatedAt: Date;

  @ApiProperty({ required: true })
  deletedAt: Date;
}