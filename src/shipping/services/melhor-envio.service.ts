import { HttpException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ShipmentCalculateResponse } from '../types/shipment-calculate.types';
import { ShipmentCalculateDto } from '../dto/melhor-envio/shipment-calculate.dto';

@Injectable()
export class MelhorEnvioService {
  private readonly logger = new Logger(MelhorEnvioService.name);

  constructor(private readonly httpService: HttpService) {}

  private readonly MELHOR_ENVIO_URL = `${process.env.MELHOR_ENVIO_URL}`;

  private readonly AUTH = `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`;

  private readonly MELHOR_ENVIO_FROM = `${process.env.MELHOR_ENVIO_FROM}`;

  public async calculateShipment(
    dto: ShipmentCalculateDto,
  ): Promise<ShipmentCalculateResponse[]> {
    const data = {
      from: {
        postal_code: this.MELHOR_ENVIO_FROM,
      },
      to: {
        postal_code: dto.postal_code,
      },
      products: dto.products,
      options: {
        receipt: false,
        own_hand: false,
      },
      // services: '1,2,3,4',
      services: '1,2',
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.MELHOR_ENVIO_URL}/v2/me/shipment/calculate`,
          {
            ...data,
          },
          {
            headers: {
              Authorization: this.AUTH,
            },
          },
        ),
      );

      this.logger.log('Cotação realizada com sucesso');

      return response.data as ShipmentCalculateResponse[];
    } catch (error) {
      this.logger.error('Erro ao realizar cotação:', error.message);
      const statusCode = error.response.status;
      const errorMessage = error.response.data;
      throw new HttpException(errorMessage, statusCode);
    }
  }
}
