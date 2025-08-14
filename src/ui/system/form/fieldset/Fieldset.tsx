import type { ReactNode } from "react";
import clsx from "clsx";
import "./fieldset.scss";

interface FieldsetProps {
  children: ReactNode;
  className?: string;
  variant?: "horizontal" | "vertical";
}

export const Fieldset = ({ children, variant = "vertical", className }: FieldsetProps) => {
  return <div className={clsx("form-fieldset", `form-fieldset--${variant}`, className)}>{children}</div>;
};
