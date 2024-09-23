import { Injectable } from '@nestjs/common';
import { ProductsService } from '../../products/services/products.service';
import { ProductDto } from '../dto/order/Product.dto';
import { CalculateInstallmentsDto } from '../dto/calculate-installments.dto';
import { OrdersService } from './orders.service';

@Injectable()
export class InstallmentsService {
  constructor(private readonly ordersService: OrdersService) {}
  // private interestRate = parseFloat(process.env.INSTALLMENT_INTEREST_RATE) || 0;
  private interestRate = 10;

  private calculateInstallments(
    totalValue: number,
    requestedInstallments: number[],
  ): { installments: number; installmentValue: number; amount: number }[] {
    const installmentsArray = [];

    for (const installments of requestedInstallments) {
      const interestMultiplier =
        installments === 1 ? 1 : 1 + this.interestRate / 100;
      const amount = totalValue * interestMultiplier;
      const installmentValue = amount / installments;
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
  ) {
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

  public async calculateAllInstallments(dto: CalculateInstallmentsDto) {
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

    return installmentOptions;
  }
}
