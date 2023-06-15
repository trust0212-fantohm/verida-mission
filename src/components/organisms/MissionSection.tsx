import React from "react";
import { useIntl } from "react-intl";

import { UpcomingActivitiesCTA } from "~/components/molecules";
import { ActivityCard } from "~/components/organisms";
import { config } from "~/config";
import type { Mission } from "~/features/activity";
import { useActivity } from "~/features/activity";

type MissionSectionProps = {
  mission: Mission;
} & React.ComponentPropsWithoutRef<"article">;

export const MissionSection: React.FunctionComponent<MissionSectionProps> = (
  props
) => {
  const { mission, ...articleProps } = props;

  const i18n = useIntl();
  const { activities: allActivities, getUserActivity } = useActivity();

  const activitiesSectionTitle = i18n.formatMessage({
    id: "MissionSection.activitiesSectionTitle",
    defaultMessage: "Activities:",
    description: "Title for the activities section",
  });

  const comingSoonMessage = i18n.formatMessage({
    id: "MissionSection.comingSoonMessage",
    defaultMessage: "Coming Soon",
    description: "Message to display when a mission is not yet available",
  });

  const missionActivities = allActivities.filter(
    (activity) => activity.missionId === mission.id
  );

  const displayedActivities = missionActivities.filter((a) =>
    config.devMode ? true : a.visible
  );

  const hasUpcomingActivities =
    missionActivities.length > displayedActivities.length;

  const isMissionComingSoon =
    !mission.enabled || displayedActivities.length === 0;

  return (
    <article {...articleProps}>
      {isMissionComingSoon ? (
        <div className="p-2.5 rounded-xl border border-solid border-gray-dark font-medium mb-2 w-fit">
          {comingSoonMessage}
        </div>
      ) : null}
      <div className={isMissionComingSoon ? "opacity-90" : undefined}>
        <h2 className="text-2xl font-bold">
          {i18n.formatMessage(mission.title)}
        </h2>
        <p className="mt-2 text-gray-500">
          {i18n.formatMessage(mission.shortDescription)}
        </p>
      </div>
      {isMissionComingSoon ? null : (
        <div>
          <h3 className="mt-8 text-primary/80 text-lg font-semibold">
            {activitiesSectionTitle}
          </h3>
          <ul className="flex flex-col w-full gap-4 mt-4">
            {displayedActivities.map((activity, index) => (
              <li key={activity.id}>
                <ActivityCard
                  index={index + 1} // So that the first activity is 1 instead of 0
                  activity={activity}
                  status={getUserActivity(activity.id)?.status || "todo"}
                />
              </li>
            ))}
          </ul>
          {hasUpcomingActivities ? (
            <UpcomingActivitiesCTA className="mt-4" />
          ) : null}
        </div>
      )}
    </article>
  );
};
