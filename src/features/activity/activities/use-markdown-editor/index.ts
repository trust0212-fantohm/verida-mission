import { defineMessage } from "react-intl";

import { MISSION_01_ID } from "~/features/activity/missions";
import type {
  Activity,
  ActivityOnExecute,
  ActivityOnInit,
} from "~/features/activity/types";
import { Sentry } from "~/features/sentry";
import { wait } from "~/utils";

const ACTIVITY_ID = "use-markdown-editor"; // Never change the id

const MARKDOWN_EDITOR_CONTEXT_NAME = "Verida: Markdown Notes Demo";

const handleInit: ActivityOnInit = () => {
  return Promise.resolve(() => Promise.resolve());
};

const handleExecute: ActivityOnExecute = async (veridaWebUser) => {
  // Wait a bit for UX purposes
  await wait(2000);

  try {
    const did = await veridaWebUser.current.getDid();
    const client = await veridaWebUser.current.getClient();
    const didDocument = await client.didClient.get(did);
    const contextProof = didDocument.locateContextProof(
      MARKDOWN_EDITOR_CONTEXT_NAME
    );

    if (contextProof) {
      return { status: "completed" };
    }

    const markdownEditorNotUsedErrorMessage = defineMessage({
      id: "activity.useMarkdownEditor.markdownEditorNotUsedErrorMessage",
      defaultMessage: `Looks like you haven't used the Markdown Editor demo app yet, please use it and check this activity again`,
      description:
        "Error message when the user haven't used the Markdown Editor yet.",
    });

    return {
      status: "todo",
      message: markdownEditorNotUsedErrorMessage,
    };
  } catch (error: unknown) {
    Sentry.captureException(error);
    const executionErrorMessage = defineMessage({
      id: "activity.useMarkdownEditor.executionErrorMessage",
      defaultMessage: `There was an error while checking this activity, please try again later`,
      description: "Error message when we are not able to check the activity",
    });

    return {
      status: "todo",
      message: executionErrorMessage,
    };
  }
};

export const activity: Activity = {
  id: ACTIVITY_ID,
  missionId: MISSION_01_ID,
  enabled: true,
  visible: true,
  order: 3,
  points: 50,
  title: defineMessage({
    id: "activities.useMarkdownEditor.title",
    defaultMessage: "Use the Markdown Editor demo app",

    description: "Title of the activity 'use markdown editor'",
  }),
  shortDescription: defineMessage({
    id: "activities.useMarkdownEditor.shortDescription",
    defaultMessage:
      "Connect to the Markdown Editor demo app (link in resources) and create a new note",
    description: "Short description of the activity 'use markdown editor'",
  }),
  actionLabel: defineMessage({
    id: "activities.useMarkdownEditor.actionLabel",
    defaultMessage: "Check",
    description:
      "Label of the button to start the activity use markdown editor",
  }),
  actionExecutingLabel: defineMessage({
    id: "activities.useMarkdownEditor.actionExecutingLabel",
    defaultMessage: "Checking",
    description:
      "Label of the button when the activity 'use markdown editor is being executed",
  }),
  resources: [
    {
      label: defineMessage({
        id: "activities.useMarkdownEditor.resources.markdownEditorDemoAppUrl.label",
        defaultMessage: "Markdown Editor demo app",
        description: "Label of the resource 'Markdown Editor demo app'",
      }),
      url: "https://markdown-editor.demos.testnet.verida.io/",
    },
    {
      label: defineMessage({
        id: "activities.useMarkdownEditor.resources.HowToUseTheMarkdownEditorDemoApp.label",
        defaultMessage: "How to use the Markdown Editor demo app",
        description:
          "Label of the resource 'How to use the Markdown Editor demo app'",
      }),
      url: "https://community.verida.io/user-guides/using-the-verida-markdown-editor-demo",
    },
    {
      label: defineMessage({
        id: "activities.useMarkdownEditor.resources.HowToUseTheMarkdownEditorDemoAppVideo.label",
        defaultMessage: "How to use the Markdown Editor demo app (video)",
        description:
          "Label of the resource 'How to use the Markdown Editor demo app (video)'",
      }),
      url: "https://youtu.be/su_03ZBzhig",
    },
  ],
  video: {
    label: defineMessage({
      id: "activities.useMarkdownEditor.video.label",
      defaultMessage: "How to use the Markdown Editor demo app",
      description:
        "Label of the video 'How to use the Markdown Editor demo app'",
    }),
    url: "https://youtu.be/su_03ZBzhig",
  },
  onInit: handleInit,
  onExecute: handleExecute,
};
