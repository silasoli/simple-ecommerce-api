import { Controller, Post, Body, Ip, Get, Param } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrdersService } from '../services/orders.service';
import { ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderResponseDto } from '../dto/create-order-response.dto';
import { IDPostgresQueryDTO } from '../../common/dto/id-postgres-query.dto';
import { PaymentStatus } from '../../database/entities/order.entity';

@ApiTags('Public Orders')
@Controller('orders')
export class PublicOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiCreatedResponse({
    type: CreateOrderResponseDto,
  })
  public create(
    @Body() dto: CreateOrderDto,
    @Ip() ip: string,
  ): Promise<CreateOrderResponseDto> {
    return this.ordersService.create(dto, ip);
  }

  @Get(':id/check-status')
  @ApiOkResponse({
    type: () => PaymentStatus,
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
  })
  public findOne(@Param() params: IDPostgresQueryDTO): Promise<PaymentStatus> {
    return this.ordersService.checkStatusByID(params.id);
  }
}
