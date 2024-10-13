import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BillingType } from '../../asaas/dto/payments/create-charge-asaas.dto';

export enum PaymentStatus {
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
  CONFIRMED = 'CONFIRMED',
  SENT = 'SENT', //status interno
  OVERDUE = 'OVERDUE',
  REFUNDED = 'REFUNDED',
  RECEIVED_IN_CASH = 'RECEIVED_IN_CASH',
  REFUND_REQUESTED = 'REFUND_REQUESTED',
  REFUND_IN_PROGRESS = 'REFUND_IN_PROGRESS',
  CHARGEBACK_REQUESTED = 'CHARGEBACK_REQUESTED',
  CHARGEBACK_DISPUTE = 'CHARGEBACK_DISPUTE',
  AWAITING_CHARGEBACK_REVERSAL = 'AWAITING_CHARGEBACK_REVERSAL',
  DUNNING_REQUESTED = 'DUNNING_REQUESTED',
  DUNNING_RECEIVED = 'DUNNING_RECEIVED',
  AWAITING_RISK_ANALYSIS = 'AWAITING_RISK_ANALYSIS',
}

// export enum OrderStatus {
//   PENDING = 'PENDING',
//   RECEIVED = 'RECEIVED',
//   CONFIRMED = 'CONFIRMED',
//   SENT = 'SENT',
//   REFUNDED = 'REFUNDED',
// }

@Entity()
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: BillingType,
  })
  billingType: BillingType;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  // @Column({
  //   type: 'enum',
  //   enum: OrderStatus,
  //   default: OrderStatus.PENDING,
  // })
  // orderStatus: OrderStatus;

  @Column()
  external_customer_id: string;

  @Column()
  external_order_id: string;

  @Column('json')
  products: {
    id: string;
    name: string;
    main_image_url: string;
    price: number;
    discount_price?: number;
    quantity: number;
  }[];

  @Column('simple-array', { nullable: true, select: false })
  asaasData?: string[];

  @Column('simple-array', { nullable: true, select: false })
  shippingData?: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
