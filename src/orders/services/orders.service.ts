import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto, ProductDto } from '../dto/create-order.dto';
import { BillingType } from '../../asaas/dto/payments/create-charge-asaas.dto';
import { AsaasCustomersService } from '../../asaas/services/asaas.customers.service';
import { AsaasPaymentsService } from '../../asaas/services/asaas.payments.service';
import { ProductsService } from '../../products/services/products.service';
import { CreateChargeAsaasResponse } from '../../asaas/types/payments/CreateChargeAsaasResponse.types';
import { Orders } from '../../database/entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsResponseDto } from '../../products/dto/products-response.dto';
import {
  PaymentDetailsResponse,
  ProductsFormattedToSave,
} from '../types/orders.types';
import { CreateOrderResponseDto } from '../dto/create-order-response.dto';
import { PageDto } from '../../common/dto/PageDto.dto';
import { PageMetaDto } from '../../common/dto/PageMetaDto.dto';
import { OrdersQueryDto } from '../dto/orders-query.dto';
import { OrdersResponseDto } from '../dto/orders-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private repository: Repository<Orders>,

    private readonly asaasCustomersService: AsaasCustomersService,
    private readonly asaasPaymentsService: AsaasPaymentsService,
    private readonly productsService: ProductsService,
  ) {}

  private formatProductsToSave(
    products: ProductsResponseDto[],
  ): ProductsFormattedToSave[] {
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      main_image_url: product.main_image_url,
      price: product.price,
      discount_price: product?.discount_price,
      quantity: product.quantity,
    }));
  }

  private async createInAssas(
    dto: CreateOrderDto,
    customer: string,
    amount: number,
    remoteIp: string,
  ): Promise<CreateChargeAsaasResponse> {
    switch (dto.billingType) {
      case BillingType.BOLETO:
        return this.asaasPaymentsService.createCharge({
          customer,
          billingType: BillingType.BOLETO,
          dueDate: new Date(),
          value: amount,
        });
      case BillingType.CREDIT_CARD:
        return this.asaasPaymentsService.creditCard(
          {
            customer,
            dueDate: new Date(),
            value: amount,
            remoteIp: remoteIp,
          },
          {
            customer,
            remoteIp: remoteIp,
            creditCard: dto.card,
            creditCardHolderInfo: {
              ...dto.customer,
              phone: dto.customer.mobilePhone,
            },
          },
        );
      case BillingType.PIX:
        return this.asaasPaymentsService.createCharge({
          customer,
          billingType: BillingType.PIX,
          dueDate: new Date(),
          value: amount,
        });
      default:
        throw new BadRequestException('error');
    }
  }

  private async calculateTotalOrderValue(
    orderProducts: ProductDto[],
    foundProducts: ProductsResponseDto[],
  ): Promise<number> {
    let totalValue = 0;

    for (const product of orderProducts) {
      const item = foundProducts.find((item) => item.id === product.id);
      if (!item) throw new Error('Produto não encontrado');

      const productTotal =
        ((item.discount_price ?? item.price) / 100) * product.quantidade;
      totalValue += productTotal;
    }

    return totalValue;
  }

  private async findProductsFromOrder(
    orderProducts: ProductDto[],
  ): Promise<ProductsResponseDto[]> {
    const productIds = orderProducts.map((item) => item.id);
    const foundProducts = await this.productsService.findByIDS(productIds);

    if (foundProducts.length !== orderProducts.length) {
      throw new Error('Um ou mais produtos não foram encontrados');
    }

    return foundProducts;
  }

  private async getPaymentDetails(
    asaasOrderId: string,
    billingType: BillingType,
  ): Promise<PaymentDetailsResponse> {
    if (billingType === BillingType.PIX) {
      const PIX = await this.asaasPaymentsService.getpixQRCode(asaasOrderId);
      return { PIX };
    }

    if (billingType === BillingType.BOLETO) {
      const BOLETO =
        await this.asaasPaymentsService.getInvoiceDigitableBill(asaasOrderId);
      return { BOLETO };
    }
  }

  public async create(
    dto: CreateOrderDto,
    remoteIp: string,
  ): Promise<CreateOrderResponseDto> {
    const products = await this.findProductsFromOrder(dto.products);

    const amount = await this.calculateTotalOrderValue(dto.products, products);

    const customer = await this.asaasCustomersService.createOrUpdate(
      dto.customer,
    );

    const formattedProducts = this.formatProductsToSave(products);

    const asaasOrder = await this.createInAssas(
      dto,
      customer.id,
      amount,
      remoteIp,
    );

    const order = await this.repository.save({
      amount,
      billingType: dto.billingType,
      external_customer_id: asaasOrder.customer,
      external_order_id: asaasOrder.id,
      status: asaasOrder.status,
      products: formattedProducts,
      asaasData: [JSON.stringify(asaasOrder)],
    });

    delete order.asaasData;

    const paymentDetails = await this.getPaymentDetails(
      order.external_order_id,
      order.billingType,
    );

    return new CreateOrderResponseDto(order, paymentDetails);
  }

  public async findAll(
    dto: OrdersQueryDto,
  ): Promise<PageDto<OrdersResponseDto>> {
    const queryBuilder = this.repository.createQueryBuilder('orders');

    // if (dto.name) {
    //   // dto.name = FormatUtil.capitalizeWords(dto.name);

    //   queryBuilder.andWhere('products.name LIKE :name', {
    //     name: `${dto.name.toLocaleLowerCase()}%`,
    //   });
    // }

    queryBuilder
      .orderBy('orders.id', dto.order)
      .offset((dto.page - 1) * dto.take)
      .limit(dto.take);

    const [data, itemCount] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: dto });

    const formatedOrders = data.map((item) => new OrdersResponseDto(item));

    return new PageDto(formatedOrders, pageMetaDto);
  }

  public async findOne(id: string): Promise<OrdersResponseDto> {
    const order = await this.repository.findOneByOrFail({ id });

    return new OrdersResponseDto(order);
  }
}
