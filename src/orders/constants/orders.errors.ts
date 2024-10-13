import { BadGatewayException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';

export const ORDERS_ERRORS = {
  FAILED_CREATE_ASAAS_ORDER: new BadGatewayException({
    id: 'ORD-001',
    message: 'Falha para criar pedido na adquirente',
  }),
  PRODUCT_NOT_FOUND: new NotFoundException({
    id: 'ORD-002',
    message: 'Produto não encontrado',
  }),
  PRODUCTS_NOT_FOUND: new NotFoundException({
    id: 'ORD-003',
    message: 'Um ou mais produtos não foram encontrados',
  }),
  SHIPPING_NOT_FOUND: new BadGatewayException({
    id: 'ORD-004',
    message: 'Frete não encontrado',
  }),
  INSUFFICIENT_QUANTITY: new UnprocessableEntityException({
    id: 'PDS-004',
    message: 'Quantidade insuficiente para venda.',
  }),
};
