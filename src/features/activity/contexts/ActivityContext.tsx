import { createContext, useCallback, useMemo } from "react";

import { config } from "~/config";
import { activities } from "~/features/activity/activities";
import {
  useActivityQueries,
  useExecuteActivity,
} from "~/features/activity/hooks";
import { missions } from "~/features/activity/missions";
import type {
  Activity,
  Mission,
  UserActivityRecord,
} from "~/features/activity/types";

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
  // const { isConnected, did, webUserInstanceRef } = useVerida();
  const {
    // isReady: isQueriesReady,
    userActivities,
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

  const { executeActivity } = useExecuteActivity(activities);

  const getUserActivity = useCallback(
    (activityId: string) => {
      return userActivities?.find((activity) => activity.id === activityId);
    },
    [userActivities]
  );

  const deleteUserActivities = useCallback(async () => {
    // deleteActivities handles errors by itself
    await deleteActivities();
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
