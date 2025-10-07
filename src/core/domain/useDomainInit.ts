import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactFlowInstance } from "@xyflow/react";
import type { KernelDependencies, KernelOperations } from "@/core/kernel";
import { FlowDTO, type FlowDTOInterface, FlowManager, type TypedEdge, type TypedNode } from "@/libs/flow";
import { MeriseDTO, type MeriseDTOInterface, MeriseManager } from "@/libs/merise";
import DomainManager from "./DomainManager";
import type { UseDomainInitResult } from "./DomainTypes";

// Initializes and provides all Domain related state and managers
export const useDomainInit = (operations: KernelOperations, dependencies: KernelDependencies): UseDomainInitResult => {
  const [reactFlow, setReactFlow] = useState<ReactFlowInstance<TypedNode, TypedEdge> | null>(null);
  const [flowDTO, setFlowDTO] = useState<FlowDTOInterface>(new FlowDTO());
  const [meriseDTO, setMeriseDTO] = useState<MeriseDTOInterface>(new MeriseDTO());

  // Refs mirror the latest values and are updated synchronously by wrapped setters
  const reactFlowRef = useRef(reactFlow);
  const flowRef = useRef(flowDTO);
  const meriseRef = useRef(meriseDTO);

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
  const setReactFlowSynced = withRefSync(setReactFlow, reactFlowRef);
  const setFlowSynced = withRefSync(setFlowDTO, flowRef);
  const setMeriseSynced = withRefSync(setMeriseDTO, meriseRef);

  // Stable getters for managers
  const getReactFlow = useCallback(() => reactFlowRef.current, []);
  const getFlowDTO = useCallback(() => flowRef.current, []);
  const getMeriseDTO = useCallback(() => meriseRef.current, []);

  const currentSave = dependencies.getCurrentSave();
  const saveKey = currentSave.success ? currentSave.data.getId() : "no-save";

  useEffect(() => {
    const res = dependencies.getCurrentSave();

    if (res.success) {
      setFlowSynced(res.data.getFlowDTO());
      setMeriseSynced(res.data.getMeriseDTO());
    } else {
      setFlowSynced(new FlowDTO());
      setMeriseSynced(new MeriseDTO());
    }
  }, [saveKey]);

  const domainManager = useMemo(
    () =>
      new DomainManager(
        {
          flow: new FlowManager(getFlowDTO, setFlowSynced),
          merise: new MeriseManager(getMeriseDTO, setMeriseSynced),
        },
        operations,
        dependencies,
        getReactFlow
      ),
    [operations, dependencies, getReactFlow, getFlowDTO, setFlowSynced, getMeriseDTO, setMeriseSynced]
  );

  return { domain: domainManager, setReactFlow: setReactFlowSynced };
};
