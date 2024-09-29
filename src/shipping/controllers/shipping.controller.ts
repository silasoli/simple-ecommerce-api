import { Controller, Post, Body } from '@nestjs/common';
import { MakeBudgetDto } from '../dto/melhor-envio/make-budget.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ShippingService } from '../services/shipping.service';
import { ShipmentCalculateResponseDto } from '../dto/shipment-calculate-response.dto';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('estimate')
  @ApiCreatedResponse({
    type: [ShipmentCalculateResponseDto],
  })
  // @ApiResponse({
  //   status: ORDERS_ERRORS.PRODUCTS_NOT_FOUND.getStatus(),
  //   description: ORDERS_ERRORS.PRODUCTS_NOT_FOUND.message,
  // })
  create(@Body() dto: MakeBudgetDto): Promise<ShipmentCalculateResponseDto[]> {
    return this.shippingService.seekDeliveryQuote(dto);
  }
}
