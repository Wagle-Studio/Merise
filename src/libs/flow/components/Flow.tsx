import { type ReactNode, useCallback, useMemo } from "react";
import { Background, BackgroundVariant, type EdgeProps, type NodeProps, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { SettingsBackgroundTypeEnum } from "@/core/libs/settings";
import { useFlowContext } from "../core";
import type { TypedEdge, TypedNode } from "../types";
import Edge from "./Edge";
import Node from "./Node";

// Main Flow component integrating React Flow with custom node and edge types
export default function Flow() {
  const { flow, onNodesChange, onConnect, settings } = useFlowContext();

  const createNodeComponent = useCallback((props: NodeProps<TypedNode>) => <Node {...props} />, []);
  const createEdgeComponent = useCallback((props: EdgeProps<TypedEdge>) => <Edge {...props} />, []);

  const nodeTypes = useMemo(() => ({ NODE: createNodeComponent }), [createNodeComponent]);
  const edgeTypes = useMemo(() => ({ EDGE: createEdgeComponent }), [createEdgeComponent]);

  const reactFlowProps = useMemo(
    () => ({
      nodeTypes,
      edgeTypes,
      nodes: flow.getNodes(),
      edges: flow.getEdges(),
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
    }),
    [nodeTypes, edgeTypes, flow.getNodes(), flow.getEdges(), onNodesChange, onConnect, settings]
  );

  const getBackgroundVariant = (): ReactNode => {
    switch (settings.getSettings().background) {
      case SettingsBackgroundTypeEnum.GRID:
        return <Background variant={BackgroundVariant.Lines} gap={16} size={1} color="#0000002e" />;
      case SettingsBackgroundTypeEnum.DOTT:
        return <Background variant={BackgroundVariant.Cross} gap={16} size={1} color="#000000" />;
      default:
        return <></>;
    }
  };

  return (
    <div className="react_flow" tabIndex={0}>
      <ReactFlow<TypedNode, TypedEdge> {...reactFlowProps}>{getBackgroundVariant()}</ReactFlow>
    </div>
  );
}
