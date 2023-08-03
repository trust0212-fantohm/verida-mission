import React from "react";
import { useIntl } from "react-intl";

import { Typography } from "~/components/atoms";

export type HomeHeroProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "children"
>;

export const HomeHero: React.FunctionComponent<HomeHeroProps> = (props) => {
  const i18n = useIntl();

  const descriptionPart1 = i18n.formatMessage({
    id: "HomeHero.descriptionPart1",
    description:
      "Description (part 1) of the Verida incentivized testnet program",
    defaultMessage:
      "The purpose of Verida Missions incentivized testnet is to stress-test network infrastructure, Verida applications and prepare storage node operations for the Verida mainnet.",
  });

  const descriptionPart2 = i18n.formatMessage({
    id: "HomeHero.descriptionPart2",
    description:
      "Description (part 2) of the Verida incentivized testnet program",
    defaultMessage:
      "By undertaking the following activities, you'll play a vital role in preparing the Verida network for mainnet.",
  });

  const descriptionPart3 = i18n.formatMessage({
    id: "HomeHero.descriptionPart3",
    description:
      "Description (part 3) of the Verida incentivized testnet program",
    defaultMessage:
      "Are you ready to ignite your journey? The countdown to the Verida mainnet begins now!",
  });

  return (
    <div {...props}>
      <div className="flex flex-grow flex-col items-center justify-center text-center gap-2 text-muted-foreground px-0 sm:px-16">
        <Typography>{descriptionPart1}</Typography>
        <Typography>{descriptionPart2}</Typography>
        <Typography>{descriptionPart3}</Typography>
      </div>
    </div>
  );
};
