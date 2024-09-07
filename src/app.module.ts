import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckModule } from './health-check/health-check.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfigModule } from './database/typeorm.module';
import { ProductsModule } from './products/products.module';
import { CloudFlareModule } from './cloud-flare/cloud-flare.module';
import { CostumersModule } from './costumers/costumers.module';
import { AsaasModule } from './asaas/asaas.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmConfigModule,
    HealthCheckModule,
    UsersModule,
    RolesModule,
    AuthModule,
    ProductsModule,
    CloudFlareModule,
    CostumersModule,
    AsaasModule,
    OrdersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
