import { BadRequestException, Injectable } from '@nestjs/common';
import { MelhorEnvioService } from './melhor-envio.service';
import { ShipmentCalculateResponse } from '../types/shipment-calculate.types';
import { MakeBudgetDto } from '../dto/melhor-envio/make-budget.dto';
import { ProductsService } from '../../products/services/products.service';
import { ProductDto } from '../../orders/dto/order/Product.dto';
import { ProductsResponseDto } from '../../products/dto/products-response.dto';
import { ProductsToSendType } from '../types/shipping.types';
import { FormatUtil } from '../../common/utils/formatters/format.util';
import { ShipmentCalculateDto } from '../dto/melhor-envio/shipment-calculate.dto';
import { ShipmentCalculateResponseDto } from '../dto/shipment-calculate-response.dto';

@Injectable()
export class ShippingService {
  constructor(
    private readonly melhorEnvioService: MelhorEnvioService,
    private readonly productsService: ProductsService,
  ) {}

  private async calculateShipment(
    dto: ShipmentCalculateDto,
  ): Promise<ShipmentCalculateResponse[]> {
    return this.melhorEnvioService.calculateShipment(dto);
  }

  private async findProductsToShipping(
    products: ProductDto[],
  ): Promise<ProductsResponseDto[]> {
    const productIds = products.map((item) => item.id);
    const foundProducts = await this.productsService.findByIDS(productIds);

    if (foundProducts.length !== products.length) {
      throw new BadRequestException();
      // throw ORDERS_ERRORS.PRODUCTS_NOT_FOUND;
    }

    return foundProducts;
  }

  private formatProductsToShipping(
    products: ProductsResponseDto[],
    shippingProducs: ProductDto[],
  ): ProductsToSendType[] {
    return products.map((product) => {
      const item = shippingProducs.find((item) => item.id === product.id);

      return {
        id: product.id,
        quantity: item.quantity,
        width: product.width,
        height: product.height,
        length: product.length,
        weight: product.weight,
        insurance_value: FormatUtil.convertCentsToReais(product.price),
      };
    });
  }

  public async seekDeliveryQuote(
    dto: MakeBudgetDto,
  ): Promise<ShipmentCalculateResponseDto[]> {
    const foundProducts = await this.findProductsToShipping(dto.products);
    const formattedProducts = this.formatProductsToShipping(
      foundProducts,
      dto.products,
    );

    const deliverysQuote = await this.calculateShipment({
      postal_code: dto.postal_code,
      products: formattedProducts,
    });

    return deliverysQuote.map((item) => new ShipmentCalculateResponseDto(item));
  }
}
