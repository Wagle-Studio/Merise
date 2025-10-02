import type { ReactNode } from "react";
import clsx from "clsx";
import "./tag.scss";

type TagProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "info" | "success" | "warning" | "danger" | "outline";
  size?: "small" | "medium" | "large";
  title?: string;
};

export const Tag = ({ children, className, variant = "default", size = "medium", title }: TagProps) => {
  return (
    <span className={clsx("tag", `tag--${variant}`, `tag--${size}`, className)} title={title}>
      <span className="tag__label">{children}</span>
    </span>
  );
};
