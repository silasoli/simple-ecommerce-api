import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import * as FormData from 'form-data';
import { lastValueFrom } from 'rxjs';
import { CLOUD_FLARE_ERRORS } from '../constants/cloud-flare.errors';

@Injectable()
export class CloudFlareService {
  private readonly logger = new Logger(CloudFlareService.name);

  accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  apiKey = `Bearer ${process.env.CLOUDFLARE_API_KEY}`;

  constructor(private readonly httpService: HttpService) {}

  private validUploadImage(file: Express.Multer.File): void {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];

    if (!allowedMimeTypes.includes(file.mimetype)) 
      throw CLOUD_FLARE_ERRORS.INVALID_IMAGE;

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) throw CLOUD_FLARE_ERRORS.INVALID_SIZE;
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    this.validUploadImage(file);

    const filename = file.originalname;
    const image = file.buffer;

    try {
      const formData = new FormData();
      formData.append('file', image, {
        filename: filename,
        contentType: 'image/jpeg',
      });

      const response = await lastValueFrom(
        this.httpService.post(
          `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/images/v1`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              Authorization: this.apiKey,
            },
          },
        ),
      );
      return response.data.result.variants[0];
    } catch (error) {
      this.logger.error('Erro ao fazer upload da imagem:', error.message);
      throw CLOUD_FLARE_ERRORS.UPLOAD_IMAGE;
    }
  }

  async deleteImage(id: string): Promise<void> {
    try {
      await lastValueFrom(
        this.httpService.delete(
          `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/images/v1/${id}`,
          {
            headers: {
              Authorization: this.apiKey,
            },
          },
        ),
      );
    } catch (error) {
      this.logger.error('Erro ao apagar imagem:', error.message);
      throw CLOUD_FLARE_ERRORS.DELETE_IMAGE;
    }
  }
}
