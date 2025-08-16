import type { MouseEventHandler, ReactNode } from "react";
import clsx from "clsx";
import "./button.scss";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  width?: "max-content" | "full";
};

export const Button = ({ children, className, onClick, type = "button", width = "max-content" }: ButtonProps) => {
  return (
    <button className={clsx("button", `button--${width}`, className)} onClick={onClick} type={type}>
      {children}
    </button>
  );
};
