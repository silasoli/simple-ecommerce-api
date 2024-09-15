import { Controller, Post, Body, Ip } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrdersService } from '../services/orders.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderResponseDto } from '../dto/create-order-response.dto';

@ApiTags('Orders')
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
}
