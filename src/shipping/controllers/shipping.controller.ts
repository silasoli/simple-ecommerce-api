import { Controller, Post, Body } from '@nestjs/common';
import { MakeBudgetDto } from '../dto/melhor-envio/make-budget.dto';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShippingService } from '../services/shipping.service';
import { ShipmentCalculateResponseDto } from '../dto/shipment-calculate-response.dto';
import { SHIPPING_ERRORS } from '../constants/shipping.errors';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('estimate')
  @ApiCreatedResponse({
    type: [ShipmentCalculateResponseDto],
  })
  @ApiResponse({
    status: SHIPPING_ERRORS.PRODUCTS_NOT_FOUND.getStatus(),
    description: SHIPPING_ERRORS.PRODUCTS_NOT_FOUND.message,
  })
  create(@Body() dto: MakeBudgetDto): Promise<ShipmentCalculateResponseDto[]> {
    return this.shippingService.seekDeliveryQuote(dto);
  }
}
