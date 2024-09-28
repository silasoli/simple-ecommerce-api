import { Injectable } from '@nestjs/common';
import { ProductDto } from '../dto/order/Product.dto';
import { CalculateInstallmentsDto } from '../dto/installments/calculate-installments.dto';
import { OrdersService } from './orders.service';
import { CalculateAllInstallmentsResponseDto } from '../dto/installments/calculate-all-installments-response.dto';
import { CalculateInstallments } from '../types/installments.types';

@Injectable()
export class InstallmentsService {
  constructor(private readonly ordersService: OrdersService) {}
  private interestRate =
    parseFloat(process.env.INSTALLMENT_INTEREST_RATE_IN_CENTS) || 0;

  private calculateInstallments(
    totalValue: number,
    requestedInstallments: number[],
  ): CalculateInstallments[] {
    const totalValuewithInterest = totalValue + this.interestRate;
    const installmentsArray = [];

    for (const installments of requestedInstallments) {
      const amount = Math.round(totalValuewithInterest);
      const installmentValue = Math.round(amount / installments);

      installmentsArray.push({
        installments,
        installmentValue,
        amount,
      });
    }

    return installmentsArray;
  }

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

    const installmentOptions = this.calculateInstallments(
      totalValue,
      requestedInstallments,
    );

    return installmentOptions;
  }

  public async calculateAllInstallments(
    dto: CalculateInstallmentsDto,
  ): Promise<CalculateAllInstallmentsResponseDto[]> {
    const foundProducts = await this.ordersService.findProductsFromOrder(
      dto.products,
    );

    const totalValue = await this.ordersService.calculateTotalOrderValue(
      dto.products,
      foundProducts,
    );

    const installmentOptions = this.calculateInstallments(
      totalValue,
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    );

    return installmentOptions.map(
      (item) => new CalculateAllInstallmentsResponseDto(item),
    );
  }
}
