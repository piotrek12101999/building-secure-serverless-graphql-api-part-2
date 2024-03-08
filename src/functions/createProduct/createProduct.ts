import { AppSyncResolverHandler } from "aws-lambda";
import { Mutation, MutationCreateProductArgs } from "../../generated/graphql";
import {
  ProductRepository,
  ProductWriteModel,
} from "../../database/types/ProductRepository";
import { DynamoProductRepository } from "../../database/DynamoProductRepository/DynamoProductRepository";
import { formatPrice } from "../../utils/formatPrice";
import { v4 } from "uuid";
import { isAdmin } from "../../utils/isAdmin";

const productRepository: ProductRepository = new DynamoProductRepository();

export const handler: AppSyncResolverHandler<
  MutationCreateProductArgs,
  Mutation["createProduct"] | void
> = async (event, _, callback) => {
  if (!isAdmin(event)) {
    return callback("User not authorized", undefined);
  }

  const productWriteModel: ProductWriteModel = {
    ...event.arguments.input,
    id: v4(),
    created: new Date().toISOString(),
  };

  await productRepository.create(productWriteModel);

  return { ...productWriteModel, price: formatPrice(productWriteModel.price) };
};
