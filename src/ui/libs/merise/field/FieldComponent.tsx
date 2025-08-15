import type { MeriseFieldInterface } from "@/libs/merise";
import "./field.scss";

interface FieldComponentProps {
  field: MeriseFieldInterface;
}

export const FieldComponent = ({ field }: FieldComponentProps) => {
  return <div className="field">{field.getName()}</div>;
};
