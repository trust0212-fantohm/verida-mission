import { defineMessage } from "react-intl";

import { handleInitActivityCheckMessage } from "~/features/activity";
import { MISSION_02_ID } from "~/features/activity/missions";
import type {
  Activity,
  ActivityOnExecute,
  ActivityOnInit,
} from "~/features/activity/types";
import { Sentry } from "~/features/sentry";
import {
  VAULT_CREDENTIAL_SCHEMA_URL,
  sendDataRequest,
} from "~/features/verida";

import { POLYGON_ID_KYC_AGE_VC_SCHEMA_URL } from "./constants";
import { verifyReceivedMessage } from "./utils";

const ACTIVITY_ID = "claim-polygon-id"; // Never change the id

const handleInit: ActivityOnInit = async (
  veridaWebUser,
  userActivity,
  saveActivity
) => {
  return handleInitActivityCheckMessage({
    activityId: ACTIVITY_ID,
    userActivity,
    veridaWebUser: veridaWebUser.current,
    verifyReceivedMessage,
    saveActivity,
    // TODO: Make a localised message of this message
    successToastMessage:
      "Congrats, you have completed the activity 'Claim a Polygon ID Age credential'",
  });
};

const handleExecute: ActivityOnExecute = async (veridaWebUser) => {
  try {
    // TODO: Make a localised message of this message
    const message = "Please share a Polygon ID KYC Age credential";

    const sentMessage = await sendDataRequest(veridaWebUser.current, {
      messageSubject: message,
      requestSchema: VAULT_CREDENTIAL_SCHEMA_URL,
      filter: {
        credentialSchema: POLYGON_ID_KYC_AGE_VC_SCHEMA_URL,
      },
    });

    return {
      status: "pending",
      data: {
        requestId: sentMessage?.id,
      },
      message: defineMessage({
        id: "activities.claimPolygonId.executePendingMessage",
        defaultMessage:
          "A request has been sent to your Wallet inbox. Please check your inbox and share a Polygon ID KYC Age credential.",
        description:
          "Message explaining a request has been sent to the their Wallet inbox",
      }),
    };
  } catch (error: unknown) {
    Sentry.captureException(error);
    return {
      status: "todo",
      message: defineMessage({
        id: "activity.claimPolygonId.gettingExecutionErrorMessage",
        defaultMessage: `There was an error while sending you the credential request, please try again later`,
        description: "Error message when we can't get the user profile",
      }),
    };
  }
};

export const activity: Activity = {
  id: ACTIVITY_ID,
  missionId: MISSION_02_ID,
  enabled: true,
  visible: true,
  order: 1,
  points: 100,
  title: defineMessage({
    id: "activities.claimPolygonId.title",
    defaultMessage: "Claim a Polygon ID Age credential",
    description: "Title of the activity 'claim Polygon ID'",
  }),
  shortDescription: defineMessage({
    id: "activities.claimPolygonId.shortDescription",
    defaultMessage:
      "Go to the Polygon ID issuer demo app and claim a KYC Age Credential, then share this credential by replying to the message you received in your inbox.",
    description: "Short description of the activity 'claim Polygon ID'",
  }),
  actionLabel: defineMessage({
    id: "activities.claimPolygonId.actionLabel",
    defaultMessage: "Start",
    description: "Label of the button to start the activity claim polygon id",
  }),
  actionExecutingLabel: defineMessage({
    id: "activities.claimPolygonId.actionExecutingLabel",
    defaultMessage: "Sending message",
    description:
      "Label of the button when the activity 'claim Polygon ID' is being executed",
  }),
  onInit: handleInit,
  onExecute: handleExecute,
  resources: [
    {
      label: defineMessage({
        id: "activities.claimPolygonId.resources.polygonIdDemoAppUrl.label",
        defaultMessage: "Polygon ID demo app",
        description: "Label of the resource 'Polygon ID issuer demo app'",
      }),
      url: "https://issuer-demo-testing-mainnet.polygonid.me/",
    },
  ],
};
