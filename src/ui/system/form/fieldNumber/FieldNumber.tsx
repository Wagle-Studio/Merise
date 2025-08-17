import type { ChangeEvent } from "react";
import clsx from "clsx";
import "./fieldNumber.scss";

interface FieldNumberProps {
  className?: string;
  variant?: "horizontal" | "vertical";
  label: string;
  labelDisplay?: boolean;
  htmlFor: string;
  defaultValue: string;
  placeholder?: string;
  error?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const FieldNumber = ({ className, variant = "vertical", label, labelDisplay = true, htmlFor, defaultValue, placeholder, error, onChange, disabled = false }: FieldNumberProps) => {
  return (
    <div
      className={clsx("field-number", `field-number--${variant}`, className, {
        "field-number--error": !!error,
      })}
    >
      <label className={clsx("field-number__label", { "field-number__label--hide": !labelDisplay })} htmlFor={htmlFor}>
        {label}
      </label>
      <input
        type="number"
        className={clsx("field-number__input", {
          "field-number__input--error": !!error,
        })}
        id={htmlFor}
        name={htmlFor}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={(e) => {
          if (onChange) onChange(e);
        }}
        disabled={disabled}
      />
      {error && <span className="field-number__error">{error}</span>}
    </div>
  );
};
