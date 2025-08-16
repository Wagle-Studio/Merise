// List of all available icon size enums
export enum IconSizeType {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

// Props required for every icons
export type IconProps = {
  className?: string;
  size?: IconSizeType;
};
