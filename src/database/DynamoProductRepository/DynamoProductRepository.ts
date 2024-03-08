import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Product } from "../../generated/graphql";
import { DynamoRepository } from "../DynamoRepository/DynamoRepository";
import {
  ProductRepository,
  ProductWriteModel,
} from "../types/ProductRepository";

export class DynamoProductRepository
  extends DynamoRepository
  implements ProductRepository
{
  constructor() {
    super("PRODUCT_TABLE");
  }

  async create(product: ProductWriteModel): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: product,
    });

    await this.docClient.send(command);
  }

  async findById(id: Product["id"]): Promise<ProductWriteModel> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        id,
      },
    });

    const { Item } = await this.docClient.send(command);

    return Item as ProductWriteModel;
  }

  async findAll(): Promise<ProductWriteModel[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const { Items } = await this.docClient.send(command);

    return (Items || []) as ProductWriteModel[];
  }
}
