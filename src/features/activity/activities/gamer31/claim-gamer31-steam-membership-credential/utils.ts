import {
  type ReceivedMessage,
  type VeridaVerifiableCredentialRecord,
} from "~/features/verida";

import { GAMER31_STEAM_VC_SCHEMA_URLS } from "./constants";
import { type Gamer31SteamCredentialSubject } from "./types";

export function verifyReceivedMessage(
  message: ReceivedMessage<unknown>
): boolean {
  const data = message.data.data[0];
  if (data === undefined) {
    return false;
  }

  const vc =
    data as VeridaVerifiableCredentialRecord<Gamer31SteamCredentialSubject>;

  // TODO: Consider using zod to validate

  if (
    !vc.credentialSchema ||
    !GAMER31_STEAM_VC_SCHEMA_URLS.includes(vc.credentialSchema)
  ) {
    return false;
  }

  // TODO: Consider using the issuer DID and the type instead of the schema

  return true;
}
