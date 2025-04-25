import { Injectable } from "@nestjs/common";
import Stripe from "stripe";
const stripeSecretKey =
  "sk_test_51QHLBNFaG7344N7WvqrZUet79h97LNKiGbVTHmlWEKTTaTxJlBY3lFmvywVicalg6crVfrPZtwJzWcqZVjxHs0Yp00yd7ksZkU";

// @ts-ignore
const stripe = new Stripe(stripeSecretKey, { apiVersion: "2022-11-15" }); // Ensure the API version is specified

@Injectable()
export class StripeService {
  constructor() {}

  async getProductList(): Promise<any> {
    const productData = [];
    const prices = await stripe.prices.list({
      limit: 10,
    });

    for (const price of prices.data) {
      // @ts-ignore
      productData.push({
        ...price,
        product: await this.getProductById(price.product)
      });
    }

    return productData;
  }

  async getProductById(id: any): Promise<any> {
    const product = await stripe.products.retrieve(id);
    return product;
  }

  async createPaymentLink(product?: any){
    return  await stripe.paymentLinks.create({
      line_items: [
        {
          price: "price_1R8nwTFaG7344N7WdALYOsQn",
          quantity: 1,
        },
      ],
    });
  }
}
