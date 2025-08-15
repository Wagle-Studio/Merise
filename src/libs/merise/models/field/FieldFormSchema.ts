import { z } from "zod";

export const FieldFormTypeSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(50, "Le nom ne peut pas dépasser 50 caractères"),
});

export type FieldFormType = z.infer<typeof FieldFormTypeSchema>;
