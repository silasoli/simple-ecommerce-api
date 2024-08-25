import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../database/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    // private readonly cloudflareService: CloudflareService,
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) {}

  private async checkIfPromotionalValueIsValid(
    dto: CreateProductDto | UpdateProductDto,
  ) {
    if (dto.discount_price > dto.price) throw new BadRequestException('erro');
  }

  async create(dto: CreateProductDto) {
    const exist = await this.repository.findOneBy({
      name: dto.name,
    });

    if (exist)
      throw new ConflictException('Já existe um produto com este nome.');

    this.checkIfPromotionalValueIsValid(dto);

    return this.repository.save(dto);
  }

  public async findAll() {
    return this.findAll();
  }

  public async findOne(id: string): Promise<Product> {
    return this.repository.findOneByOrFail({ id });
  }

  public async update(id: string, dto: UpdateProductDto) {
    const exist = await this.findOne(id);

    const product = { ...exist, ...dto };

    this.checkIfPromotionalValueIsValid(product);

    return this.repository.update(id, { ...product });
  }

  public async remove(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
