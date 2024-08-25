import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export const CLOUD_FLARE_ERRORS = {
  UPLOAD_IMAGE: new InternalServerErrorException({
    id: 'CDF-001',
    message: 'Failed to save image',
  }),
  DELETE_IMAGE: new InternalServerErrorException({
    id: 'CDF-002',
    message: 'Failed to delete image',
  }),
  INVALID_IMAGE: new BadRequestException({
    id: 'CDF-003',
    message:
      'O arquivo enviado não é uma imagem válida. Tipos aceitos: JPEG, PNG',
  }),
  INVALID_SIZE: new BadRequestException({
    id: 'CDF-004',
    message:
      'O arquivo enviado é muito grande. O tamanho máximo permitido é 10MB.',
  }),
};
