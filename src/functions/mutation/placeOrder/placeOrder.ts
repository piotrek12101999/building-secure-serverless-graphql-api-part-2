import { AppSyncResolverHandler } from "aws-lambda";
import {
  Currency,
  Mutation,
  MutationPlaceOrderArgs,
  Order,
  OrderStatus,
  Product,
} from "../../../generated/graphql";
import { OrderRepository } from "../../../database/types/OrderRepository";
import { DynamoOrderRepository } from "../../../database/DynamoOrderRepository/DynamoOrderRepository";
import { v4 } from "uuid";
import { ProductRepository } from "../../../database/types/ProductRepository";
import { DynamoProductRepository } from "../../../database/DynamoProductRepository/DynamoProductRepository";
import { formatPrice } from "../../../utils/formatPrice";
import { getRequesterEmail } from "../../../utils/getRequesterEmail";

const orderRepository: OrderRepository = new DynamoOrderRepository();
const productRepository: ProductRepository = new DynamoProductRepository();

export const handler: AppSyncResolverHandler<
  MutationPlaceOrderArgs,
  Mutation["placeOrder"]
> = async (event) => {
  const productWriteModelsPromises = event.arguments.input.products.map((id) =>
    productRepository.findById(id)
  );
  const productWriteModels = await Promise.all(productWriteModelsPromises);

  const products: Product[] = productWriteModels.map(
    ({ price, ...product }) => ({
      ...product,
      categories: [],
      price: formatPrice(price),
    })
  );

  const summedAllCurrencies = productWriteModels.reduce<Record<string, number>>(
    (acc, { price }) => {
      if (acc[price.currency]) {
        return {
          ...acc,
          [price.currency]: acc[price.currency] + price.amount,
        };
      }

      return { ...acc, [price.currency]: price.amount };
    },
    {}
  );

  const totalPrice = Object.keys(summedAllCurrencies)
    .map((key) =>
      formatPrice({
        currency: key as Currency,
        amount: summedAllCurrencies[key],
      })
    )
    .join(", ");

  const order: Order = {
    id: v4(),
    created: new Date().toISOString(),
    products,
    purchaserEmail: getRequesterEmail(event),
    status: OrderStatus.Pending,
    totalPrice,
  };

  await orderRepository.create(order);

  return order;
};
