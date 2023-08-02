import { IMessaging } from "@verida/types";
import toast from "react-hot-toast";
import { defineMessage } from "react-intl";

import { MISSION_01_ID } from "~/features/activity/missions";
import type {
  Activity,
  ActivityOnExecute,
  ActivityOnInit,
} from "~/features/activity/types";
import { Logger } from "~/features/logger";
import { Sentry } from "~/features/sentry";
import { ReceivedMessage, getMessaging } from "~/features/verida";
import { wait } from "~/utils";

import { ACTIVITY_ID } from "./constants";
import {
  buildReferralUrl,
  checkAndHandleReferralInUrl,
  verifyReceivedMessage,
} from "./utils";

const logger = new Logger("activity");

const handleInit: ActivityOnInit = async (
  veridaWebUser,
  userActivity,
  saveActivity
) => {
  logger.info("Init activity", { activityId: ACTIVITY_ID });

  // Handle referral in URL
  await checkAndHandleReferralInUrl(veridaWebUser.current);

  const did = await veridaWebUser.current.getDid();

  const checkMessage = async (message: ReceivedMessage<unknown>) => {
    try {
      logger.info("Checking message", { activityId: ACTIVITY_ID });
      logger.debug("Checking message for referral", message);

      const verified = verifyReceivedMessage(message, did);
      if (!verified) {
        return false;
      }

      logger.info(
        "Received message matched and verified, updating activity now",
        { activityId: ACTIVITY_ID }
      );

      await saveActivity({
        id: ACTIVITY_ID,
        status: "completed",
        data: {
          // TODO: Save the referrer in the user activity, use the sentBy from the message
        },
      });

      toast.success(
        "Congrats, you have completed the activity 'Refer a fried to join Verida Missions'"
      );
      return true;
    } catch (error: unknown) {
      Sentry.captureException(error, {
        tags: {
          activityId: ACTIVITY_ID,
        },
      });
      return false;
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

    // Check existing messages for referral confirmation while the user was not connected.

    const messages = (await messaging.getMessages()) as
      | ReceivedMessage<unknown>[]
      | undefined;

    if (messages?.length) {
      logger.info("Checking existing messages", { activityId: ACTIVITY_ID });

      logger.debug("start iterating over messages");
      // Iterating over the messages and stopping on the first matching the condition to avoid saving the activity multiple times in case there are several valid messages
      messages.some(async (message) => {
        return await checkMessage(message);
      });
    } else {
      logger.info("No existing messages to check", { activityId: ACTIVITY_ID });
    }

    logger.info("Setting up incoming message listener", {
      activityId: ACTIVITY_ID,
    });

    // Listening to incoming messages and check them
    // BTW, pretty strange an onEvent function is async and return a promise
    // FIXME: Check why the listener is not trigger when a message is received
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
  // Wait a bit for UX purposes
  await wait(500);

  const did = await veridaWebUser.current.getDid();

  const url = buildReferralUrl(did);

  // TODO: Implement displaying the URL to the user, show in console for now
  logger.debug(url);

  return { status: "pending" };
};

export const activity: Activity = {
  id: ACTIVITY_ID,
  missionId: MISSION_01_ID,
  enabled: true,
  visible: true,
  order: 2,
  points: 50,
  title: defineMessage({
    id: "activities.referFriend.title",
    defaultMessage: "Refer a friend to join Verida Missions",
    description: "Title of the activity 'refer friend'",
  }),
  shortDescription: defineMessage({
    id: "activities.referFriend.shortDescription",
    defaultMessage: "Invite a friend to join Verida Missions.",
    description: "Short description of the activity 'refer friend'",
  }),
  longDescription: defineMessage({
    id: "activities.referFriend.longDescription",
    defaultMessage: "Invite a friend to join Verida Missions",
    description: "Long description of the activity 'refer friend'",
  }),
  actionLabel: defineMessage({
    id: "activities.referFriend.actionLabel",
    defaultMessage: "Get Referral Link",
    description: "Label of the button to start the activity refer friend",
  }),
  actionExecutingLabel: defineMessage({
    id: "activities.referFriend.actionExecutingLabel",
    defaultMessage: "Getting link",
    description:
      "Label of the button when the activity 'refer friend' is being executed",
  }),
  onInit: handleInit,
  onExecute: handleExecute,
};
