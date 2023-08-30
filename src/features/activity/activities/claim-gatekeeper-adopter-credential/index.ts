import type { IMessaging } from "@verida/types";
import toast from "react-hot-toast";
import { defineMessage } from "react-intl";

import { MISSION_02_ID } from "~/features/activity/missions";
import type {
  Activity,
  ActivityOnExecute,
  ActivityOnInit,
} from "~/features/activity/types";
import { Logger } from "~/features/logger";
import { Sentry } from "~/features/sentry";
import {
  type ReceivedMessage,
  VAULT_CREDENTIAL_SCHEMA_URL,
  getMessaging,
  sendDataRequest,
} from "~/features/verida";

import { GATEKEEPER_ADOPTER_VC_SCHEMA_URLS } from "./constants";
import { verifyReceivedMessage } from "./utils";

const logger = new Logger("activity");

const ACTIVITY_ID = "claim-gatekeeper-adopter-credential"; // Never change the id

const handleInit: ActivityOnInit = async (
  veridaWebUser,
  userActivity,
  saveActivity
) => {
  logger.info("Init activity", { activityId: ACTIVITY_ID });

  const checkMessage = async (message: ReceivedMessage<unknown>) => {
    try {
      logger.info("Checking received message", { activityId: ACTIVITY_ID });

      const verified = verifyReceivedMessage(message);
      if (!verified) {
        return;
      }

      logger.info(
        "Received message matched and verified, updating activity now",
        { activityId: ACTIVITY_ID }
      );

      await saveActivity({
        id: ACTIVITY_ID,
        status: "completed",
        data: {},
      });

      toast.success(
        "Congrats, you have completed the activity 'Claim a GateKeeper Adopter credential'"
      );
    } catch (error: unknown) {
      Sentry.captureException(error, {
        tags: {
          activityId: ACTIVITY_ID,
        },
      });
    }
  };

  let messaging: IMessaging | undefined;

  const cleanUpFunction = async () => {
    try {
      logger.info("Cleaning up onMessage handler", { activityId: ACTIVITY_ID });

      if (messaging) await messaging.offMessage(checkMessage);
    } catch (error: unknown) {
      Sentry.captureException(error, {
        tags: {
          activityId: ACTIVITY_ID,
        },
      });
    }
  };

  if (userActivity?.status === "completed") {
    logger.debug("Activity already completed, not checking messages");
    return cleanUpFunction;
  }

  try {
    logger.info("Getting Verida Context and Messaging", {
      activityId: ACTIVITY_ID,
    });

    messaging = await getMessaging(veridaWebUser.current);

    const existingRequestId = userActivity?.data?.requestId;

    if (existingRequestId) {
      const messages = (await messaging.getMessages()) as
        | ReceivedMessage<unknown>[]
        | undefined;

      if (messages) {
        logger.info("Checking existing messages for existing request id", {
          activityId: ACTIVITY_ID,
        });

        void Promise.allSettled(
          messages
            .filter((message) => message.data.replyId === existingRequestId)
            .map(checkMessage)
        );
      }
    }

    logger.info("Setting up onMessage handler", { activityId: ACTIVITY_ID });

    void messaging.onMessage(checkMessage);
  } catch (error: unknown) {
    Sentry.captureException(error, {
      tags: {
        activityId: ACTIVITY_ID,
      },
    });
  }

  return cleanUpFunction;
};

const handleExecute: ActivityOnExecute = async (veridaWebUser) => {
  try {
    // TODO: Make a localised message of this message
    const message = "Please share a GateKeeper Adopter credential";

    logger.info("Sending data request", { activityId: ACTIVITY_ID });

    const sentMessage = await sendDataRequest(veridaWebUser.current, {
      messageSubject: message,
      requestSchema: VAULT_CREDENTIAL_SCHEMA_URL,
      // TODO: Consider using the issuer DID and the type/credentialSubject.type instead of the schema
      filter: {
        $or: GATEKEEPER_ADOPTER_VC_SCHEMA_URLS.map((url) => ({
          credentialSchema: url,
        })),
      },
    });

    logger.info("Data request sent", {
      activityId: ACTIVITY_ID,
      hasRequestId: !!sentMessage?.id,
    });

    return {
      status: "pending",
      data: {
        requestId: sentMessage?.id,
      },
      message: defineMessage({
        id: "activities.claimGateKeperAdopter.executePendingMessage",
        defaultMessage:
          "A request has been sent to your Wallet inbox. Please check your inbox and share a GateKeeper Adopter credential.",
        description:
          "Message explaining a request has been sent to the their Wallet inbox",
      }),
    };
  } catch (error: unknown) {
    Sentry.captureException(error, {
      tags: {
        activityId: ACTIVITY_ID,
      },
    });
    return {
      status: "todo",
      message: defineMessage({
        id: "activity.claimGateKeperAdopter.gettingExecutionErrorMessage",
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
  order: 2,
  points: 100,
  title: defineMessage({
    id: "activities.claimGateKeperAdopter.title",
    defaultMessage: "Claim a GateKeeper Adopter credential",
    description: "Title of the activity 'Claim Gatekeeper Adopter credential'",
  }),
  shortDescription: defineMessage({
    id: "activities.claimGateKeperAdopter.shortDescription",
    defaultMessage: `Claim the GateKeeper Adopter credential to prove you were an early pioneer of GateKeeper! The credential will be stored in your Verida Wallet, and can be securely shared and verified.`,
    description:
      "Short description of the activity 'claim GateKeeper Adopter credential'",
  }),
  longDescription: defineMessage({
    id: "activities.claimGateKeperAdopter.longDescription",
    defaultMessage: `Claim the GateKeeper Adopter credential to prove you were an early pioneer of GateKeeper! The credential will be stored in your Verida Wallet, and can be securely shared and verified.{newline}{newline}Step 1. Go to the GateKeeper claim page to start the process (link in resources below).{newline}{newline}Step 2. Select the Verida Wallet and follow the prompts to claim the credential and save it in your Wallet.{newline}{newline}Step 3. Click on the 'Send Request' button below and share the credential by replying to the message you received in your Wallet inbox.`,
    description:
      "Long description of the activity 'claim GateKeeper Adopter credential'",
  }),
  actionLabel: defineMessage({
    id: "activities.claimGateKeperAdopter.actionLabel",
    defaultMessage: "Send Request",
    description:
      "Label of the button to start the activity claim GateKeeper Adopter credential",
  }),
  actionReExecuteLabel: defineMessage({
    id: "activities.claimGateKeperAdopter.actionReExecuteLabel",
    defaultMessage: "Re-send Request",
    description: "Label of the button to perform the activity again ",
  }),
  actionExecutingLabel: defineMessage({
    id: "activities.claimGateKeperAdopter.actionExecutingLabel",
    defaultMessage: "Sending Request",
    description:
      "Label of the button when the activity 'claim GateKeeper Adopter credential' is being executed",
  }),
  onInit: handleInit,
  onExecute: handleExecute,
  resources: [
    {
      label: defineMessage({
        id: "activities.claimGateKeperAdopter.resources.gatekeeperClaimPageUrl.label",
        defaultMessage: "GateKeeper claim page",
        description: "Label of the resource 'GateKeeper claim page'",
      }),
      url: "https://gatekeeper.software/claim?vcId=582636f6-a43d-46f8-9d7c-d50424e92d93",
    },
    {
      label: defineMessage({
        id: "activities.claimGateKeperAdopter.resources.userGuide.label",
        defaultMessage:
          "User Guide: How to claim a GateKeeper Adopter credential",
        description:
          "Label of the user guide resources to claim to the GK adopter credential",
      }),
      url: "https://community.verida.io/user-guides/how-to-claim-a-gatekeeper-adopter-credential",
    },
    {
      label: defineMessage({
        id: "activities.claimGateKeperAdopter.resources.announcementBlogPost.label",
        defaultMessage:
          "Blog: Verida Wallet andf GateKeeper Partnership Announcement",
        description: "Label of the gatekeeper blog post announcement",
      }),
      url: "https://news.verida.io/verida-wallet-and-gatekeeper-partnership-empowers-users-with-self-sovereign-storage-of-verifiable-d70fab3ef284",
    },
  ],
};
