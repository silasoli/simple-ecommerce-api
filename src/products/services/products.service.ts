import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../database/entities/product.entity';
import { Repository } from 'typeorm';
import { PRODUCTS_ERRORS } from '../constants/products.errors';
import { ProductsQueryDto } from '../dto/products-query.dto';
import { PageDto } from '../../common/dto/PageDto.dto';
import { PageMetaDto } from '../../common/dto/PageMetaDto.dto';
import { ProductsResponseDto } from '../dto/products-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) {}

  private checkIfPromotionalValueIsValid(
    dto: CreateProductDto | UpdateProductDto,
  ) {
    if (dto.discount_price > dto.price)
      throw PRODUCTS_ERRORS.INVALID_PROMOTIONAL;
  }

  async create(dto: CreateProductDto): Promise<ProductsResponseDto> {
    this.checkIfPromotionalValueIsValid(dto);

    const exist = await this.repository.findOneBy({
      name: dto.name,
    });

    if (exist) throw PRODUCTS_ERRORS.NAME_CONFLICT;

    const created = await this.repository.save(dto);

    return new ProductsResponseDto(created);
  }

  public async findAll(
    dto: ProductsQueryDto,
  ): Promise<PageDto<ProductsResponseDto>> {
    const queryBuilder = this.repository.createQueryBuilder('people');

    if (dto.name) {
      // dto.name = FormatUtil.capitalizeWords(dto.name);

      queryBuilder.andWhere('people.name LIKE :name', {
        name: `${dto.name.toLocaleLowerCase()}%`,
      });
    }

    queryBuilder
      .orderBy('people.id', dto.order)
      .offset((dto.page - 1) * dto.take)
      .limit(dto.take);

    const [data, itemCount] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: dto });

    return new PageDto(data, pageMetaDto);
  }

  public async findOne(id: string): Promise<ProductsResponseDto> {
    const product = await this.repository.findOneByOrFail({ id });

    return new ProductsResponseDto(product);
  }

  public async update(
    id: string,
    dto: UpdateProductDto,
  ): Promise<ProductsResponseDto> {
    // add validacao por name
    const exist = await this.findOne(id);

    const product = { ...exist, ...dto };

    this.checkIfPromotionalValueIsValid(product);

    await this.repository.update(id, { ...product });

    const updated = await this.findOne(id);

    return new ProductsResponseDto(updated);
  }

  public async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.repository.softDelete(id);
  }
}
