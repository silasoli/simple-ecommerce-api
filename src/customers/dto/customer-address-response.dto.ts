import { ApiProperty } from '@nestjs/swagger';
import { Customers } from '../../database/entities/customer.entity';

export class AddressResponse {
  @ApiProperty({ required: true })
  address: string;

  @ApiProperty({ required: true })
  addressNumber: string;

  @ApiProperty({ required: true })
  complement?: string;

  @ApiProperty({ required: true })
  province: string;

  @ApiProperty({ required: true })
  city: string;

  @ApiProperty({ required: true })
  state: string;

  @ApiProperty({ required: true })
  postalCode: string;
}

export class CustomerAddressResponseDto {
  constructor(data: Customers) {
    delete data.address.updatedAt
    delete data.address.createdAt

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      cpfCnpj: data.cpfCnpj,
      mobilePhone: data.mobilePhone,
      address: { ...data.address }
    };
  }

  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  cpfCnpj: string

  @ApiProperty({ required: true })
  mobilePhone: string

  @ApiProperty({ required: true, type: () => AddressResponse })
  address: AddressResponse;
}
