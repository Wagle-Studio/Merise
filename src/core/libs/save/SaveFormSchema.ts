import { z } from "zod";

export const SaveFormTypeSchema = z.object({
  name: z.string().min(3, "Le nom du diagramme doit être supérieur à 3 caractères").max(50, "Le nom du diagramme ne pas doit être supérieur à 50 caractères"),
});

export type SaveFormType = z.infer<typeof SaveFormTypeSchema>;
