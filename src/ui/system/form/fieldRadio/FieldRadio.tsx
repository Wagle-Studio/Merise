import type { ChangeEvent } from "react";
import clsx from "clsx";
import "./fieldRadio.scss";

interface FieldRadioProps {
  className?: string;
  variant?: "horizontal" | "vertical";
  label: string;
  labelDisplay?: boolean;
  htmlFor: string;
  defaultValue: string;
  options: Record<"label" | "value", string>[];
  error?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const FieldRadio = ({ className, variant = "vertical", label, labelDisplay = true, htmlFor, defaultValue, options, error, onChange }: FieldRadioProps) => {
  return (
    <div
      className={clsx("field-radio", `field-radio--${variant}`, className, {
        "field-radio--error": !!error,
      })}
    >
      <span
        className={clsx("field-radio__label", {
          "field-radio__label--hide": !labelDisplay,
        })}
      >
        {label}
      </span>
      <div className="field-radio__group">
        {options.map((option, index) => (
          <label key={`field-${htmlFor}-radio-option-${index}`} className="field-radio__option">
            <input
              type="radio"
              className={clsx("field-radio__input", {
                "field-radio__input--error": !!error,
              })}
              name={htmlFor}
              value={option.value}
              defaultChecked={defaultValue === option.value}
              onChange={(e) => {
                if (onChange) onChange(e);
              }}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && <span className="field-radio__error">{error}</span>}
    </div>
  );
};
