import { GetCommand } from "@aws-sdk/lib-dynamodb";
import {
  CategoryRepository,
  CategoryWriteModel,
} from "../types/CategoryRepository";
import { ProductWriteModel } from "../types/ProductRepository";
import { DynamoCategoryAndProductRepository } from "../DynamoCategoryAndProductRepository/DynamoCategoryAndProductRepository";

export class DynamoCategoryRepository
  extends DynamoCategoryAndProductRepository<CategoryWriteModel>
  implements CategoryRepository
{
  constructor() {
    super("CATEGORY");
  }

  async findProductCategories(
    productId: string
  ): Promise<CategoryWriteModel[]> {
    const productIdsCommand = new GetCommand({
      TableName: this.tableName,
      Key: {
        type: this.productType,
        id: productId,
      },
    });

    const { Item } = await this.docClient.send(productIdsCommand);

    if (!Item) {
      throw new Error("Product not found");
    }

    const categoriesPromises = (Item as ProductWriteModel).categories.map(
      async (id) => {
        const command = new GetCommand({
          TableName: this.tableName,
          Key: {
            type: this.categoryType,
            id,
          },
        });

        const { Item } = await this.docClient.send(command);

        return Item as CategoryWriteModel;
      }
    );

    return Promise.all(categoriesPromises);
  }

  async appendProduct(
    id: CategoryWriteModel["id"],
    productId: ProductWriteModel["id"]
  ): Promise<void> {
    return this.appendToEntity(id, productId, "products");
  }
}
