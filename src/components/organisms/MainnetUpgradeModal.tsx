/* eslint-disable formatjs/no-literal-string-in-jsx */
import { EnvironmentType } from "@verida/types";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { ExternalLink, Typography } from "~/components/atoms";
import { Modal } from "~/components/molecules";
import { config } from "~/config";
import { VERIDA_MISSIONS_FAQ_URL } from "~/constants";
import { MAINNET_UPGRADE_HIDE_MODAL_LOCAL_STORAGE_KEY } from "~/features/mainnetUpgrade";

export const MainnetUpgradeModal: React.FunctionComponent = () => {
  const [open, setOpen] = useState(false);

  const i18n = useIntl();

  const handleClose = useCallback(() => {
    localStorage.setItem(MAINNET_UPGRADE_HIDE_MODAL_LOCAL_STORAGE_KEY, "true");
    setOpen(false);
  }, []);

  useEffect(() => {
    const hideModal = localStorage.getItem(
      MAINNET_UPGRADE_HIDE_MODAL_LOCAL_STORAGE_KEY
    );
    if (
      config.verida.environment !== EnvironmentType.MAINNET ||
      (hideModal && hideModal === "true")
    ) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, []);

  const modalTitle = i18n.formatMessage({
    id: "MainnetUpgradeModal.modalTitle",
    defaultMessage: "Verida Missions has launched on Mainnet",
    description: "Title for the mainnet upgrade modal",
  });

  const existingUserTitle = i18n.formatMessage({
    id: "MainnetUpgradeModal.existingUserTitle",
    defaultMessage: "Testnet users: Make the move to Mainnet!",
    description:
      "Title for existing users paragraph in the mainnet upgrade modal",
  });

  const existingUserMessage = i18n.formatMessage(
    {
      id: "MainnetUpgradeModal.existingUserMessage",
      defaultMessage: `Verida Missions is now using the Verida Mainnet. Update your Verida Wallet to start the process for migrating your Verida Identity to Mainnet, and ensure your completed activities and XP points are transferred.`,
      description: "Message for existing users in the mainnet upgrade modal",
    },
    {
      newline: (
        <>
          <br />
        </>
      ),
    }
  );

  const faqLinkLabel = i18n.formatMessage({
    id: "MainnetUpgradeModal.faqLinkLabel",
    defaultMessage: "Learn more in the FAQs",
    description: "Label for the faq link in the mainnet upgrade modal",
  });

  const closeButtonLabel = i18n.formatMessage({
    id: "MainnetUpgradeModal.closeButtonLabel",
    defaultMessage: "Start Exploring",
    description: "Label for the close button in the mainnet upgrade modal",
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={modalTitle}
      actions={[
        {
          label: closeButtonLabel,
          onClick: handleClose,
          variant: "contained",
          color: "primary",
        },
      ]}
    >
      <div>
        <Typography variant="heading-s" component="h3" className="mt-6 mb-2">
          {existingUserTitle}
        </Typography>
        <Typography>{existingUserMessage}</Typography>
      </div>
      <div className="mt-6 flex flex-col">
        <ExternalLink href={VERIDA_MISSIONS_FAQ_URL}>
          {faqLinkLabel}
        </ExternalLink>
      </div>
    </Modal>
  );
};
