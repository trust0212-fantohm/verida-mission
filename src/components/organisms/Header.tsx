import React, { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { twJoin } from "tailwind-merge";

import { ReactComponent as VeridaNetworkLogo } from "~/assets/images/verida_network_logo.svg";
import { ReactComponent as VeridaNetworkLogoWithText } from "~/assets/images/verida_network_logo_with_text.svg";
import { Chip, Icon } from "~/components/atoms";
import type { MenuItem } from "~/components/molecules";
import { AvatarWithInfo, HeaderMenu } from "~/components/molecules";
import { ConnectVeridaButton } from "~/components/organisms/ConnectVeridaButton";
import { config } from "~/config";
import { useActivity } from "~/features/activity";
import { useTermsConditions } from "~/features/termsconditions";
import { useVerida } from "~/features/verida";

type HeaderProps = React.ComponentPropsWithoutRef<"header">;

export const Header: React.FunctionComponent<HeaderProps> = (props) => {
  const { ...headerProps } = props;

  const i18n = useIntl();
  const [openMenu, setOpenMenu] = useState(false);
  const { disconnect, isConnected, profile, did } = useVerida();
  const { deleteTermsStatus } = useTermsConditions();
  const { deleteUserActivities, userXpPoints, isLoadingUserActivities } =
    useActivity();

  const handleOpenMenu = useCallback(() => {
    setOpenMenu(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const handleDisconnect = useCallback(() => {
    handleCloseMenu();
    void disconnect();
  }, [handleCloseMenu, disconnect]);

  const homeLinkAriaLabel = i18n.formatMessage({
    id: "Header.homeLinkAriaLabel",
    description: "Aria label for the home link in the Header",
    defaultMessage: "Return to Home page",
  });

  const xpPointsChipLabel = i18n.formatMessage(
    {
      id: "ActivityCard.xpPointsChipLabel",
      description: "Label of the XP points chip on each activity card",
      defaultMessage: "{points} XP",
    },
    { points: userXpPoints }
  );

  const contentHeight = "h-10";

  const devModeMenuItems: MenuItem[] = config.devMode
    ? [
        {
          label: "Delete Terms",
          action: deleteTermsStatus,
        },
        {
          label: "Delete User Activities",
          action: deleteUserActivities,
        },
      ]
    : [];

  const menuItems: MenuItem[] = [
    {
      label: "Disconnect",
      action: handleDisconnect,
    },
    ...devModeMenuItems,
  ];

  return (
    <header {...headerProps}>
      <div className="flex flex-row justify-between border-b border-solid border-divider bg-translucent px-4 pt-3 pb-[calc(0.75rem_-_1px)] backdrop-blur-[15px] sm:px-6">
        <div className="justify-self-start">
          <Link to="/" aria-label={homeLinkAriaLabel}>
            <div
              className={twJoin("aspect-[10/6.97] sm:hidden", contentHeight)}
            >
              <VeridaNetworkLogo height="100%" width="100%" />
            </div>
            <div
              className={twJoin("hidden aspect-[10/3] sm:block", contentHeight)}
            >
              <VeridaNetworkLogoWithText height="100%" width="100%" />
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-between justify-self-end gap-2 md:gap-4">
          {isConnected ? (
            <>
              <Chip variant="primary">
                {isLoadingUserActivities ? (
                  // FIXME: Icon doesn't spin
                  <Icon type="loading" className="animate-spin-slow" />
                ) : (
                  xpPointsChipLabel
                )}
              </Chip>
              <button
                className="-mr-4 sm:-mr-6 text-start"
                onClick={handleOpenMenu}
              >
                <AvatarWithInfo
                  did={did}
                  image={profile?.avatarUri}
                  name={profile?.name}
                  className={twJoin("max-w-[220px]", contentHeight)}
                />
              </button>
              <HeaderMenu
                open={openMenu}
                onClose={handleCloseMenu}
                items={menuItems}
              />
            </>
          ) : (
            <ConnectVeridaButton />
          )}
        </div>
      </div>
    </header>
  );
};

/** Offset for the heigh of the Header */
export const HeaderOffset: React.FunctionComponent = () => {
  return <div className="h-16 w-full" />;
};
