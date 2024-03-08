import { AppSyncIdentity, AppSyncIdentityCognito } from "aws-lambda";

export const isCognitoIdentity = (
  identity: AppSyncIdentity
): identity is AppSyncIdentityCognito => {
  if (!identity) {
    return false;
  }

  return (identity as AppSyncIdentityCognito)?.claims?.email;
};
