import { AppSyncResolverHandler } from "aws-lambda";
import { Product } from "../../../generated/graphql";
import { DynamoCategoryRepository } from "../../../database/DynamoCategoryRepository/DynamoCategoryRepository";
import { CategoryRepository } from "../../../database/types/CategoryRepository";

const categoryRepository: CategoryRepository = new DynamoCategoryRepository();

export const handler: AppSyncResolverHandler<
  {},
  Omit<Product["categories"], "products">
> = async (event) => {
  console.log(JSON.stringify(event), null, 3);
  return categoryRepository.findProductCategories(event.source!.id);
};
