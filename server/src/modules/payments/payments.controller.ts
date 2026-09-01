import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import type { PaymentWebhookDto } from './dto/payment-webhook.dto';
import { PaymentsService } from './payments.service';

@AllowAnonymous()
@Controller('webhook')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('payment')
  @HttpCode(HttpStatus.OK)
  public async webhook(@Body() dto: PaymentWebhookDto): Promise<{ ok: true }> {
    await this.paymentsService.handleWebhook(dto);

    return { ok: true };
  }
}
