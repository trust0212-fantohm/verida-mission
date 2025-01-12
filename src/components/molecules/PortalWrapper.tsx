import React from "react";
import { createPortal } from "react-dom";

export type PortalWrapperProps = {
  children: React.ReactNode;
};

export const PortalWrapper: React.FunctionComponent<PortalWrapperProps> = ({
  children,
}) => {
  return createPortal(children, document.body);
};
