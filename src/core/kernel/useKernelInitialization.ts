import { useEffect, useMemo, useRef, useState } from "react";
import CoreManager from "@/core/CoreManager";
import { type Dialog, DialogManager } from "@/core/libs/dialog";
import { ErrorManager } from "@/core/libs/error";
import { SettingsDTO, type SettingsDTOInterface, SettingsManager } from "@/core/libs/settings";
import { type Toast, ToastManager } from "@/core/libs/toast";
import { FlowDTO, type FlowDTOInterface, FlowManager } from "@/libs/flow";
import { MeriseDTO, type MeriseDTOInterface, MeriseManager } from "@/libs/merise";
import type { KernelManagers, UseKernelInitializationResult } from "./KernelTypes";

// Initializes and provides all Kernel-related state and managers
export const useKernelInitialization = (): UseKernelInitializationResult => {
  const [settings, setSettings] = useState<SettingsDTOInterface>(new SettingsDTO());
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [flowDTO, setFlowDTO] = useState<FlowDTOInterface>(new FlowDTO());
  const [meriseDTO, setMeriseDTO] = useState<MeriseDTOInterface>(new MeriseDTO());

  const settingsRef = useRef(settings);
  const dialogsRef = useRef(dialogs);
  const toastsRef = useRef(toasts);
  const toastsTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const flowDTORef = useRef(flowDTO);
  const meriseDTORef = useRef(meriseDTO);

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
    const flow = new FlowManager(getFlowDTO, setFlowDTO);
    const merise = new MeriseManager(getMeriseDTO, setMeriseDTO);
    const core = new CoreManager(flow, merise, toast, dialog, error, settings);

    return { settings, dialog, toast, error, flow, merise, core };
  }, []);

  return {
    settings,
    dialogs,
    toasts,
    flowDTO,
    meriseDTO,
    managers,
  };
};
