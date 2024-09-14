import { Injectable } from '@nestjs/common';
import { CreateOrderDto, ProductDto } from '../dto/create-order.dto';
import { BillingType } from '../../asaas/dto/payments/create-charge-asaas.dto';
import { AsaasCustomersService } from '../../asaas/services/asaas.customers.service';
import { AsaasPaymentsService } from '../../asaas/services/asaas.payments.service';
import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly asaasCustomersService: AsaasCustomersService,
    private readonly asaasPaymentsService: AsaasPaymentsService,
    private readonly productsService: ProductsService,
  ) {}

  private async createInAssas(dto: CreateOrderDto): Promise<any> {
    const amount = await this.calculateTotalOrderValue(dto.products);

    console.log(amount);

    const customer = await this.asaasCustomersService.createOrUpdate(
      dto.customer,
    );

    // switch (dto.billingType) {
    //   case BillingType.BOLETO:
    //     return this.asaasPaymentsService.createCharge({
    //       customer: customer.id,
    //       billingType: BillingType.BOLETO,
    //       dueDate: new Date(),
    //       value: 100.0,
    //     });
    //   case BillingType.CREDIT_CARD:
    //     return this.asaasPaymentsService.creditCard(
    //       {
    //         customer: customer.id,
    //         dueDate: new Date(),
    //         value: 100.0,
    //         remoteIp: dto.remoteIp,
    //       },
    //       {
    //         customer: customer.id,
    //         remoteIp: dto.remoteIp,
    //         creditCard: dto.card,
    //         creditCardHolderInfo: {
    //           ...dto.customer,
    //           phone: dto.customer.mobilePhone,
    //         },
    //       },
    //     );
    //   case BillingType.PIX:
    //     return this.asaasPaymentsService.createCharge({
    //       customer: customer.id,
    //       billingType: BillingType.PIX,
    //       dueDate: new Date(),
    //       value: 100.0,
    //     });
    //   default:
    //     break;
    // }
  }

  private async calculateTotalOrderValue(
    orderProducts: ProductDto[],
  ): Promise<number> {
    const productIds = orderProducts.map((item) => item.id);
    const foundProducts = await this.productsService.findByIDS(productIds);

    // Validação para garantir que todos os produtos foram encontrados
    if (foundProducts.length !== orderProducts.length) {
      throw new Error('Um ou mais produtos não foram encontrados');
    }

    let totalValue = 0;

    for (const product of orderProducts) {
      const item = foundProducts.find((item) => item.id === product.id);
      if (!item) throw new Error('Produto não encontrado');

      // Dividindo tanto o desconto quanto o preço por 100 para converter de centavos para reais
      const productTotal =
        ((item.discount_price ?? item.price) / 100) * product.quantidade;
      totalValue += productTotal;
    }

    return totalValue;
  }

  public async create(dto: CreateOrderDto): Promise<any> {
    const order = await this.createInAssas(dto);
    return order;
  }
}
