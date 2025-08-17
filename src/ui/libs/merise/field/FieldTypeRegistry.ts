import type { ReactNode } from "react";
import type { FieldTypeDateOption, FieldTypeNumberOption, FieldTypeOtherOption, MeriseFieldInterface, MeriseFieldTypeOption } from "@/libs/merise";
import { FieldTypeDateOptionEnum, FieldTypeNumberOptionEnum, FieldTypeOtherOptionEnum, FieldTypeTextOptionsEnum, MeriseFieldTypeTypeEnum } from "@/libs/merise";
import { FieldTypeDateFormComponent } from "./fieldTypes/FieldTypeDateForm";
import { FieldTypeNumberFormComponent } from "./fieldTypes/FieldTypeNumberForm";
import { FieldTypeOtherFormComponent } from "./fieldTypes/FieldTypeOtherForm";
import { FieldTypeTextFormComponent } from "./fieldTypes/FieldTypeTextForm";

export type TextOptionValue = { variant: FieldTypeTextOptionsEnum; maxLength?: number };
export type NumberOptionValue = { variant: FieldTypeNumberOption };
export type DateOptionValue = { variant: FieldTypeDateOption };
export type OtherOptionValue = { variant: FieldTypeOtherOption };

export type FieldOptionUnion = TextOptionValue | NumberOptionValue | DateOptionValue | OtherOptionValue;

export type FieldConfig = {
  type: MeriseFieldTypeTypeEnum;
  options: FieldOptionUnion;
};

type OptionFormProps<T extends FieldOptionUnion> = {
  value: T;
  onChange: (next: T) => void;
};

type RegistryEntry<T extends FieldOptionUnion> = {
  label: string;
  defaultOption: T;
  OptionForm: (props: OptionFormProps<T>) => ReactNode;
  normalize: (raw: unknown) => T;
  format: (opt: T) => string;
};

export const fieldTypeRegistry: Record<MeriseFieldTypeTypeEnum, RegistryEntry<any>> = {
  [MeriseFieldTypeTypeEnum.TEXT]: {
    label: "Texte",
    defaultOption: { variant: FieldTypeTextOptionsEnum.VARIABLE, maxLength: 50 },
    OptionForm: FieldTypeTextFormComponent,
    normalize: (raw: unknown) => {
      if (raw && typeof raw === "object" && "variant" in (raw as any)) {
        const v = (raw as any).variant as FieldTypeTextOptionsEnum;
        const len = (raw as any).maxLength;
        return { variant: v, maxLength: typeof len === "number" ? len : 50 };
      }
      if (typeof raw === "string") {
        return { variant: raw as FieldTypeTextOptionsEnum, maxLength: 50 };
      }
      return { variant: FieldTypeTextOptionsEnum.VARIABLE, maxLength: 50 };
    },
    format: (opt) => {
      if (opt.variant === FieldTypeTextOptionsEnum.LONG) return "Volumineux";
      const len = typeof opt.maxLength === "number" ? ` ${opt.maxLength}` : "";
      return opt.variant === FieldTypeTextOptionsEnum.FIXED ? `Fixe${len}` : `Variable${len}`;
    },
  },
  [MeriseFieldTypeTypeEnum.NUMBER]: {
    label: "Nombre",
    defaultOption: { variant: FieldTypeNumberOptionEnum.INTEGER },
    OptionForm: FieldTypeNumberFormComponent,
    normalize: (raw: unknown) => {
      if (typeof raw === "string") return { variant: raw as FieldTypeNumberOption };
      return { variant: FieldTypeNumberOptionEnum.INTEGER };
    },
    format: (opt) => {
      switch (opt.variant) {
        case FieldTypeNumberOptionEnum.FLOAT:
          return "Décimal";
        case FieldTypeNumberOptionEnum.COMPTER:
          return "Compteur";
        default:
          return "Entier";
      }
    },
  },
  [MeriseFieldTypeTypeEnum.DATE]: {
    label: "Date",
    defaultOption: { variant: FieldTypeDateOptionEnum.DATE },
    OptionForm: FieldTypeDateFormComponent,
    normalize: (raw: unknown) => {
      if (typeof raw === "string") return { variant: raw as FieldTypeDateOption };
      return { variant: FieldTypeDateOptionEnum.DATE };
    },
    format: (opt) => {
      switch (opt.variant) {
        case FieldTypeDateOptionEnum.TIME:
          return "Heure";
        case FieldTypeDateOptionEnum.DATETIME:
          return "Date et heure";
        default:
          return "Date";
      }
    },
  },
  [MeriseFieldTypeTypeEnum.OTHER]: {
    label: "Autres",
    defaultOption: { variant: FieldTypeOtherOptionEnum.BOOLEAN },
    OptionForm: FieldTypeOtherFormComponent,
    normalize: (raw: unknown) => {
      if (typeof raw === "string") return { variant: raw as FieldTypeOtherOption };
      return { variant: FieldTypeOtherOptionEnum.BOOLEAN };
    },
    format: () => "Boolean",
  },
};

export function buildDefaultConfig(type: MeriseFieldTypeTypeEnum): FieldConfig {
  const entry = fieldTypeRegistry[type];
  return { type, options: entry.defaultOption };
}

export function buildConfigFromField(field: MeriseFieldInterface): FieldConfig {
  const type = field.getTypeField() ?? MeriseFieldTypeTypeEnum.TEXT;
  const raw: unknown = field.getTypeFieldOption?.() as MeriseFieldTypeOption | unknown;
  const entry = fieldTypeRegistry[type];
  return {
    type,
    options: entry.normalize(raw),
  };
}

export function fieldTypeLabel(type: MeriseFieldTypeTypeEnum): string {
  return fieldTypeRegistry[type].label;
}

export function formatFieldOption(type: MeriseFieldTypeTypeEnum, raw: unknown): string {
  const entry = fieldTypeRegistry[type];
  const normalized = entry.normalize(raw);
  return entry.format(normalized);
}
