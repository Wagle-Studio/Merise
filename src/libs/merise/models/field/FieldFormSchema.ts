import { z } from "zod";
import { MeriseFieldTypeTypeEnum } from "../../types";

export const FieldFormTypeSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(50, "Le nom ne peut pas dépasser 50 caractères"),
  type: z.enum(MeriseFieldTypeTypeEnum, "Type invalide"),
  primary: z.boolean(),
  nullable: z.boolean(),
  unique: z.boolean(),
});

export type FieldFormType = z.infer<typeof FieldFormTypeSchema>;
