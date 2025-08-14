import type { MouseEventHandler, ReactNode } from "react";
import clsx from "clsx";
import "./button.scss";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
};

export const Button = ({ children, className, onClick, type = "button" }: ButtonProps) => {
  return (
    <button className={clsx("button", className)} onClick={onClick} type={type}>
      {children}
    </button>
  );
};
