import { useEffect, useMemo, useRef, useState } from "react";
import CoreManager from "@/core/CoreManager";
import { type Dialog, DialogManager } from "@/core/libs/dialog";
import { ErrorManager } from "@/core/libs/error";
import { SaverManager } from "@/core/libs/saver";
import { SettingsDTO, type SettingsDTOInterface, SettingsManager } from "@/core/libs/settings";
import { type Toast, ToastManager } from "@/core/libs/toast";
import { FlowDTO, type FlowDTOInterface, FlowManager } from "@/libs/flow";
import { Association, Entity, MeriseDTO, type MeriseDTOInterface, MeriseManager, Relation } from "@/libs/merise";
import type { KernelManagers, UseKernelInitializationResult } from "./KernelTypes";

const getLocalOSEF = (): { flow: FlowDTOInterface; merise: MeriseDTOInterface } | null => {
  const JSONsave = localStorage.getItem("123");

  if (JSONsave) {
    const save = JSON.parse(JSONsave);
    const flowNodes = JSON.parse(save.data.flow.nodes);
    const flowEdges = JSON.parse(save.data.flow.edges);
    const meriseEntitiesRaw = JSON.parse(save.data.merise.entities);
    const meriseAssociationsRaw = JSON.parse(save.data.merise.associations);
    const meriseRelationsRaw = JSON.parse(save.data.merise.relations);

    const meriseEntities = meriseEntitiesRaw.map((item: any) => new Entity(item.flowId, item.name));
    const meriseAssociations = meriseAssociationsRaw.map((item: any) => new Association(item.flowId, item.name));
    const meriseRelations = meriseRelationsRaw.map((item: any) => new Relation(item.flowId, item.source, item.target, item.cardinality));

    const flowDtoTest = new FlowDTO().cloneWithUpdatedEdgesAndNodes(flowEdges, flowNodes);
    const meriseDtoTest = new MeriseDTO().cloneWithUpdatedEntitiesAndRelationsAndAssociations(meriseEntities, meriseAssociations, meriseRelations);

    return {
      flow: flowDtoTest,
      merise: meriseDtoTest,
    };
  }

  return null;
};

// Initializes and provides all Kernel-related state and managers
export const useKernelInitialization = (): UseKernelInitializationResult => {
  const osef = getLocalOSEF();

  const [settings, setSettings] = useState<SettingsDTOInterface>(new SettingsDTO());
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [flowDTO, setFlowDTO] = useState<FlowDTOInterface>(osef?.flow ?? new FlowDTO());
  const [meriseDTO, setMeriseDTO] = useState<MeriseDTOInterface>(osef?.merise ?? new MeriseDTO());

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
    const saver = new SaverManager(getFlowDTO, getMeriseDTO);
    const flow = new FlowManager(getFlowDTO, setFlowDTO);
    const merise = new MeriseManager(getMeriseDTO, setMeriseDTO);
    const core = new CoreManager(flow, merise, toast, dialog, error, saver, settings);

    return { settings, dialog, toast, error, saver, flow, merise, core };
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
