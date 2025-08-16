import { z } from "zod";
import { SettingsBackgroundType as SettingsBackgroundTypeEnum } from "./SettingsTypes";

export const SettingsFormTypeSchema = z.object({
  background: z.enum(SettingsBackgroundTypeEnum, "Arrière-plan invalide"),
});

export type SettingsFormType = z.infer<typeof SettingsFormTypeSchema>;
