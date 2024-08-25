import { Test, TestingModule } from '@nestjs/testing';
import { CloudFlareController } from './cloud-flare.controller';
import { CloudFlareService } from '../services/cloud-flare.service';

describe('CloudFlareController', () => {
  let controller: CloudFlareController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudFlareController],
      providers: [CloudFlareService],
    }).compile();

    controller = module.get<CloudFlareController>(CloudFlareController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
