import clsx from "clsx";
import "./fieldSelect.scss";

interface FieldSelectProps {
  className?: string;
  variant?: "horizontal" | "vertical";
  label: string;
  htmlFor: string;
  defaultValue: string;
  options: Record<"label" | "value", string>[];
}

export const FieldSelect = ({ className, variant = "vertical", label, htmlFor, defaultValue, options }: FieldSelectProps) => {
  return (
    <div className={clsx("field-select", `field-select--${variant}`, className)}>
      <label className="field-select__label" htmlFor={htmlFor}>
        {label}
      </label>
      <select className="field-select__field" id={htmlFor} name={htmlFor} defaultValue={defaultValue}>
        {options.map((option, index) => (
          <option key={`field-${htmlFor}-select-option-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
