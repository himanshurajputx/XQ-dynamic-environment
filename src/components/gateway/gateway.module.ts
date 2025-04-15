import { Module } from "@nestjs/common";
import { StripeController } from "./stripe/stripe.controller";
import { StripeService } from "./stripe/stripe.service";

@Module({
  imports: [],
  providers: [StripeService],
  controllers: [StripeController],
})
export class GatewayModule {}
