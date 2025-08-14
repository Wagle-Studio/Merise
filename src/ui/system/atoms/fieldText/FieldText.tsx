import clsx from "clsx";
import "./fieldText.scss";

interface FieldTextProps {
  className?: string;
  variant?: "horizontal" | "vertical";
  label: string;
  htmlFor: string;
  defaultValue: string;
  placeholder?: string;
}

export const FieldText = ({ className, variant = "vertical", label, htmlFor, defaultValue, placeholder }: FieldTextProps) => {
  return (
    <div className={clsx("field-text", `field-text--${variant}`, className)}>
      <label className="field-text__label" htmlFor={htmlFor}>
        {label}
      </label>
      <input type="text" className="field-text__field" id={htmlFor} name={htmlFor} defaultValue={defaultValue} placeholder={placeholder} />
    </div>
  );
};
