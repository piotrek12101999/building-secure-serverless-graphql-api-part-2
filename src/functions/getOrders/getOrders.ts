import { AppSyncIdentityCognito, AppSyncResolverHandler } from "aws-lambda";
import { Query } from "../../generated/graphql";
import { OrderRepository } from "../../database/types/OrderRepository";
import { DynamoOrderRepository } from "../../database/DynamoOrderRepository/DynamoOrderRepository";
import { getRequesterEmail } from "../../utils/getRequesterEmail";

const orderRepository: OrderRepository = new DynamoOrderRepository();

export const handler: AppSyncResolverHandler<{}, Query["getOrders"]> = async (
  event
) => {
  const orders = await orderRepository.findAllByPurchaserEmail(
    getRequesterEmail(event)
  );

  return orders;
};
