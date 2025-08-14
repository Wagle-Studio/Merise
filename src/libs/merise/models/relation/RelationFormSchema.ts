import { z } from "zod";
import { MeriseRelationCardinalityTypeEnum } from "@/libs/merise";

export const RelationFormTypeSchema = z.object({
  cardinality: z.enum(MeriseRelationCardinalityTypeEnum, "La cardinalité sélectionnée n'est pas valide"),
});

export type RelationFormType = z.infer<typeof RelationFormTypeSchema>;
