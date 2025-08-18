import { z } from "zod";
import { SettingsBackgroundType as SettingsBackgroundTypeEnum, SettingsThemeType as SettingsThemeTypeEnum } from "./SettingsTypes";

export const SettingsFormTypeSchema = z.object({
  theme: z.enum(SettingsThemeTypeEnum, "Thème invalide"),
  background: z.enum(SettingsBackgroundTypeEnum, "Arrière-plan invalide"),
});

export type SettingsFormType = z.infer<typeof SettingsFormTypeSchema>;
