import type { ReactNode } from "react";
import clsx from "clsx";
import "./fieldset.scss";

interface FieldsetProps {
  children: ReactNode;
  className?: string;
  variant?: "horizontal" | "vertical";
  legend?: string;
}

export const Fieldset = ({ children, variant = "vertical", className, legend }: FieldsetProps) => {
  return (
    <fieldset className={clsx("form-fieldset", `form-fieldset--${variant}`, className)}>
      {legend && <legend>{legend}</legend>}
      {children}
    </fieldset>
  );
};
