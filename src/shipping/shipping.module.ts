import { Module } from '@nestjs/common';
import { ShippingService } from './services/shipping.service';
import { MelhorEnvioService } from './services/melhor-envio.service';
import { ShippingController } from './controllers/shipping.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ShippingController],
  providers: [ShippingService, MelhorEnvioService],
  exports: [MelhorEnvioService],
})
export class ShippingModule {}
