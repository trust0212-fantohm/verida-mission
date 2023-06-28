import { EnvironmentType } from "@verida/types";

import { VERIDA_CONTEXT_NAME } from "~/constants";

import { version } from "./version";

const devMode = process.env.REACT_APP_DEV_MODE === "true" ? true : false;

// Verida variables
const veridaContextName = VERIDA_CONTEXT_NAME;

const veridaConnectLogoUrl = `${window.location.origin}/images/logo_for_verida_connect.png`;

const veridaEnvironment: EnvironmentType =
  process.env.REACT_APP_VERIDA_ENV === "local"
    ? EnvironmentType.LOCAL
    : process.env.REACT_APP_VERIDA_ENV === "mainnet"
    ? EnvironmentType.MAINNET
    : EnvironmentType.TESTNET;

export const config = {
  appVersion: version,
  devMode,
  verida: {
    environment: veridaEnvironment,
    contextName: veridaContextName,
    connectLogoUrl: veridaConnectLogoUrl,
  },
  sentry: {
    enabled: process.env.REACT_APP_SENTRY_ENABLED === "false" ? false : true,
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
    // release: `${APP_PACKAGE_NAME}@${version}`, // TODO: Enable when release properly created on Sentry
    release: version,
    tracesSampleRate: Number(
      process.env.REACT_APP_SENTRY_TRACE_SAMPLE_RATE || 0.1
    ),
    replaysSessionSampleRate: Number(
      process.env.REACT_APP_SENTRY_REPLAY_SESSION_SAMPLE_RATE || 0.1
    ),
    replaysOnErrorSampleRate: Number(
      process.env.REACT_APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE || 1.0
    ),
  },
};
