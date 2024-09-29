import { ProductsToSendType } from '../../types/shipping.types';

export class ShipmentCalculateDto {
  postal_code: string;
  products: ProductsToSendType[];
}
