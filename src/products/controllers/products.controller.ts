import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsResponseDto } from '../dto/products-response.dto';
import { PRODUCTS_ERRORS } from '../constants/products.errors';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';
import { Role } from '../../roles/decorators/roles.decorator';
import { Roles } from '../../roles/enums/role.enum';
import { IDPostgresQueryDTO } from '../../common/dto/id-postgres-query.dto';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Criar produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
    type: ProductsResponseDto,
  })
  @ApiResponse({
    status: PRODUCTS_ERRORS.INVALID_PROMOTIONAL.getStatus(),
    description: PRODUCTS_ERRORS.INVALID_PROMOTIONAL.message,
  })
  @ApiResponse({
    status: PRODUCTS_ERRORS.NAME_CONFLICT.getStatus(),
    description: PRODUCTS_ERRORS.NAME_CONFLICT.message,
  })
  @ApiBody({ type: CreateProductDto })
  @Post()
  @Role([Roles.ADMIN])
  create(@Body() dto: CreateProductDto): Promise<ProductsResponseDto> {
    return this.productsService.create(dto);
  }

  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso',
    type: ProductsResponseDto,
  })
  @ApiResponse({
    status: PRODUCTS_ERRORS.INVALID_PROMOTIONAL.getStatus(),
    description: PRODUCTS_ERRORS.INVALID_PROMOTIONAL.message,
  })
  @ApiResponse({
    status: PRODUCTS_ERRORS.NAME_CONFLICT.getStatus(),
    description: PRODUCTS_ERRORS.NAME_CONFLICT.message,
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado',
  })
  @ApiBody({ type: UpdateProductDto })
  @Patch(':id')
  @Role([Roles.ADMIN])
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductsResponseDto> {
    return this.productsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Excluir produto' })
  @ApiResponse({
    status: 204,
    description: 'Exclusão realizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado',
  })
  @Delete(':id')
  @Role([Roles.ADMIN])
  remove(@Param() params: IDPostgresQueryDTO): Promise<void> {
    return this.productsService.remove(params.id);
  }
}
