import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { BillingType } from '../../asaas/dto/payments/create-charge-asaas.dto';
import { AsaasPaymentsService } from '../../asaas/services/asaas.payments.service';
import { ProductsService } from '../../products/services/products.service';
import { CreateChargeAsaasResponse } from '../../asaas/types/payments/CreateChargeAsaasResponse.types';
import { Orders, PaymentStatus } from '../../database/entities/order.entity';
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
import { ORDERS_ERRORS } from '../constants/orders.errors';
import { CheckStatusResponseDto } from '../dto/check-status-response.dto';
import { CreateCustomerAsaasDto } from '../../asaas/dto/customers/create-customers-asaas.dto';
import { CustomersService } from '../../customers/services/customers.service';
import { Customers } from '../../database/entities/customer.entity';
import { OrderCustomersResponseDto } from '../dto/order-customers-response.dto';
import {
  CreateAddressDto,
  CreateCustomerDto,
} from '../../customers/dto/create-customer.dto';
import { ProductDto } from '../dto/order/Product.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private repository: Repository<Orders>,

    private readonly asaasPaymentsService: AsaasPaymentsService,
    private readonly productsService: ProductsService,
    private readonly customersService: CustomersService,
  ) {}

  private formatProductsToSave(
    products: ProductsResponseDto[],
    orderProducts: ProductDto[],
  ): ProductsFormattedToSave[] {
    return products.map((product) => {
      const item = orderProducts.find((item) => item.id === product.id);

      return {
        id: product.id,
        name: product.name,
        main_image_url: product.main_image_url,
        price: product.price,
        discount_price: product?.discount_price,
        quantity: item.quantity,
      };
    });
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
        const installmentCount =
          dto.installmentCount > 1 ? dto?.installmentCount : undefined;
        const totalValue = dto?.installmentCount > 1 ? amount : undefined;

        return this.asaasPaymentsService.creditCard(
          {
            customer,
            installmentCount,
            totalValue,
            dueDate: new Date(),
            value: amount,
            remoteIp: remoteIp,
          },
          {
            customer,
            remoteIp: remoteIp,
            creditCard: dto.card,
            creditCardHolderInfo: dto.creditCardHolderInfo,
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
        throw ORDERS_ERRORS.FAILED_CREATE_ASAAS_ORDER;
    }
  }

  public async calculateTotalOrderValue(
    orderProducts: ProductDto[],
    foundProducts: ProductsResponseDto[],
  ): Promise<number> {
    let totalValue = 0;

    for (const product of orderProducts) {
      const item = foundProducts.find((item) => item.id === product.id);
      if (!item) throw ORDERS_ERRORS.PRODUCT_NOT_FOUND;

      const productTotal =
        (item.discount_price ?? item.price) * product.quantity;
      totalValue += productTotal;
    }

    return totalValue;
  }

  public async findProductsFromOrder(
    orderProducts: ProductDto[],
  ): Promise<ProductsResponseDto[]> {
    const productIds = orderProducts.map((item) => item.id);
    const foundProducts = await this.productsService.findByIDS(productIds);

    if (foundProducts.length !== orderProducts.length) {
      throw ORDERS_ERRORS.PRODUCTS_NOT_FOUND;
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

  private async createCustomer(
    dto: CreateCustomerAsaasDto,
  ): Promise<Customers> {
    const address: CreateAddressDto = {
      address: dto.address,
      addressNumber: dto.addressNumber,
      city: dto.addressNumber,
      postalCode: dto.postalCode,
      state: dto.state,
      province: dto.province,
      complement: dto?.complement,
    };

    const customer: CreateCustomerDto = {
      name: dto.name,
      cpfCnpj: dto.cpfCnpj,
      email: dto.email,
      mobilePhone: dto.mobilePhone,
      address,
    };

    return this.customersService.createOrUpdate(customer);
  }

  public async create(
    dto: CreateOrderDto,
    remoteIp: string,
  ): Promise<CreateOrderResponseDto> {
    const products = await this.findProductsFromOrder(dto.products);

    const amount = await this.calculateTotalOrderValue(dto.products, products);

    const customer = await this.createCustomer(dto.customer);

    const formattedProducts = this.formatProductsToSave(products, dto.products);

    const asaasOrder = await this.createInAssas(
      dto,
      customer.external_id,
      amount / 100,
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

  public async findOne(id: string): Promise<OrderCustomersResponseDto> {
    const order = await this.repository.findOneByOrFail({ id });

    const customer = await this.customersService.findOneByAsaasId(
      order.external_customer_id,
    );

    return new OrderCustomersResponseDto(order, customer);
  }

  public async checkStatusByID(id: string): Promise<CheckStatusResponseDto> {
    const order = await this.repository.findOneByOrFail({ id });
    return new CheckStatusResponseDto({ status: order.status });
  }

  public async findOneByExternalID(external_order_id: string): Promise<Orders> {
    return this.repository.findOneByOrFail({ external_order_id });
  }

  public async updateOrderStatus(
    id: string,
    status: PaymentStatus,
  ): Promise<void> {
    await this.repository.update({ id }, { status });
  }
}
