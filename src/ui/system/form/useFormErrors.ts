import { useState } from "react";
import type { ZodError } from "zod";

export const useFormErrors = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const setZodErrors = (zodError: ZodError) => {
    const errors: Record<string, string> = {};
    zodError.issues.forEach((issue) => {
      const fieldName = issue.path[0] as string;
      errors[fieldName] = issue.message;
    });
    setFieldErrors(errors);
  };

  const clearErrors = () => setFieldErrors({});

  return {
    fieldErrors,
    setZodErrors,
    clearErrors,
    hasErrors: Object.keys(fieldErrors).length > 0,
  };
};
