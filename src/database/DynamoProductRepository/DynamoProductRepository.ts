import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import {
  ProductRepository,
  ProductWriteModel,
} from "../types/ProductRepository";
import { DynamoCategoryAndProductRepository } from "../DynamoCategoryAndProductRepository/DynamoCategoryAndProductRepository";
import { CategoryWriteModel } from "../types/CategoryRepository";
import { Category } from "../../generated/graphql";

export class DynamoProductRepository
  extends DynamoCategoryAndProductRepository<ProductWriteModel>
  implements ProductRepository
{
  constructor() {
    super("PRODUCT");
  }

  async appendCategory(
    id: ProductWriteModel["id"],
    categoryId: Category["id"]
  ): Promise<void> {
    return this.appendToEntity(id, categoryId, "categories");
  }

  async findCategoryProducts(categoryId: string): Promise<ProductWriteModel[]> {
    const categoryCommand = new GetCommand({
      TableName: this.tableName,
      Key: {
        type: this.categoryType,
        id: categoryId,
      },
    });

    const { Item } = await this.docClient.send(categoryCommand);

    if (!Item) {
      throw new Error("Category not found");
    }

    const productsPromises = (Item as CategoryWriteModel).products.map(
      async (id) => {
        const command = new GetCommand({
          TableName: this.tableName,
          Key: {
            type: this.productType,
            id,
          },
        });

        const { Item } = await this.docClient.send(command);

        return Item as ProductWriteModel;
      }
    );

    return Promise.all(productsPromises);
  }
}
