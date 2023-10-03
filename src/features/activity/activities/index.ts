import { activity as activityClaimGateKeeperAdopter } from "./claim-gatekeeper-adopter-credential";
import { activity as activityCreateVeridaIdentity } from "./create-verida-identity";
import { gamer31Activities } from "./gamer31";
import { activity as activityReferFriend } from "./refer-friend";
import { activity as activityUpdateProfile } from "./update-profile";
import { activity as activityUseMarkdownEditor } from "./use-markdown-editor";

export const activities = [
  activityCreateVeridaIdentity,
  activityUpdateProfile,
  activityReferFriend,
  activityUseMarkdownEditor,
  activityClaimGateKeeperAdopter,
  ...gamer31Activities,
].sort((a, b) => a.order - b.order);
