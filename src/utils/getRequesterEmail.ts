import { AppSyncResolverEvent } from "aws-lambda";
import { isCognitoIdentity } from "./isCognitoIdentity";

export const getRequesterEmail = (
  event: AppSyncResolverEvent<unknown>
): string => {
  if (!isCognitoIdentity(event.identity)) {
    throw new Error("Wrong identity provider");
  }

  return event.identity.claims.email;
};
