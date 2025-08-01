import type { MouseEventHandler, ReactNode } from "react";
import clsx from "clsx";
import "./button.scss";

type ButtonProps = {
  className?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

export const Button = (props: ButtonProps) => {
  return (
    <button className={clsx("button", props.className)} onClick={props.onClick}>
      {props.children}
    </button>
  );
};
