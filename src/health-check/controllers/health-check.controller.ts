import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import {
  TypeOrmHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('Health Check')
@Controller('health-check')
export class HealthCheckController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly typeOrmHealth: TypeOrmHealthIndicator,
    private http: HttpHealthIndicator,
    private readonly config: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.typeOrmHealth.pingCheck('typeorm'),
      () =>
        this.http.pingCheck('Council-API', this.config.get('COUNCIL_API_URL')),
      () =>
        this.http.pingCheck('Company-API', this.config.get('COMPANY_API_URL')),
    ]);
  }
}
