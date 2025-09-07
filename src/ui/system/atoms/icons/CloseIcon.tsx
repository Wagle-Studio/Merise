import clsx from "clsx";
import { type IconProps } from "./IconTypes";
import "./icon.scss";

export const CloseIcon = ({ className, size = "small", ...props }: IconProps) => {
  return (
    <svg className={clsx("icon", `icon--${size}`, className)} {...props} viewBox="0 0 16 16">
      <path strokeWidth={0.5} d="M7.116 8l-4.558 4.558.884.884L8 8.884l4.558 4.558.884-.884L8.884 8l4.558-4.558-.884-.884L8 7.116 3.442 2.558l-.884.884L7.116 8z"></path>
    </svg>
  );
};
