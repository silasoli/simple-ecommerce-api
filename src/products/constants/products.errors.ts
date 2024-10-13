import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const PRODUCTS_ERRORS = {
  INVALID_PROMOTIONAL: new BadRequestException({
    id: 'PDS-001',
    message: 'O valor promocional deve ser menor que o valor.',
  }),
  NAME_CONFLICT: new ConflictException({
    id: 'PDS-002',
    message: 'Já existe um produto com este nome.',
  }),
  PRODUCT_NOT_FOUND: new NotFoundException({
    id: 'PDS-003',
    message: 'Produto não encontrado',
  }),
  INSUFFICIENT_QUANTITY: new UnprocessableEntityException({
    id: 'PDS-004',
    message: 'Quantidade insuficiente para venda.',
  }),
};
