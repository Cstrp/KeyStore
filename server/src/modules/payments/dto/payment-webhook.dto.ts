import { CURRENCY, PAYMENT_EVENT_STATUS } from '../../../enums';
import { IsIn, IsNumber, IsString, IsISO8601 } from 'class-validator';

export class PaymentWebhookDto {
  @IsString()
  public readonly event_id!: string;

  @IsString()
  public readonly order_id!: string;

  @IsIn([PAYMENT_EVENT_STATUS.PAID, PAYMENT_EVENT_STATUS.PAYMENT_FAILED])
  public readonly status!: PAYMENT_EVENT_STATUS;

  @IsNumber()
  public readonly amount!: number;

  @IsString()
  public readonly currency!: CURRENCY.RUB;

  @IsISO8601()
  public readonly created_at!: string;
}
