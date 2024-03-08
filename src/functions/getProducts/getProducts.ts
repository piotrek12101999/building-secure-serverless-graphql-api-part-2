import { AppSyncResolverHandler } from "aws-lambda";
import { Query } from "../../generated/graphql";

export const handler: AppSyncResolverHandler<
  {},
  Query["getProducts"]
> = async () => [];
