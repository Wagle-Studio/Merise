import { useCallback, useMemo } from "react";
import { type EdgeProps, type NodeProps, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useFlowContext } from "../core";
import type { TypedEdge, TypedNode } from "../types";
import Edge from "./Edge";
import Node from "./Node";

// Main Flow component integrating React Flow with custom node and edge types
export default function Flow() {
  const { flow, onNodesChange, onConnect } = useFlowContext();

  const createNodeComponent = useCallback((props: NodeProps<TypedNode>) => <Node {...props} />, []);
  const createEdgeComponent = useCallback((props: EdgeProps<TypedEdge>) => <Edge {...props} />, []);

  const nodeTypes = useMemo(() => ({ NODE: createNodeComponent }), [createNodeComponent]);
  const edgeTypes = useMemo(() => ({ EDGE: createEdgeComponent }), [createEdgeComponent]);

  const reactFlowProps = useMemo(
    () => ({
      nodeTypes,
      edgeTypes,
      nodes: flow.nodes,
      edges: flow.edges,
      onNodesChange,
      onConnect,
      fitView: true,
      snapToGrid: true,
      attributionPosition: "bottom-left" as const,
      elementsSelectable: true,
      nodesDraggable: true,
      nodesConnectable: true,
      panOnDrag: true,
    }),
    [nodeTypes, edgeTypes, flow.nodes, flow.edges, onNodesChange, onConnect]
  );

  return (
    <div className="react_flow" tabIndex={0}>
      <ReactFlow {...reactFlowProps} />
    </div>
  );
}
