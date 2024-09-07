import { Controller, Post, Body } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrdersService } from '../services/orders.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class PublicOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  public create(@Body() dto: CreateOrderDto): Promise<any> {
    return this.ordersService.create(dto);
  }
}
