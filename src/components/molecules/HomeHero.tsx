import React from "react";
import { useIntl } from "react-intl";

type HomeHeroProps = Omit<React.ComponentPropsWithoutRef<"div">, "children">;

export const HomeHero: React.FunctionComponent<HomeHeroProps> = (props) => {
  const i18n = useIntl();

  const title = i18n.formatMessage({
    id: "HomeHero.title",
    description: "Message stating that the app will be available soon",
    defaultMessage: "Incentivized Testnet",
  });
  const subtitle = i18n.formatMessage({
    id: "HomeHero.subtitle",
    description: "Message stating that the app will be available soon",
    defaultMessage: "Participate, learn, test and get rewarded",
  });
  const description = i18n.formatMessage({
    id: "HomeHero.description",
    description: "Message stating that the app will be available soon",
    defaultMessage:
      "The purpose of the Verida incentivized testnet is to stress-test network infrastructure and prepare storage node operations for mainnet. The program covers security, tooling, and UX testing across the Verida network and ecosystem of apps. Users will be rewarded VDA for participating in the testing process.",
  });

  return (
    <div {...props}>
      <div className="flex flex-grow flex-col items-center justify-center space-y-12">
        <h1 className="text-3xl md:text-5xl">{title}</h1>
        <p className="text-2xl md:text-3xl">{subtitle}</p>
        <p className="text-sm text-primary/70">{description}</p>
      </div>
    </div>
  );
};
