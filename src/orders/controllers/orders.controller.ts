import { Controller, UseGuards, Get, Param, Query } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { IDPostgresQueryDTO } from '../../common/dto/id-postgres-query.dto';
import { PageDto } from '../../common/dto/PageDto.dto';
import { OrdersQueryDto } from '../dto/orders-query.dto';
import { OrdersResponseDto } from '../dto/orders-response.dto';
import { Roles } from '../../roles/enums/role.enum';
import { Role } from '../../roles/decorators/roles.decorator';
import { OrderCustomersResponseDto } from '../dto/order-customers-response.dto';

@ApiBearerAuth()
@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Listar Pedidos' })
  @ApiPaginatedResponse({
    status: 200,
    type: OrdersResponseDto,
    description: 'Orders listing returned successfully',
  })
  @Role([Roles.ADMIN, Roles.USER])
  @Get()
  public async findAll(
    @Query() query: OrdersQueryDto,
  ): Promise<PageDto<OrdersResponseDto>> {
    return this.ordersService.findAll(query);
  }

  @ApiOperation({ summary: 'Buscar pedido por id' })
  @ApiResponse({
    status: 200,
    description: 'Pedido retornado com sucesso',
    type: OrderCustomersResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
  })
  @Role([Roles.ADMIN, Roles.USER])
  @Get(':id')
  findOne(
    @Param() params: IDPostgresQueryDTO,
  ): Promise<OrderCustomersResponseDto> {
    return this.ordersService.findOne(params.id);
  }
}
