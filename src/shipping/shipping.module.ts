import { Module } from '@nestjs/common';
import { ShippingService } from './services/shipping.service';
import { MelhorEnvioService } from './services/melhor-envio.service';
import { ShippingController } from './controllers/shipping.controller';
import { HttpModule } from '@nestjs/axios';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [HttpModule, ProductsModule],
  controllers: [ShippingController],
  providers: [ShippingService, MelhorEnvioService],
  exports: [MelhorEnvioService, ShippingService],
})
export class ShippingModule {}
