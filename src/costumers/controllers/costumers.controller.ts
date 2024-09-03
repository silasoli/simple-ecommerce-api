import { Controller, Post, Body } from '@nestjs/common';
import { CreateCostumerDto } from '../dto/create-costumer.dto';
import { CostumersService } from '../services/costumers.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Costumers')
@Controller('costumers')
export class CostumersController {
  constructor(private readonly costumersService: CostumersService) {}

  @Post()
  public create(@Body() createCostumerDto: CreateCostumerDto): Promise<any> {
    return this.costumersService.createOrUpdate(createCostumerDto);
  }
}
