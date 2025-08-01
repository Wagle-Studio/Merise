import { memo, useMemo } from "react";
import { BaseEdge, EdgeLabelRenderer, type EdgeProps } from "@xyflow/react";
import { FlowEdge } from "@/ui";
import { useFlowContext } from "../core/FlowContext";
import type { TypedEdge } from "../types";

// Custom Edge component rendering the corresponding Merise item UI and connection handles
export default memo(
  function Edge(props: EdgeProps<TypedEdge>) {
    const { dependencies } = useFlowContext();

    const meriseItemFindResult = dependencies.findMeriseRelationByFlowId(props.id);

    if (!meriseItemFindResult.success || !meriseItemFindResult.data) {
      return null;
    }

    const centers = useMemo(() => {
      return {
        centerX: (props.targetX - props.sourceX) / 2 + props.sourceX,
        centerY: (props.targetY - props.sourceY) / 2 + props.sourceY,
      };
    }, [props.sourceX, props.sourceY, props.targetX, props.targetY]);

    const edgePath = useMemo(() => {
      return `M ${props.sourceX} ${props.sourceY} L ${props.sourceX} ${centers.centerY} L ${props.targetX} ${centers.centerY} L ${props.targetX} ${props.targetY}`;
    }, [centers]);

    return (
      <>
        <BaseEdge id={props.id} path={edgePath} />
        <EdgeLabelRenderer>
          <FlowEdge centerX={centers.centerX} centerY={centers.centerY}>
            {meriseItemFindResult.data.renderComponent()}
          </FlowEdge>
        </EdgeLabelRenderer>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      prevProps.sourceX === nextProps.sourceX &&
      prevProps.sourceY === nextProps.sourceY &&
      prevProps.targetX === nextProps.targetX &&
      prevProps.targetY === nextProps.targetY &&
      prevProps.data === nextProps.data
    );
  }
);
