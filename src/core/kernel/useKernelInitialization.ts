import { useEffect, useMemo, useRef, useState } from "react";
import CoreManager from "@/core/CoreManager";
import { type Dialog, DialogManager } from "@/core/libs/dialog";
import { ErrorManager } from "@/core/libs/error";
import { NavigatorManager } from "@/core/libs/navigator";
import { NormalizeManager } from "@/core/libs/normalize";
import { type SaveDTOInterface, SaveManager } from "@/core/libs/save";
import { SettingsDTO, type SettingsDTOInterface, SettingsManager } from "@/core/libs/settings";
import { type Toast, ToastManager } from "@/core/libs/toast";
import { FlowDTO, type FlowDTOInterface, FlowManager } from "@/libs/flow";
import { MeriseDTO, type MeriseDTOInterface, MeriseManager } from "@/libs/merise";
import type { KernelManagers, UseKernelInitializationResult } from "./KernelTypes";

// Initializes and provides all Kernel-related state and managers
export const useKernelInitialization = (): UseKernelInitializationResult => {
  const bootSave = SaveManager.initSaveFromUrlParams();

  const [save, setSave] = useState<SaveDTOInterface | null>(bootSave);
  const [settingsDTO, setSettingsDTO] = useState<SettingsDTOInterface>(new SettingsDTO());
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [flowDTO, setFlowDTO] = useState<FlowDTOInterface>(new FlowDTO());
  const [meriseDTO, setMeriseDTO] = useState<MeriseDTOInterface>(new MeriseDTO());

  const saveRef = useRef(save);
  const settingsRef = useRef(settingsDTO);
  const dialogsRef = useRef(dialogs);
  const toastsRef = useRef(toasts);
  const toastsTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const flowDTORef = useRef(flowDTO);
  const meriseDTORef = useRef(meriseDTO);

  useEffect(() => {
    saveRef.current = save;

    if (save) {
      setSettingsDTO(save.getSettingsDTO());
      setFlowDTO(save.getFlowDTO());
      setMeriseDTO(save.getMeriseDTO());
    }
  }, [save]);

  useEffect(() => {
    settingsRef.current = settingsDTO;
  }, [settingsDTO]);

  useEffect(() => {
    dialogsRef.current = dialogs;
  }, [dialogs]);

  useEffect(() => {
    toastsRef.current = toasts;
  }, [toasts]);

  useEffect(() => {
    flowDTORef.current = flowDTO;
  }, [flowDTO]);

  useEffect(() => {
    meriseDTORef.current = meriseDTO;
  }, [meriseDTO]);

  const getSave = () => saveRef.current;
  const getSettingsDTO = () => settingsRef.current;
  const getDialogs = () => dialogsRef.current;
  const getToasts = () => toastsRef.current;
  const getFlowDTO = () => flowDTORef.current;
  const getMeriseDTO = () => meriseDTORef.current;

  const managers = useMemo<KernelManagers>(() => {
    const error = ErrorManager.getInstance(); // REVIEWED
    const toast = ToastManager.getInstance(getToasts, setToasts, toastsTimersRef); // REVIEWED

    const normalize = new NormalizeManager();
    const navigator = new NavigatorManager();
    const settings = new SettingsManager(getSettingsDTO, setSettingsDTO);
    const dialog = new DialogManager(getDialogs, setDialogs);
    const save = new SaveManager(getSave, setSave, getSettingsDTO, getFlowDTO, getMeriseDTO, normalize);
    const flow = new FlowManager(getFlowDTO, setFlowDTO);
    const merise = new MeriseManager(getMeriseDTO, setMeriseDTO);
    const core = new CoreManager(flow, merise, toast, dialog, error, save, settings, navigator);

    return { settings, dialog, toast, error, normalize, save, navigator, flow, merise, core };
  }, []);

  return {
    save,
    settingsDTO,
    dialogs,
    toasts,
    flowDTO,
    meriseDTO,
    managers,
  };
};
