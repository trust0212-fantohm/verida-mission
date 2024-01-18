import { VariantProps, cva } from "class-variance-authority";
import React from "react";

import { Button, Typography } from "~/components/atoms";

const alertVariants = cva(
  "flex flex-row justify-between items-center rounded-2xl p-4 gap-4 border border-solid",
  {
    variants: {
      type: {
        error: "bg-error-background text-error border-error/20",
        warning: "bg-warning-background text-warning border-warning/20",
        info: "bg-primary-background text-primary border-primary/20",
        success: "bg-success-background text-success border-success/20",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
);

export type AlertVariants = VariantProps<typeof alertVariants>;

export type AlertProps = AlertVariants & {
  message: string;
  actionLabel?: string;
  action?: () => void;
} & Omit<React.ComponentPropsWithRef<"div">, "children">;

export const Alert: React.FunctionComponent<AlertProps> = (props) => {
  const { type, message, actionLabel, action, ...divProps } = props;

  const classes = alertVariants({ type });

  return (
    <div {...divProps}>
      <div className={classes}>
        <Typography>{message}</Typography>
        {action && actionLabel ? (
          <Button
            onClick={action}
            color={type === "info" ? "primary" : "default"}
            className="whitespace-nowrap"
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
};
