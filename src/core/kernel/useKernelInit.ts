import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type AnyDialog, DialogManager } from "@/core/libs/dialog";
import { ErrorManager } from "@/core/libs/error";
import { NavigatorManager } from "@/core/libs/navigator";
import { NormalizeManager } from "@/core/libs/normalize";
import { type SaveDTOInterface, SaveManager } from "@/core/libs/save";
import { SettingsDTO, type SettingsDTOInterface, SettingsManager } from "@/core/libs/settings";
import { type Toast, ToastManager } from "@/core/libs/toast";
import KernelManager from "./KernelManager";
import type { UseKernelInitResult } from "./KernelTypes";

// Initializes and provides all Kernel related state and managers
export const useKernelInit = (): UseKernelInitResult => {
  const [save, setSave] = useState<SaveDTOInterface | null>(() => SaveManager.initSaveFromUrlParams());
  const [settingsDTO, setSettingsDTO] = useState<SettingsDTOInterface>(new SettingsDTO());
  const [dialogs, setDialogs] = useState<AnyDialog[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Refs mirror the latest values and are updated synchronously by wrapped setters
  const saveRef = useRef(save);
  const settingsRef = useRef(settingsDTO);
  const dialogsRef = useRef(dialogs);
  const toastsRef = useRef(toasts);
  const toastsTimersRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Generic wrapper to keep ref in sync at the same time as React state
  const withRefSync =
    <S>(setState: React.Dispatch<React.SetStateAction<S>>, ref: React.RefObject<S>) =>
    (updater: React.SetStateAction<S>) => {
      setState((prev) => {
        const next = typeof updater === "function" ? (updater as (p: S) => S)(prev) : updater;
        ref.current = next;
        return next;
      });
    };

  // Syncr setters for managers
  const setSaveSynced = withRefSync(setSave, saveRef);
  const setSettingsSynced = withRefSync(setSettingsDTO, settingsRef);
  const setDialogsSynced = withRefSync(setDialogs, dialogsRef);
  const setToastsSynced = withRefSync(setToasts, toastsRef);

  // Stable getters for managers
  const getSave = useCallback(() => saveRef.current, []);
  const getSettingsDTO = useCallback(() => settingsRef.current, []);
  const getDialogs = useCallback(() => dialogsRef.current, []);
  const getToasts = useCallback(() => toastsRef.current, []);

  // Clear toasts when unmount
  useEffect(() => {
    return () => {
      const timers = toastsTimersRef.current;
      Object.values(timers).forEach(clearTimeout);
      toastsTimersRef.current = {};
    };
  }, []);

  // Instantiate managers once with synced setters and stable getters
  const kernelManager = useMemo(
    () =>
      KernelManager.getInstance({
        dialog: DialogManager.getInstance(getDialogs, setDialogsSynced),
        error: ErrorManager.getInstance(),
        navigator: NavigatorManager.getInstance(),
        normalize: NormalizeManager.getInstance(),
        save: SaveManager.getInstance(getSave, setSaveSynced),
        settings: SettingsManager.getInstance(getSettingsDTO, setSettingsSynced),
        toast: ToastManager.getInstance(getToasts, setToastsSynced, toastsTimersRef),
      }),
    []
  );

  // Keep settings in sync only when opening or changing the active save
  useEffect(() => {
    if (!save) return;
    setSettingsSynced(save.getSettingsDTO());
  }, [save]);

  return { kernel: kernelManager };
};
