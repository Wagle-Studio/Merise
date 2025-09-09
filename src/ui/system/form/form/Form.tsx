import type { FormEvent, ReactNode } from "react";
import clsx from "clsx";
import "./form.scss";

interface FormProps {
  children: ReactNode;
  id?: string;
  className?: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  actions?: ReactNode;
  error: boolean;
}

export const Form = ({ children, id, className, onSubmit, actions, error }: FormProps) => {
  return (
    <form id={id} onSubmit={onSubmit} className={clsx("form", { "form--error": error }, className)}>
      {children}
      {actions && <div className="form__actions">{actions}</div>}
    </form>
  );
};
