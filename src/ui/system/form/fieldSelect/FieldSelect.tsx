import clsx from "clsx";
import "./fieldSelect.scss";

interface FieldSelectProps {
  className?: string;
  variant?: "horizontal" | "vertical";
  label: string;
  htmlFor: string;
  defaultValue: string;
  options: Record<"label" | "value", string>[];
  error?: string;
}

export const FieldSelect = ({ className, variant = "vertical", label, htmlFor, defaultValue, options, error }: FieldSelectProps) => {
  return (
    <div
      className={clsx("field-select", `field-select--${variant}`, className, {
        "field-select--error": !!error,
      })}
    >
      <label className="field-select__label" htmlFor={htmlFor}>
        {label}
      </label>
      <select
        className={clsx("field-select__input", {
          "field-select__field--error": !!error,
        })}
        id={htmlFor}
        name={htmlFor}
        defaultValue={defaultValue}
      >
        {options.map((option, index) => (
          <option key={`field-${htmlFor}-select-option-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="field-select__error">{error}</span>}
    </div>
  );
};
