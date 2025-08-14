import { useCallback } from "react";
import { useKernelContext } from "@/core";
import { Button } from "../../atoms";
import "./toolbar.scss";

export const Toolbar = () => {
  const { managers } = useKernelContext();

  if (!managers) return null;

  const handleCreateEntity = useCallback(() => {
    managers.core.handleCreateFlowNodeAndMeriseEntity();
  }, []);

  const handleCreateAssociation = useCallback(() => {
    managers.core.handleCreateFlowNodeAndMeriseAssociation();
  }, []);

  return (
    <div className="toolbar">
      <Button onClick={handleCreateEntity}>Nouvelle entité</Button>
      <Button onClick={handleCreateAssociation}>Nouvelle association</Button>
    </div>
  );
};
