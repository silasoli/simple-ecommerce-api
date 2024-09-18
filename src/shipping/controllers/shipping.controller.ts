import { Controller, Post, Body } from '@nestjs/common';
import { MelhorEnvioService } from '../services/melhor-envio.service';
import { MakeBudgetDto } from '../dto/melhor-envio/make-budget.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly melhorEnvioService: MelhorEnvioService) {}

  @Post('estimate')
  create(@Body() dto: MakeBudgetDto): Promise<any> {
    return this.melhorEnvioService.makeBudget(dto);
  }
}
