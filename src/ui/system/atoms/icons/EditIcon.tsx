import clsx from "clsx";
import { type IconProps } from "./IconTypes";
import "./icon.scss";

export const EditIcon = ({ className, size = "small", ...props }: IconProps) => {
  return (
    <svg className={clsx("icon", `icon--${size}`, className)} {...props} viewBox="0 0 24 24">
      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z"></path>
    </svg>
  );
};
