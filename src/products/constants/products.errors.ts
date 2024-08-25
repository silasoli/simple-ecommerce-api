import { BadRequestException, ConflictException } from '@nestjs/common';

export const PRODUCTS_ERRORS = {
  INVALID_PROMOTIONAL: new BadRequestException({
    id: 'PDS-001',
    message: 'O valor promocional deve ser menor que o valor.',
  }),
  NAME_CONFLICT: new ConflictException({
    id: 'PDS-002',
    message: 'Já existe um produto com este nome.',
  }),
};
