import clsx from "clsx";
import "./fieldText.scss";

interface FieldTextProps {
  className?: string;
  variant?: "horizontal" | "vertical";
  label: string;
  htmlFor: string;
  defaultValue: string;
  placeholder?: string;
  error?: string;
}

export const FieldText = ({ className, variant = "vertical", label, htmlFor, defaultValue, placeholder, error }: FieldTextProps) => {
  return (
    <div
      className={clsx("field-text", `field-text--${variant}`, className, {
        "field-text--error": !!error,
      })}
    >
      <label className="field-text__label" htmlFor={htmlFor}>
        {label}
      </label>
      <input
        type="text"
        className={clsx("field-text__input", {
          "field-text__field--error": !!error,
        })}
        id={htmlFor}
        name={htmlFor}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
      {error && <span className="field-text__error">{error}</span>}
    </div>
  );
};
