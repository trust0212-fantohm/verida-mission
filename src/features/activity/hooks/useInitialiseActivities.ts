import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { type WebUser } from "@verida/web-helpers";
import { type MutableRefObject, useEffect, useRef, useState } from "react";
import { type DebouncedState } from "use-debounce";

import {
  Activity,
  ActivityOnUnmount,
  UserActivity,
} from "~/features/activity/types";

export function useInitialiseActivities(
  activities: Activity[],
  isQueriesReady: boolean,
  did: string | undefined,
  userActivities: UserActivity[] | undefined,
  webUserInstanceRef: MutableRefObject<WebUser>,
  saveActivity: DebouncedState<
    UseMutateAsyncFunction<void, unknown, UserActivity>
  >
) {
  const initExecutedForDid = useRef<string>("");
  const [onUnmountHandlers, setOnUnmountHandlers] = useState<
    ActivityOnUnmount[]
  >([]);

  useEffect(() => {
    // TODO: Handle change of account
    if (
      !isQueriesReady ||
      !did ||
      userActivities === undefined ||
      initExecutedForDid.current === did
    ) {
      return;
    }

    const initActivities = async () => {
      const results = await Promise.allSettled([
        ...activities
          .filter((activity) => {
            const userActivity = userActivities.find(
              (userActivity) => userActivity.id === activity.id
            );
            return (
              activity.enabled &&
              (userActivity === undefined ||
                userActivity?.status !== "completed")
              // TODO: Argue about filtering out the completed activities. We could give this responsibility to the 'onInit' function itself as it receives the userActivity as argument anyway. If we do this, the init could do something even though it's been already completed. Best example is the 'refer-friend' activity, which mean there is no way to handle a referral url if the activity has been completed already.
            );
          })
          .map((activity) => {
            const userActivity = userActivities.find(
              (userActivity) => userActivity.id === activity.id
            );
            return activity.onInit(
              webUserInstanceRef,
              userActivity || null,
              saveActivity
            );
          }),
      ]);

      const unmountHandlers = results
        .filter(
          (result): result is PromiseFulfilledResult<ActivityOnUnmount> =>
            result.status !== "rejected"
          // Errors are handled in the init handler
        )
        .map((result) => result.value);
      setOnUnmountHandlers(unmountHandlers);
    };

    void initActivities();
    initExecutedForDid.current = did;

    // Clean up activities by calling the unmount handlers
    // TODO: Handle change of account, where we may want to clean up as well but it would not be at unmount.
    return () => {
      void Promise.allSettled(onUnmountHandlers);
      // Errors are handled in the unmount handler
    };
  }, [
    activities,
    isQueriesReady,
    did,
    userActivities,
    webUserInstanceRef,
    saveActivity,
    onUnmountHandlers,
  ]);
}
