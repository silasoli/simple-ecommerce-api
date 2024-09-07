import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrdersService {
  public async create(dto: CreateOrderDto): Promise<any> {
    return 'This action adds a new order';
  }
}
