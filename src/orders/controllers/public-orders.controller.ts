import { Controller, Post, Body, Ip, Get, Param } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrdersService } from '../services/orders.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderResponseDto } from '../dto/create-order-response.dto';
import { IDPostgresQueryDTO } from '../../common/dto/id-postgres-query.dto';
import { CheckStatusResponseDto } from '../dto/check-status-response.dto';
import { InstallmentsService } from '../services/installments.service';
import { CalculateInstallmentsDto } from '../dto/calculate-installments.dto';

@ApiTags('Public Orders')
@Controller('orders')
export class PublicOrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly installmentsService: InstallmentsService,
  ) {}

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
    type: CheckStatusResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
  })
  public findOne(
    @Param() params: IDPostgresQueryDTO,
  ): Promise<CheckStatusResponseDto> {
    return this.ordersService.checkStatusByID(params.id);
  }

  @Post('installments/calculate')
  // @ApiOkResponse({
  //   type: CheckStatusResponseDto,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Pedido não encontrado',
  // })
  public calculateInstallments(
    @Body() dto: CalculateInstallmentsDto,
  ): Promise<any> {
    return this.installmentsService.calculateAllInstallments(dto);
  }
}
