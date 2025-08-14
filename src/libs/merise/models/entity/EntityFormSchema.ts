import { z } from "zod";

export const EntityFormTypeSchema = z.object({
  name: z.string().min(3, "Le nom est requis").max(50, "Le nom ne peut pas dépasser 50 caractères"),
  emoji: z.string().min(1, "L'emoji est requis"),
});

export type EntityFormType = z.infer<typeof EntityFormTypeSchema>;
