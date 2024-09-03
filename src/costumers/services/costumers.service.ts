import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../database/entities/address.entity';
import { Costumers } from '../../database/entities/costumer.entity';
import { CreateCostumerDto } from '../dto/create-costumer.dto';

@Injectable()
export class CostumersService {
  constructor(
    @InjectRepository(Costumers)
    private costumersRepository: Repository<Costumers>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  private async findOne(id: string): Promise<Costumers> {
    return this.costumersRepository.findOne({
      where: { id },
      relations: ['address'],
    });
  }

  private async findByCPFCNPJ(cpfCnpj: string): Promise<Costumers> {
    return this.costumersRepository.findOneBy({ cpfCnpj });
  }

  public async createOrUpdate(dto: CreateCostumerDto): Promise<any> {
    const customer = await this.findByCPFCNPJ(dto.cpfCnpj);
    if (customer) return this.update(customer.id, dto);
    return this.create(dto);
  }

  private async create(dto: CreateCostumerDto): Promise<Costumers> {
    const costumer = this.costumersRepository.create(dto);
    const created = await this.costumersRepository.save(costumer);

    const address = this.addressRepository.create({
      ...dto.address,
      customer: costumer,
    });
    await this.addressRepository.save(address);

    return this.findOne(created.id);
  }

  private async update(id: string, dto: CreateCostumerDto): Promise<Costumers> {
    const costumer = await this.findOne(id);
    await this.costumersRepository.update(costumer.id, dto);

    await this.addressRepository.update(costumer, dto.address);

    return this.findOne(id);
  }
}
