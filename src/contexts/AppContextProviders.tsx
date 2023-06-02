import React from "react";
import { HelmetProvider } from "react-helmet-async";

import { ActivityProvider } from "~/features/activity";
import { IntlProvider } from "~/features/i18n";
import { TermsConditionsProvider } from "~/features/termsconditions";
import { VeridaProvider } from "~/features/verida";

import { QueryProvider } from "./QueryContext";

type AppContextProvidersProps = {
  children: React.ReactNode;
};

export const AppContextProviders: React.FunctionComponent<
  AppContextProvidersProps
> = (props) => {
  return (
    <QueryProvider>
      <IntlProvider>
        <VeridaProvider>
          <TermsConditionsProvider>
            <ActivityProvider>
              <HelmetProvider>{props.children}</HelmetProvider>
            </ActivityProvider>
          </TermsConditionsProvider>
        </VeridaProvider>
      </IntlProvider>
    </QueryProvider>
  );
};
