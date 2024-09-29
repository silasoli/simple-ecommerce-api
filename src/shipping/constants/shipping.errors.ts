import { NotFoundException } from '@nestjs/common';

export const SHIPPING_ERRORS = {
  PRODUCTS_NOT_FOUND: new NotFoundException({
    id: 'ORD-003',
    message: 'Um ou mais produtos não foram encontrados',
  }),
};