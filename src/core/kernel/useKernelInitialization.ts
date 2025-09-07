import { useEffect, useMemo, useRef, useState } from "react";
import CoreManager from "@/core/CoreManager";
import { type Dialog, DialogManager } from "@/core/libs/dialog";
import { ErrorManager } from "@/core/libs/error";
import { SaverDTO, type SaverDTOInterface, SaverManager } from "@/core/libs/saver";
import { type SettingsDTOInterface, SettingsManager } from "@/core/libs/settings";
import { type Toast, ToastManager } from "@/core/libs/toast";
import { type FlowDTOInterface, FlowManager } from "@/libs/flow";
import { type MeriseDTOInterface, MeriseManager } from "@/libs/merise";
import type { KernelManagers, KernelSeed, UseKernelInitializationResult } from "./KernelTypes";
import { useKernelSeedBuilder } from "./useKernelSeedBuilder";

// Initializes and provides all Kernel-related state and managers
export const useKernelInitialization = (seed: KernelSeed): UseKernelInitializationResult => {
  const storedItem = useKernelSeedBuilder(seed);

  const [save, setSave] = useState<SaverDTOInterface>(new SaverDTO(storedItem));
  const [settings, setSettings] = useState<SettingsDTOInterface>(save.getSettings());
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [flowDTO, setFlowDTO] = useState<FlowDTOInterface>(save.getFlow());
  const [meriseDTO, setMeriseDTO] = useState<MeriseDTOInterface>(save.getMerise());

  const saveRef = useRef(save);
  const settingsRef = useRef(settings);
  const dialogsRef = useRef(dialogs);
  const toastsRef = useRef(toasts);
  const toastsTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const flowDTORef = useRef(flowDTO);
  const meriseDTORef = useRef(meriseDTO);

  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

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
  const getSettings = () => settingsRef.current;
  const getDialogs = () => dialogsRef.current;
  const getToats = () => toastsRef.current;
  const getFlowDTO = () => flowDTORef.current;
  const getMeriseDTO = () => meriseDTORef.current;

  const managers = useMemo<KernelManagers>(() => {
    const settings = new SettingsManager(getSettings, setSettings);
    const dialog = new DialogManager(getDialogs, setDialogs);
    const toast = new ToastManager(getToats, setToasts, toastsTimersRef);
    const error = new ErrorManager(toast);
    const saver = new SaverManager(getSave, setSave, getSettings, getFlowDTO, getMeriseDTO);
    const flow = new FlowManager(getFlowDTO, setFlowDTO);
    const merise = new MeriseManager(getMeriseDTO, setMeriseDTO);
    const core = new CoreManager(flow, merise, toast, dialog, error, saver, settings);

    return { settings, dialog, toast, error, saver, flow, merise, core };
  }, []);

  return {
    save,
    settings,
    dialogs,
    toasts,
    flowDTO,
    meriseDTO,
    managers,
  };
};
