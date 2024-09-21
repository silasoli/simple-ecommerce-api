import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../database/entities/address.entity';
import { Customers } from '../../database/entities/customer.entity';
import { AsaasCustomersService } from '../../asaas/services/asaas.customers.service';
import { CustomersAsaasResponse } from '../../asaas/types/customers/CustomersAsaasResponse.types';
import { CustomerAddressResponseDto } from '../dto/customer-address-response.dto';
import { CreateCustomerDto } from '../dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    private readonly asaasCustomersService: AsaasCustomersService,
    @InjectRepository(Customers)
    private customersRepository: Repository<Customers>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  private async findOne(id: string): Promise<Customers> {
    return this.customersRepository.findOne({
      where: { id },
      relations: ['address'],
    });
  }

  public async findOneByAsaasId(
    external_id: string,
  ): Promise<CustomerAddressResponseDto> {
    const customer = await this.customersRepository.findOne({
      where: { external_id },
      relations: ['address'],
    });

    return new CustomerAddressResponseDto(customer);
  }

  private async findByCPFCNPJ(cpfCnpj: string): Promise<Customers> {
    return this.customersRepository.findOneBy({ cpfCnpj });
  }

  private async createOrUpdateInAsaas(
    dto: CreateCustomerDto,
  ): Promise<CustomersAsaasResponse> {
    const newDto = { ...dto, ...dto.address };
    delete dto.address;

    const exist = await this.asaasCustomersService.findOneBycpfCnpj(
      dto.cpfCnpj,
    );

    if (exist) return this.asaasCustomersService.update(exist.id, newDto);
    return this.asaasCustomersService.create(newDto);
  }

  public async createOrUpdate(dto: CreateCustomerDto): Promise<Customers> {
    const rawData = { ...dto };
    const asaasData = await this.createOrUpdateInAsaas(dto);
    const customer = await this.findByCPFCNPJ(dto.cpfCnpj);
    if (customer) return this.update(customer.id, rawData);
    return this.create(rawData, asaasData.id);
  }

  private async create(
    dto: CreateCustomerDto,
    external_id: string,
  ): Promise<Customers> {
    const customer = this.customersRepository.create({
      ...dto,
      external_id,
    });
    const created = await this.customersRepository.save(customer);

    return this.findOne(created.id);
  }

  private async update(id: string, dto: CreateCustomerDto): Promise<Customers> {
    const customer = await this.findOne(id);
    await this.customersRepository.update(customer.id, {
      ...dto,
      address: undefined,
    });

    await this.addressRepository.update(customer.address.id, dto.address);

    return this.findOne(id);
  }
}
