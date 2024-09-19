import { HttpException, Injectable, Logger } from '@nestjs/common';
import { MakeBudgetDto } from '../dto/melhor-envio/make-budget.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MelhorEnvioService {
  private readonly logger = new Logger(MelhorEnvioService.name);

  constructor(private readonly httpService: HttpService) {}

  // accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  // apiKey = `Bearer ${process.env.CLOUDFLARE_API_KEY}`;

  public async makeBudget(dto: MakeBudgetDto): Promise<any> {
    const productTemplate = {
      width: 11,
      height: 17,
      length: 11,
      weight: 0.3,
      insurance_value: 10.1,
    };

    const products = dto.products.map((dto) => ({
      ...productTemplate,
      id: dto.id,
      quantity: dto.quantity,
    }));

    const data = {
      from: {
        postal_code: '41820-021',
      },
      to: {
        postal_code: dto.postal_code,
      },
      products: [...products],
      options: {
        receipt: false,
        own_hand: false,
      },
      services: '1,2,18',
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate`,
          {
            ...data,
          },
          {
            headers: {
              Authorization: '123',
            },
          },
        ),
      );

      return response.data as any;
    } catch (error) {
      this.logger.error('Erro ao realizar cotação:', error.message);
      const statusCode = error.response.status;
      const errorMessage = error.response.data;
      throw new HttpException(errorMessage, statusCode);
    }
  }
}
