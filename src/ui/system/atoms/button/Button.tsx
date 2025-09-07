import type { MouseEventHandler, ReactNode } from "react";
import clsx from "clsx";
import "./button.scss";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "ghost";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  width?: "max-content" | "full";
  disabled?: boolean;
  title?: string;
};

export const Button = ({ children, className, variant = "default", onClick, type = "button", width = "max-content", disabled = false, title }: ButtonProps) => {
  return (
    <button className={clsx("button", `button--${width}`, `button--${variant}`, { "button--disabled": disabled }, className)} onClick={onClick} type={type} disabled={disabled} title={title}>
      {children}
    </button>
  );
};
