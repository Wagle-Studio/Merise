import clsx from "clsx";
import { type IconProps } from "./IconTypes";
import "./icon.scss";

export const AddIcon = ({ className, size = "small", ...props }: IconProps) => {
  return (
    <svg className={clsx("icon", `icon--${size}`, className)} {...props} viewBox="0 0 24 24">
      <path strokeWidth="3.25" d="M12,22 L12,2 M2,12 L22,12"></path>
    </svg>
  );
};
