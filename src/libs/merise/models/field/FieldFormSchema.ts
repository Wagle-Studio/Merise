import { z } from "zod";
import { FieldTypeDateOptionEnum, FieldTypeNumberOptionEnum, FieldTypeOtherOptionEnum, FieldTypeTextOptionsEnum, MeriseFieldTypeTypeEnum } from "@/libs/merise";

// Base fiel form schema
const BaseFieldsShape = {
  name: z.string().trim().min(1, "Nom requis"),
  primary: z.boolean(),
  nullable: z.boolean(),
  unique: z.boolean(),
};

// Options schema for field type text
const TextOptionSchema = z
  .object({
    variant: z.enum(FieldTypeTextOptionsEnum),
    maxLength: z.number().int().positive().max(65535).optional(),
  })
  .refine((val) => !(val.variant === FieldTypeTextOptionsEnum.LONG && typeof val.maxLength !== "undefined"), { message: "maxLength interdit pour LONG", path: ["maxLength"] })
  .refine(
    (val) => {
      const needs = val.variant === FieldTypeTextOptionsEnum.VARIABLE || val.variant === FieldTypeTextOptionsEnum.FIXED;
      return !needs || typeof val.maxLength === "number";
    },
    { message: "maxLength requis pour VARIABLE ou FIXED", path: ["maxLength"] }
  );

// Field type text
const TextVariant = z
  .object({
    type: z.literal(MeriseFieldTypeTypeEnum.TEXT),
    option: TextOptionSchema,
  })
  .extend(BaseFieldsShape);

// Field type number
const NumberVariant = z
  .object({
    type: z.literal(MeriseFieldTypeTypeEnum.NUMBER),
    option: z.enum(FieldTypeNumberOptionEnum),
  })
  .extend(BaseFieldsShape);

// Field type date
const DateVariant = z
  .object({
    type: z.literal(MeriseFieldTypeTypeEnum.DATE),
    option: z.enum(FieldTypeDateOptionEnum),
  })
  .extend(BaseFieldsShape);

// Field type other
const OtherVariant = z
  .object({
    type: z.literal(MeriseFieldTypeTypeEnum.OTHER),
    option: z.enum(FieldTypeOtherOptionEnum),
  })
  .extend(BaseFieldsShape);

// Discrimination union for field type form
export const FieldFormTypeSchema = z.discriminatedUnion("type", [TextVariant, NumberVariant, DateVariant, OtherVariant]);

export type FieldFormType = z.infer<typeof FieldFormTypeSchema>;
