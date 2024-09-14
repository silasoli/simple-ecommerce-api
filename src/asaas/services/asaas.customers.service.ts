import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { CreateCostumerAsaasDto } from '../dto/customers/create-customers-asaas.dto';
import { CreateCustomersAsaasResponse } from '../types/customers/CreateCustomersAsaasResponse.types';
import { CustomersAsaasResponse } from '../types/customers/CustomersAsaasResponse.types';

@Injectable()
export class AsaasCustomersService {
  private ASAAS_URL = `${process.env.ASAAS_URL}/customers`;
  private ASAAS_AUTH = process.env.ASAAS_AUTH;

  constructor(private readonly httpService: HttpService) {}

  public async createOrUpdate(dto: CreateCostumerAsaasDto) {
    const exist = await this.findOneBycpfCnpj(dto.cpfCnpj);
    if (exist) return exist;
    return this.create(dto);
  }

  public async create(
    dto: CreateCostumerAsaasDto,
  ): Promise<CreateCustomersAsaasResponse> {
    const URL = `${this.ASAAS_URL}`;

    // try {
    const response = await this.httpService.axiosRef.post(
      URL,
      {
        ...dto,
      },
      {
        headers: {
          access_token: this.ASAAS_AUTH,
        },
      },
    );

    return response.data;
    // } catch (error) {
    // console.log(error)
    // console.log(error.response.data);
    // }
  }

  public async findOne(
    id: string,
  ): Promise<AxiosResponse<CustomersAsaasResponse>> {
    const URL = `${this.ASAAS_URL}/${id}`;

    const response = await this.httpService.axiosRef.get(URL, {
      headers: {
        access_token: this.ASAAS_AUTH,
      },
    });

    return response.data as AxiosResponse<CustomersAsaasResponse>;
  }

  public async findOneBycpfCnpj(
    cpfCnpj: string,
  ): Promise<CustomersAsaasResponse> {
    const URL = `${this.ASAAS_URL}?cpfCnpj=${cpfCnpj}`;

    const response = await this.httpService.axiosRef.get(URL, {
      headers: {
        access_token: this.ASAAS_AUTH,
      },
    });

    return !response.data.totalCount ? null : response.data.data[0];
  }

  public async update(
    id: string,
    dto: CreateCostumerAsaasDto,
  ): Promise<CustomersAsaasResponse> {
    const URL = `${this.ASAAS_URL}/${id}`;

    const response = await this.httpService.axiosRef.put(
      URL,
      {
        ...dto,
      },
      {
        headers: {
          access_token: this.ASAAS_AUTH,
        },
      },
    );

    return response.data;
  }
}
