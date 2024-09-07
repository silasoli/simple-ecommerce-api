import { BillingType } from '../../dto/payments/create-charge-asaas.dto';

export type CreateChargeAsaasResponse = {
  id: string;
  customer: string;
  dateCreated: string;
  dueDate: string;
  value: number;
  netValue: number; //Valor líquido da cobrança após desconto da tarifa do Asaas
  billingType: BillingType;
  status: string;
  pixTransaction: string; //ID
  pixQrCodeId: string; //ID QR CODE
  originalValue: number; //Valor original da cobrança (preenchido quando paga com juros e multa)
  paymentDate: string;
  invoiceUrl: string; //URL da fatura
  bankSlipUrl: string; //URL para download do boleto
};
