import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../database/entities/product.entity';
import { In, Not, Repository } from 'typeorm';
import { PRODUCTS_ERRORS } from '../constants/products.errors';
import { ProductsQueryDto } from '../dto/products-query.dto';
import { PageDto } from '../../common/dto/PageDto.dto';
import { PageMetaDto } from '../../common/dto/PageMetaDto.dto';
import { ProductsResponseDto } from '../dto/products-response.dto';
import { ProductDto } from '../../orders/dto/order/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) { }

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
    const queryBuilder = this.repository.createQueryBuilder('products');

    if (dto.name) {
      // dto.name = FormatUtil.capitalizeWords(dto.name);
      queryBuilder.andWhere('products.name ILIKE :name', {
        name: `${dto.name}%`,
      });
    }

    if (dto.scale) {
      queryBuilder.andWhere('products.scales LIKE :scale', {
        scale: `%${dto.scale}%`,
      });
    }

    // Filtro por categoria
    if (dto.category) {
      queryBuilder.andWhere('products.category = :category', {
        category: dto.category,
      });
    }

    if (dto.ref) {
      queryBuilder.andWhere('products.ref = :ref', {
        ref: dto.ref,
      });
    }

    const orderField = dto.orderField
      ? `products.${dto.orderField}`
      : 'products.id';

    queryBuilder.orderBy(orderField, dto.order);

    queryBuilder
      // .orderBy('products.id', dto.order)
      .offset((dto.page - 1) * dto.take)
      .limit(dto.take);

    const [data, itemCount] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: dto });

    return new PageDto(data, pageMetaDto);
  }

  public async findAllFeatured(): Promise<ProductsResponseDto[]> {
    const data = await this.repository.find({
      where: {
        isFeatured: true,
      },
    });

    return data.map((item) => new ProductsResponseDto(item));
  }

  public async findAllNewCollection(): Promise<ProductsResponseDto[]> {
    const data = await this.repository.find({
      where: {
        isNewCollection: true,
      },
    });

    return data.map((item) => new ProductsResponseDto(item));
  }

  public async findOne(id: string): Promise<ProductsResponseDto> {
    const product = await this.repository.findOneByOrFail({ id });

    return new ProductsResponseDto(product);
  }

  public async update(
    id: string,
    dto: UpdateProductDto,
  ): Promise<ProductsResponseDto> {
    const existByName = await this.repository.findOneBy({
      name: dto.name,
      id: Not(id),
    });

    if (existByName) throw PRODUCTS_ERRORS.NAME_CONFLICT;

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

  public async findByIDS(ids: string[]): Promise<ProductsResponseDto[]> {
    const products = await this.repository.find({ where: { id: In(ids) } });

    return products.map((product) => new ProductsResponseDto(product));
  }

  public async checkProductsExistence(
    productIds: string[],
  ): Promise<Product[]> {
    const products = await this.repository.find({
      where: { id: In(productIds) },
    });

    if (products.length !== productIds.length) {
      throw PRODUCTS_ERRORS.PRODUCT_NOT_FOUND;
    }

    return products;
  }

  // public validateProductQuantity(
  //   product: Product,
  //   requestedQuantity: number,
  // ): void {
  //   if (product.quantity < requestedQuantity) {
  //     throw PRODUCTS_ERRORS.INSUFFICIENT_QUANTITY;
  //   }
  // }

  // public async updateQuantitiesAfterSale(
  //   productsDtos: ProductDto[],
  // ): Promise<void> {
  //   const productIds = productsDtos.map((product) => product.id);

  //   const products = await this.checkProductsExistence(productIds);

  //   await this.repository.manager.transaction(
  //     async (transactionalEntityManager) => {
  //       for (const dto of productsDtos) {
  //         const product = products.find((p) => p.id === dto.id);

  //         this.validateProductQuantity(product, dto.quantity);

  //         product.quantity -= dto.quantity;

  //         await transactionalEntityManager.save(product);
  //       }
  //     },
  //   );
  // }
}
