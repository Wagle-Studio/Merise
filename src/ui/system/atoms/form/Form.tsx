import type { ReactNode } from "react";
import clsx from "clsx";
import "./form.scss";

interface FormProps {
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export const Form = ({ children, className, actions }: FormProps) => {
  return (
    <div className={clsx("form", className)}>
      {children}
      {actions && <div className="form__actions">{actions}</div>}
    </div>
  );
};
