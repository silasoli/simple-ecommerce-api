import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  batch: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  brand: string;

  @Column()
  description: string;

  @Column('int')
  price: number;

  @Column('simple-array')
  category: string[];

  @Column()
  main_image_url: string;

  @Column('simple-array')
  images: string[];

  @Column('int')
  quantity: number; 

  @Column({ nullable: true })
  code?: string;

  @Column('simple-array')
  subcategory: string[];

  @Column('int', { nullable: true })
  discount_price?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
