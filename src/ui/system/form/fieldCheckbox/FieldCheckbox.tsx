import clsx from "clsx";
import "./fieldCheckbox.scss";

interface FieldCheckboxProps {
  className?: string;
  label: string;
  labelDisplay?: boolean;
  htmlFor: string;
  defaultChecked?: boolean;
  error?: string;
}

export const FieldCheckbox = ({ className, label, labelDisplay = true, htmlFor, defaultChecked = false, error }: FieldCheckboxProps) => {
  return (
    <div
      className={clsx("field-checkbox", className, {
        "field-checkbox--error": !!error,
      })}
    >
      <input
        type="checkbox"
        className={clsx("field-checkbox__input", {
          "field-checkbox__input--error": !!error,
        })}
        id={htmlFor}
        name={htmlFor}
        defaultChecked={defaultChecked}
        aria-invalid={!!error}
        aria-describedby={error ? `${htmlFor}-error` : undefined}
      />
      <label
        className={clsx("field-checkbox__label", {
          "field-checkbox__label--hide": !labelDisplay,
        })}
        htmlFor={htmlFor}
      >
        {label}
      </label>

      {error && (
        <span id={`${htmlFor}-error`} className="field-checkbox__error">
          {error}
        </span>
      )}
    </div>
  );
};
