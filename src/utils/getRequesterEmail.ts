import {
  AppSyncIdentity,
  AppSyncIdentityCognito,
  AppSyncResolverEvent,
} from "aws-lambda";

const isCognitoIdentity = (
  identity: AppSyncIdentity
): identity is AppSyncIdentityCognito => {
  if (!identity) {
    return false;
  }

  return (identity as AppSyncIdentityCognito)?.claims?.email;
};

export const getRequesterEmail = (
  event: AppSyncResolverEvent<unknown>
): string => {
  if (!isCognitoIdentity(event.identity)) {
    throw new Error("Wrong identity provider");
  }

  return event.identity.claims.email;
};
