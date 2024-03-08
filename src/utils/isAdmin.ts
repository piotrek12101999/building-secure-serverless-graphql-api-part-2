import { AppSyncResolverEvent } from "aws-lambda";
import { isCognitoIdentity } from "./isCognitoIdentity";

export const isAdmin = (event: AppSyncResolverEvent<unknown>): boolean => {
  if (!isCognitoIdentity(event.identity)) {
    return false;
  }

  if (!event.identity.claims["cognito:groups"]) {
    return false;
  }

  return event.identity.claims["cognito:groups"].includes("Admins");
};
