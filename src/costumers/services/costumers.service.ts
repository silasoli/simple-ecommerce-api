import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../database/entities/address.entity';
import { Costumers } from '../../database/entities/costumer.entity';
import { CreateCostumerDto } from '../dto/create-costumer.dto';
import { AsaasCustomersService } from '../../asaas/services/asaas.customers.service';
import { CustomersAsaasResponse } from '../../asaas/types/customers/CustomersAsaasResponse.types';

@Injectable()
export class CostumersService {
  constructor(
    private readonly asaasCustomersService: AsaasCustomersService,
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

  private async createOrUpdateInAsaas(
    dto: CreateCostumerDto,
  ): Promise<CustomersAsaasResponse> {
    const newDto = { ...dto, ...dto.address };
    delete dto.address;

    const exist = await this.asaasCustomersService.findOneBycpfCnpj(
      dto.cpfCnpj,
    );

    if (exist) return this.asaasCustomersService.update(exist.id, newDto);
    return this.asaasCustomersService.create(newDto);
  }

  public async createOrUpdate(dto: CreateCostumerDto): Promise<any> {
    const rawData = { ...dto };
    const asaasData = await this.createOrUpdateInAsaas(dto);
    const customer = await this.findByCPFCNPJ(dto.cpfCnpj);
    if (customer) return this.update(customer.id, rawData);
    return this.create(rawData, asaasData.id);
  }

  private async create(
    dto: CreateCostumerDto,
    external_id: string,
  ): Promise<Costumers> {
    const costumer = this.costumersRepository.create({
      ...dto,
      external_id,
    });
    const created = await this.costumersRepository.save(costumer);

    return this.findOne(created.id);
  }

  private async update(id: string, dto: CreateCostumerDto): Promise<Costumers> {
    const costumer = await this.findOne(id);
    await this.costumersRepository.update(costumer.id, {
      ...dto,
      address: undefined,
    });

    await this.addressRepository.update(costumer.address.id, dto.address);

    return this.findOne(id);
  }
}
