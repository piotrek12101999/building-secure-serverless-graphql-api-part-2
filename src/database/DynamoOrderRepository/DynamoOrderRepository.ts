import { Order, OrderStatus } from "../../generated/graphql";
import { OrderRepository } from "../types/OrderRepository";
import {
  UpdateCommand,
  QueryCommand,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoRepository } from "../DynamoRepository/DynamoRepository";

export class DynamoOrderRepository
  extends DynamoRepository
  implements OrderRepository
{
  constructor() {
    super("ORDER_TABLE");
  }

  async create(order: Order): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: order,
    });

    await this.docClient.send(command);
  }

  async findById(id: string): Promise<Order> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        id,
      },
    });

    const { Item } = await this.docClient.send(command);

    if (!Item) {
      throw new Error("Not found error");
    }

    return Item as Order;
  }

  async findAllByPurchaserEmail(
    email: Order["purchaserEmail"]
  ): Promise<Order[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "byEmailAndCreatedDate",
      KeyConditionExpression: "purchaserEmail = :purchaserEmail",
      ExpressionAttributeValues: {
        ":purchaserEmail": email,
      },
    });

    const { Items } = await this.docClient.send(command);

    return Items as Order[];
  }

  async updateStatus(id: Order["id"], status: OrderStatus): Promise<void> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: {
        id,
      },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": status,
        ":id": id,
      },
      ConditionExpression: "id = :id",
    });

    await this.docClient.send(command);
  }
}
