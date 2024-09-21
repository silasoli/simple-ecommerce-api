import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Address } from './address.entity';

@Entity()
export class Customers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  cpfCnpj: string;
  
  @Column()
  email: string;

  @Column()
  mobilePhone: string;

  @Column({ unique: true })
  external_id: string

  @OneToOne(() => Address, (address) => address.customer, { cascade: true }) 
  @JoinColumn() 
  address: Address;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
