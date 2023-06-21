import { createContext, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useIntl } from "react-intl";

import { config } from "~/config";
import { activities } from "~/features/activity/activities";
import { useActivityQueries } from "~/features/activity/hooks";
import { missions } from "~/features/activity/missions";
import type {
  Activity,
  Mission,
  UserActivityRecord,
} from "~/features/activity/types";
import { capturePlausibleEvent } from "~/features/plausible";
import { Sentry } from "~/features/sentry";
import { useTermsConditions } from "~/features/termsconditions";
import { useVerida } from "~/features/verida";

type ActivityContextType = {
  activities: Activity[];
  missions: Mission[];
  userActivities: UserActivityRecord[];
  getUserActivity: (activityId: string) => UserActivityRecord | undefined;
  executeActivity: (activityId: string) => Promise<void>;
  deleteUserActivities: () => void;
};

export const ActivityContext = createContext<ActivityContextType | null>(null);

type ActivityProviderProps = {
  children?: React.ReactNode;
};

export const ActivityProvider: React.FunctionComponent<
  ActivityProviderProps
> = (props) => {
  // const initExecutedForDid = useRef<string>("");
  const i18n = useIntl();
  const { status: statusTermsConditions } = useTermsConditions();
  const { webUserInstanceRef } = useVerida();
  // const { isConnected, did, webUserInstanceRef } = useVerida();
  const {
    // isReady: isQueriesReady,
    userActivities,
    saveActivity,
    deleteActivities,
  } = useActivityQueries();

  // Initialise the activities
  // useEffect(() => {
  //   if (
  //     !isQueriesReady ||
  //     !did ||
  //     userActivities === undefined ||
  //     initExecutedForDid.current === did
  //   ) {
  //     return;
  //   }

  //   const initActivities = async () => {
  //     const results = await Promise.allSettled([
  //       // TODO: Filter the ones that are already completed
  //       activities.map((activity) => {
  //         console.debug("Activity init", activity.id);
  //         return activity.onInit(webUserInstanceRef, saveActivity);
  //       }),
  //     ]);

  //     results.forEach((result) => {
  //       if (result.status === "rejected") {
  //         // TODO: Handle error
  //       }
  //     });
  //   };
  //   void initActivities();

  //   initExecutedForDid.current = did;

  //   // Clean up activities by calling onUnmount
  //   return () => {
  //     const unmountActivities = async () => {
  //       const results = await Promise.allSettled([
  //         activities.map((activity) => {
  //           console.debug("Activity unmount", activity.id);
  //           return activity.onUnmount(webUserInstanceRef);
  //         }),
  //       ]);

  //       results.forEach((result) => {
  //         if (result.status === "rejected") {
  //           // TODO: Handle error
  //         }
  //       });
  //     };

  //     void unmountActivities();
  //   };
  // }, [isQueriesReady, did, userActivities, webUserInstanceRef, saveActivity]);

  const executeActivity = useCallback(
    async (activityId: string) => {
      Sentry.addBreadcrumb({
        category: "activity",
        level: "info",
        message: "Executing activity",
        data: {
          activityId,
        },
      });

      if (statusTermsConditions !== "accepted") {
        // Should be avoided by the UI but just in case
        const termsNotAcceptedNotificationMessage = i18n.formatMessage({
          id: "ActivityProvider.termsNotAcceptedNotificationMessage",
          defaultMessage: "Please accept the terms and conditions",
          description:
            "Notification message when user tries to execute an activity but the terms and conditions are not accepted",
        });
        toast.error(termsNotAcceptedNotificationMessage);
        Sentry.captureException(
          new Error("Trying to execute an activity without terms accepted"),
          {
            tags: {
              activityId,
            },
          }
        );
        return;
      }

      const activity = activities.find((a) => a.id === activityId);

      if (!activity) {
        // Unlikely but sill
        const activityNotFoundNotificationMessage = i18n.formatMessage({
          id: "ActivityProvider.activityNotFoundNotificationMessage",
          defaultMessage: "Activity not found",
          description:
            "Notification message when user tries to execute an activity but the activity is not found",
        });
        toast.error(activityNotFoundNotificationMessage);
        Sentry.captureException(
          new Error(
            "Trying to execute an activity with an id that cannot be found"
          ),
          {
            tags: {
              activityId,
            },
          }
        );
        return;
      }

      // Check existing status, if todo, continue, otherwise return or throw error
      const userActivity = userActivities?.find(
        (activity) => activity.id === activityId
      );

      if (userActivity && userActivity.status !== "todo") {
        // Should be avoided by the UI but just in case
        const activityAlreadyExecutedNotificationMessage = i18n.formatMessage({
          id: "ActivityProvider.activityAlreadyExecutedNotificationMessage",
          defaultMessage: "Activity already executed",
          description:
            "Notification message when user tries to execute an activity but the activity is already executed",
        });
        toast.success(activityAlreadyExecutedNotificationMessage);
        Sentry.captureException(
          new Error("Trying to execute an activity already executed"),
          {
            tags: {
              activityId,
            },
          }
        );
        return;
      }

      // Execute the action
      const result = await activity.onExecute(webUserInstanceRef);

      // Handle the result
      switch (result.status) {
        case "completed": {
          const activityExecutionCompletedNotificationMessage =
            i18n.formatMessage({
              id: "ActivityProvider.activityExecutionCompletedNotificationMessage",
              defaultMessage: "Congrats, you have completed the activity",
              description:
                "Notification message when user completes an activity",
            });
          toast.success(
            result.message
              ? i18n.formatMessage(result.message)
              : activityExecutionCompletedNotificationMessage
          );

          capturePlausibleEvent("Activity Completed", {
            activityId,
          });
          break;
        }
        case "todo": {
          const activityExecutionTodoNotificationMessage = i18n.formatMessage({
            id: "ActivityProvider.activityExecutionTodoNotificationMessage",
            defaultMessage: "Hmm, the activity was not completed properly",
            description:
              "Notification message when executing an activity reset back to its todo status",
          });
          toast.error(
            result.message
              ? i18n.formatMessage(result.message)
              : activityExecutionTodoNotificationMessage
          );
          break;
        }
        case "pending": {
          const activityExecutionPendingNotificationMessage =
            i18n.formatMessage({
              id: "ActivityProvider.activityExecutionPendingNotificationMessage",
              defaultMessage:
                "The activity is pending, check the next step in the instructions",
              description:
                "Notification message when after the execution, an activity is in pending state",
            });
          toast.success(
            result.message
              ? i18n.formatMessage(result.message)
              : activityExecutionPendingNotificationMessage,
            {
              icon: null,
            }
          );
          break;
        }
        default: {
          Sentry.captureException(
            new Error("Non supported status returned by activity.onExecute"),
            {
              tags: {
                activityId,
              },
            }
          );
        }
      }

      // Save the result
      saveActivity({
        id: activityId,
        status: result.status,
      });
    },
    [
      i18n,
      statusTermsConditions,
      userActivities,
      webUserInstanceRef,
      saveActivity,
    ]
  );

  const getUserActivity = useCallback(
    (activityId: string) => {
      return userActivities?.find((activity) => activity.id === activityId);
    },
    [userActivities]
  );

  const deleteUserActivities = useCallback(() => {
    // deleteActivities handles errors by itself
    deleteActivities();
  }, [deleteActivities]);

  const contextValue: ActivityContextType = useMemo(
    () => ({
      missions: missions.filter((m) => (config.devMode ? true : m.visible)),
      activities: activities,
      userActivities: userActivities || [],
      getUserActivity,
      executeActivity,
      deleteUserActivities,
    }),
    [userActivities, executeActivity, getUserActivity, deleteUserActivities]
  );

  return (
    <ActivityContext.Provider value={contextValue}>
      {props.children}
    </ActivityContext.Provider>
  );
};
