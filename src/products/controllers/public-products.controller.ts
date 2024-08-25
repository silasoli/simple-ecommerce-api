import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsQueryDto } from '../dto/products-query.dto';
import { PageDto } from '../../common/dto/PageDto.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { ProductsResponseDto } from '../dto/products-response.dto';
import { PRODUCTS_ERRORS } from '../constants/products.errors';
import { IDPostgresQueryDTO } from '../../common/dto/id-postgres-query.dto';

@ApiTags('Public Products')
@Controller('products')
export class PublicProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Listar produtos' })
  @ApiPaginatedResponse({
    status: 200,
    type: ProductsResponseDto,
    description: 'People listing returned successfully',
  })
  @Get()
  public async findAll(
    @Query() query: ProductsQueryDto,
  ): Promise<PageDto<ProductsResponseDto>> {
    return this.productsService.findAll(query);
  }

  @ApiOperation({ summary: 'Buscar produto por id' })
  @ApiResponse({
    status: 200,
    description: 'Produto retornado com sucesso',
    type: ProductsResponseDto,
  })
  //colocar not found
  // @ApiResponse({
  //   status: CLOUD_FLARE_ERRORS.UPLOAD_IMAGE.getStatus(),
  //   description: CLOUD_FLARE_ERRORS.DELETE_IMAGE.message,
  // })
  @Get(':id')
  findOne(@Param() params: IDPostgresQueryDTO): Promise<ProductsResponseDto> {
    return this.productsService.findOne(params.id);
  }
}
