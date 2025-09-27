import { createContext, useContext, useMemo } from "react";
import { useKernelContext } from "@/core/kernel";
import { useDTOValidation } from "@/core/libs/debug";
import ProviderFactoryDomain from "./DomainFactory";
import type { DomainContext, DomainContextProps } from "./DomainTypes";
import { useDomainInit } from "./useDomainInit";

const DomainContext = createContext<DomainContext | null>(null);

export const DomainContextProvider = ({ children }: DomainContextProps) => {
  const { operations, dependencies } = useKernelContext();
  const { domain } = useDomainInit(operations, dependencies);

  const flowDTO = domain.getManager("flow").getCurrentFlow();
  const meriseDTO = domain.getManager("merise").getCurrentMerise();

  useDTOValidation(flowDTO, meriseDTO, process.env.NODE_ENV === "development");

  const ops = useMemo(() => ProviderFactoryDomain.createOperations(domain), [domain]);
  const deps = useMemo(() => ProviderFactoryDomain.createDependencies(domain, dependencies), [domain, dependencies]);
  const contextValue = useMemo(() => ({ operations: ops, dependencies: deps }), [ops, deps, flowDTO, meriseDTO]);

  return <DomainContext.Provider value={contextValue}>{children}</DomainContext.Provider>;
};

export const useDomainContext = (): DomainContext => {
  const context = useContext(DomainContext);
  if (!context) {
    throw new Error("🔄 DomainContext doit être utilisé dans DomainContextProvider");
  }
  return context;
};
