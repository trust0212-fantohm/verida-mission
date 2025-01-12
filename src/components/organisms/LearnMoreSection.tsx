import React from "react";
import { useIntl } from "react-intl";

import { ExternalLink, Typography } from "~/components/atoms";
import { VERIDA_MISSIONS_FAQ_URL } from "~/constants";

type Link = {
  label: string;
  url: string;
};

const links: Link[] = [
  {
    label: "Verida Mainnet is Live!",
    url: "https://news.verida.io/verida-mainnet-is-launching-soon-e3b6cb95408c",
  },
  {
    label: "Verida Missions FAQs",
    url: VERIDA_MISSIONS_FAQ_URL,
  },
];

export const LearnMoreSection: React.FunctionComponent = () => {
  const i18n = useIntl();

  const sectionTitle = i18n.formatMessage({
    id: "LearnMoreSection.sectionTitle",
    defaultMessage: "Learn More",
    description: "Title of the 'Learn More' section",
  });

  return (
    <aside className="p-4 flex flex-col justify-center items-center gap-4">
      <Typography variant="heading-s" component="p">
        {sectionTitle}
      </Typography>
      <ul className="flex flex-col w-full text-center gap-3">
        {links.map((link) => (
          <li key={link.url}>
            <ExternalLink
              href={link.url}
              openInNewTab
              className="text-muted-foreground"
            >
              {link.label}
            </ExternalLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};
