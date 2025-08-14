import { z } from "zod";
import { MeriseRelationCardinalityTypeEnum } from "@/libs/merise";

export const RelationFormTypeSchema = z.object({
  cardinality: z.enum(MeriseRelationCardinalityTypeEnum, "Cardinalité invalide"),
});

export type RelationFormType = z.infer<typeof RelationFormTypeSchema>;
