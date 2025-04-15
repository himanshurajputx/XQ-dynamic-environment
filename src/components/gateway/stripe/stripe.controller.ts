import { Controller, Get, Post, Version } from "@nestjs/common";
import { StripeService } from "./stripe.service";

@Controller("stripe")
export class StripeController {
  constructor(readonly stripeService: StripeService) {}

  @Get()
  @Version("1")
  getProductList() {
    return this.stripeService.getProductList();
  }

  @Post()
  @Version("1")
  createAPaymentLink() {
    return this.stripeService.createPaymentLink();
  }
}
