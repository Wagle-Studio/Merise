import { type ReactNode, useCallback, useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  type EdgeProps,
  type NodeProps,
  type OnInit,
  ReactFlow,
  type ReactFlowProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useDomainContext } from "@/core/domain";
import { SettingsBackgroundTypeEnum } from "@/core/libs/settings";
import { useFlowHandlers } from "../core/useFlowHandlers";
import type { TypedEdge, TypedNode } from "../types";
import Edge from "./Edge";
import Node from "./Node";

// Main Flow component integrating React Flow with custom node and edge types
export default function Flow() {
  const { operations, dependencies, setReactFlow } = useDomainContext();

  const { onConnect, onNodesChange } = useFlowHandlers({
    onConnectFn: operations.handleRelationCreate,
    onNodesChangeFn: operations.handleNodeMove,
  });

  const createNodeComponent = useCallback((props: NodeProps<TypedNode>) => <Node {...props} />, []);
  const createEdgeComponent = useCallback((props: EdgeProps<TypedEdge>) => <Edge {...props} />, []);

  const nodeTypes = useMemo(() => ({ NODE: createNodeComponent }), [createNodeComponent]);
  const edgeTypes = useMemo(() => ({ EDGE: createEdgeComponent }), [createEdgeComponent]);

  const flow = dependencies.getCurrentFlow();
  const nodes = useMemo(() => [...flow.getNodes()], [flow]);
  const edges = useMemo(() => [...flow.getEdges()], [flow]);

  const handleInit: OnInit<TypedNode, TypedEdge> = (instance) => {
    setReactFlow(instance);
  };

  const reactFlowProps: ReactFlowProps<TypedNode, TypedEdge> = useMemo(
    () => ({
      nodeTypes,
      edgeTypes,
      nodes: nodes,
      edges: edges,
      onNodesChange,
      onConnect,
      fitView: true,
      snapToGrid: true,
      snapGrid: [16, 16] as [number, number],
      attributionPosition: "bottom-left" as const,
      elementsSelectable: true,
      nodesDraggable: true,
      nodesConnectable: true,
      panOnDrag: true,
      onInit: handleInit,
    }),
    [nodeTypes, edgeTypes, nodes, edges, dependencies, onNodesChange, onConnect]
  );

  const getBackgroundVariant = (): ReactNode => {
    switch (dependencies.getCurrentSettings().getSettings().background) {
      case SettingsBackgroundTypeEnum.GRID:
        return <Background variant={BackgroundVariant.Lines} gap={16} size={1} color="var(--gray-base)" />;
      case SettingsBackgroundTypeEnum.DOTT:
        return <Background variant={BackgroundVariant.Cross} gap={16} size={1} color="var(--gray-darker)" />;
      default:
        return <></>;
    }
  };

  return (
    <div className="react_flow" tabIndex={0}>
      <ReactFlow {...reactFlowProps}>{getBackgroundVariant()}</ReactFlow>
    </div>
  );
}
