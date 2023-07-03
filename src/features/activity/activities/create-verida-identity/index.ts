import { defineMessage } from "react-intl";

import { MISSION_01_ID } from "~/features/activity/missions";
import type {
  Activity,
  ActivityOnExecute,
  ActivityOnInit,
  ActivityOnUnmount,
} from "~/features/activity/types";
import { wait } from "~/utils";

const ACTIVITY_ID = "create-verida-identity"; // Never change the id

const handleInit: ActivityOnInit = async (veridaWebUser, saveActivity) => {
  // TODO: Uncomment this code when we have more activities
  // const { status } = await handleExecute(veridaWebUser);
  // saveActivity({ id: ACTIVITY_ID, status });
  return Promise.resolve();
};

const handleExecute: ActivityOnExecute = async (veridaWebUser) => {
  // Wait a bit for UX purposes
  await wait(2000);
  const isConnected = await veridaWebUser.current.isConnected();
  if (isConnected) {
    return { status: "completed" };
  }
  // Wait a bit for UX purposes or the user will think nothing happened
  await wait(2000);
  return { status: "todo" };
};

const handleUnmount: ActivityOnUnmount = async (_veridaWebUser) => {
  // Nothing to do
  return Promise.resolve();
};

export const activity: Activity = {
  id: ACTIVITY_ID,
  missionId: MISSION_01_ID,
  enabled: true,
  visible: true,
  order: 1,
  points: 50,
  title: defineMessage({
    id: "activities.createVeridaIdentity.title",
    defaultMessage: "Create a Verida Identity",
    description: "Title of the activity 'create identity'",
  }),
  shortDescription: defineMessage({
    id: "activities.createVeridaIdentity.shortDescription",
    defaultMessage:
      "Download the Verida Wallet, create an identity and connect to this webapp",
    description: "Short description of the activity 'create identity'",
  }),
  actionLabel: defineMessage({
    id: "activities.createVeridaIdentity.actionLabel",
    defaultMessage: "Verify",
    description: "Label of the button to start the activity create identity",
  }),
  actionExecutingLabel: defineMessage({
    id: "activities.createVeridaIdentity.actionExecutingLabel",
    defaultMessage: "Verifying",
    description:
      "Label of the button when the activity 'create Verida Identity' is being executed",
  }),
  resources: [
    {
      label: defineMessage({
        id: "activities.createVeridaIdentity.resources.howToCreateVeridaIdentity.label",
        defaultMessage: "How to create a Verida Identity",
        description: "Label of the resource 'How to create a Verida Identity'",
      }),
      url: "https://community.verida.io/user-guides/create-a-verida-identity-guide",
    },
  ],
  video: {
    label: defineMessage({
      id: "activities.createVeridaIdentity.video.label",
      defaultMessage: "How to create a Verida Identity",
      description: "Label of the video 'How to create a Verida Identity'",
    }),
    url: "https://www.youtube.com/watch?v=Iav2TRzBiIs",
  },
  onInit: handleInit,
  onExecute: handleExecute,
  onUnmount: handleUnmount,
};
