import { AppSyncResolverHandler } from "aws-lambda";
import {
  Mutation,
  MutationStartProcessingOrderArgs,
  OrderStatus,
} from "../../generated/graphql";
import { isAdmin } from "../../utils/isAdmin";
import { OrderRepository } from "../../database/types/OrderRepository";
import { DynamoOrderRepository } from "../../database/DynamoOrderRepository/DynamoOrderRepository";

const orderRepository: OrderRepository = new DynamoOrderRepository();

export const handler: AppSyncResolverHandler<
  MutationStartProcessingOrderArgs,
  Mutation["startProcessingOrder"] | void
> = async (event, _, callback) => {
  if (!isAdmin(event)) {
    return callback("User not authorized", undefined);
  }

  const order = await orderRepository.findById(event.arguments.id);
  await orderRepository.updateStatus(order.id, OrderStatus.Processing);

  return order;
};
