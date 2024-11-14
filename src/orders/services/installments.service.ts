import { Injectable } from '@nestjs/common';
import { ProductDto } from '../dto/order/product.dto';
import { CalculateInstallmentsDto } from '../dto/installments/calculate-installments.dto';
import { OrdersService } from './orders.service';
import { CalculateAllInstallmentsResponseDto } from '../dto/installments/calculate-all-installments-response.dto';
import { CalculateInstallments } from '../types/installments.types';

@Injectable()
export class InstallmentsService {
  constructor(private readonly ordersService: OrdersService) {}

  public async processOrder(
    products: ProductDto[],
    requestedInstallments: number[],
  ): Promise<CalculateInstallments[]> {
    const foundProducts =
      await this.ordersService.findProductsFromOrder(products);

    const totalValue = await this.ordersService.calculateTotalOrderValue(
      products,
      foundProducts,
    );

    const installmentOptions = this.ordersService.calculateInstallments(
      totalValue,
      requestedInstallments,
    );

    return installmentOptions;
  }

  public async calculateAllInstallments(
    dto: CalculateInstallmentsDto,
  ): Promise<CalculateAllInstallmentsResponseDto[]> {
    // const foundProducts = await this.ordersService.findProductsFromOrder(
    //   dto.products,
    // );

    // const totalValue = await this.ordersService.calculateTotalOrderValue(
    //   dto.products,
    //   foundProducts,
    // );

    // const installmentOptions = this.ordersService.calculateInstallments(
    //   totalValue,
    //   [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    // );

    const installmentOptions = await this.processOrder(
      dto.products,
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    );

    return installmentOptions.map(
      (item) => new CalculateAllInstallmentsResponseDto(item),
    );
  }
}
