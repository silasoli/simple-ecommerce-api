import { Global, Module } from '@nestjs/common';
import { CloudFlareController } from './controllers/cloud-flare.controller';
import { CloudFlareService } from './services/cloud-flare.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [CloudFlareController],
  providers: [CloudFlareService],
})
export class CloudFlareModule {}
