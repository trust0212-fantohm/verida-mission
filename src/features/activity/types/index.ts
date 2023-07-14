import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { WebUser } from "@verida/web-helpers";
import { MutableRefObject } from "react";
import type { MessageDescriptor } from "react-intl";
import { z } from "zod";

import {
  UserActivityRecordSchema,
  UserActivitySchema,
} from "~/features/activity/schemas";

export type Resource = {
  label: MessageDescriptor;
  url: string;
};

// Mission

export type Mission = {
  id: string;
  idLabel: MessageDescriptor;
  enabled: boolean;
  visible: boolean;
  order: number;
  title: MessageDescriptor;
  shortDescription: MessageDescriptor;
  longDescription?: MessageDescriptor;
};

// Activity

export type ActivityOnUnmount = () => Promise<void>;

export type ActivityOnInit = (
  veridaWebUser: MutableRefObject<WebUser>,
  userActivity: UserActivity | null,
  saveActivity: UseMutateAsyncFunction<void, unknown, UserActivity>
) => Promise<ActivityOnUnmount>;

export type ActivityOnExecute = (
  veridaWebUser: MutableRefObject<WebUser>
) => Promise<ActivityOnExecuteResult>;

export type ActivityOnExecuteResult = {
  status: UserActivityStatus;
  message?: MessageDescriptor;
  data?: {
    requestId?: string;
  };
};

export type Activity = {
  id: string;
  missionId: string;
  enabled: boolean;
  visible: boolean;
  order: number;
  points: number;
  title: MessageDescriptor;
  shortDescription: MessageDescriptor;
  longDescription: MessageDescriptor;
  instructions?: MessageDescriptor[];
  resources?: Resource[];
  video?: Resource;
  footnote?: MessageDescriptor;
  actionLabel: MessageDescriptor;
  actionReExecuteLabel?: MessageDescriptor;
  actionExecutingLabel: MessageDescriptor;
  onInit: ActivityOnInit;
  onExecute: ActivityOnExecute;
};

// User activity

export type UserActivity = z.infer<typeof UserActivitySchema>;

export type UserActivityRecord = z.infer<typeof UserActivityRecordSchema>;

export type UserActivityStatus = "todo" | "pending" | "completed";
