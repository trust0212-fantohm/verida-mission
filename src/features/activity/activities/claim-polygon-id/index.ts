import { defineMessage } from "react-intl";

import { MISSION_02_ID } from "~/features/activity/missions";
import type {
  Activity,
  ActivityOnExecute,
  ActivityOnInit,
  ActivityOnUnmount,
} from "~/features/activity/types";
import { wait } from "~/utils";

const ACTIVITY_ID = "claim-polygon-id"; // Never change the id

const handleInit: ActivityOnInit = () => {
  return Promise.resolve();
};

const handleExecute: ActivityOnExecute = async (_veridaWebUser) => {
  // Wait a bit for UX purposes
  await wait(2000);
  return { status: "pending" };
};

const handleUnmount: ActivityOnUnmount = async (_veridaWebUser) => {
  return Promise.resolve();
};

export const activity: Activity = {
  id: ACTIVITY_ID,
  missionId: MISSION_02_ID,
  enabled: false,
  visible: false,
  order: 1,
  points: 50,
  title: defineMessage({
    id: "activities.claimPolygonId.title",
    defaultMessage: "Claim a Polygon ID credential",
    description: "Title of the activity 'claim Polygon ID'",
  }),
  shortDescription: defineMessage({
    id: "activities.claimPolygonId.shortDescription",
    defaultMessage:
      "Go to the Polygon ID issuer demo app and claim a KYC Age Credential",
    description: "Short description of the activity 'claim Polygon ID'",
  }),
  actionLabel: defineMessage({
    id: "activities.claimPolygonId.actionLabel",
    defaultMessage: "Verify",
    description: "Label of the button to start the activity claim polygon id",
  }),
  actionExecutingLabel: defineMessage({
    id: "activities.claimPolygonId.actionExecutingLabel",
    defaultMessage: "Verifying",
    description:
      "Label of the button when the activity 'claim Polygon ID' is being executed",
  }),
  onInit: handleInit,
  onExecute: handleExecute,
  onUnmount: handleUnmount,
};
