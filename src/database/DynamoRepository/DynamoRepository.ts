import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { checkForEnv } from "../../utils/checkForEnv";

export abstract class DynamoRepository {
  private readonly client = new DynamoDBClient();

  protected readonly docClient = DynamoDBDocumentClient.from(this.client);

  protected readonly tableName: string;

  constructor(tableName: string) {
    this.tableName = checkForEnv(process.env[tableName]);
  }
}
