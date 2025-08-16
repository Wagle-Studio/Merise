import clsx from "clsx";
import { type IconProps, IconSizeType } from "./IconTypes";
import "./icon.scss";

export const CheckedIcon = ({ className, size = IconSizeType.SMALL, ...props }: IconProps) => {
  return (
    <svg className={clsx("icon", `icon--${size}`, className)} {...props} viewBox="0 0 16 16">
      <path d="M14 0h-12c-1.1 0-2 0.9-2 2v12c0 1.1 0.9 2 2 2h12c1.1 0 2-0.9 2-2v-12c0-1.1-0.9-2-2-2zM7 12.414l-3.707-3.707 1.414-1.414 2.293 2.293 4.793-4.793 1.414 1.414-6.207 6.207z"></path>
    </svg>
  );
};
