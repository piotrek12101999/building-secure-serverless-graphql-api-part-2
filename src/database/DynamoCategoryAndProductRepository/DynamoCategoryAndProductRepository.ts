import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoRepository } from "../DynamoRepository/DynamoRepository";

type CategoryType = "CATEGORY";
type ProductType = "PRODUCT";

export abstract class DynamoCategoryAndProductRepository<
  T
> extends DynamoRepository {
  protected readonly categoryType: CategoryType = "CATEGORY";
  protected readonly productType: ProductType = "PRODUCT";

  constructor(private readonly type: CategoryType | ProductType) {
    super("PRODUCT_AND_CATEGORY_TABLE");
  }

  async findById(id: string): Promise<T> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        type: this.type,
        id: id,
      },
    });

    const { Item } = await this.docClient.send(command);

    if (!Item) {
      throw new Error("Product not found");
    }

    return Item as T;
  }

  protected async appendToEntity(
    id: string,
    entityToBeAppended: string,
    propertyName: string
  ) {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: {
        type: this.type,
        id,
      },
      UpdateExpression: `SET ${propertyName} = list_append(${propertyName}, :entity)`,
      ExpressionAttributeValues: {
        ":entity": [entityToBeAppended],
      },
    });

    await this.docClient.send(command);
  }

  async create(category: T): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        ...category,
        type: this.type,
      },
    });

    await this.docClient.send(command);
  }

  async findAll(): Promise<T[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: "#type = :type",
      ExpressionAttributeValues: {
        ":type": this.type,
      },
      ExpressionAttributeNames: {
        "#type": "type",
      },
    });

    const { Items } = await this.docClient.send(command);

    return (Items || []) as T[];
  }
}
