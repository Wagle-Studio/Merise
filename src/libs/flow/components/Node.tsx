import { memo } from "react";
import { Handle, type NodeProps, Position } from "@xyflow/react";
import { FlowNode } from "@/ui";
import { useFlowContext } from "../core";
import type { FlowMeriseItemInterface, FlowResult, TypedNode } from "../types";
import { FlowMeriseItemTypeEnum } from "../types";

// Custom Node component rendering the corresponding Merise item UI and connection handles
export default memo(
  function Node(props: NodeProps<TypedNode>): React.ReactElement | null {
    const { dependencies } = useFlowContext();

    let meriseItemFindResult: FlowResult<FlowMeriseItemInterface, null>;

    switch (props.data.type) {
      case FlowMeriseItemTypeEnum.ENTITY:
        meriseItemFindResult = dependencies.findMeriseEntityByFlowId(props.id);
        break;
      case FlowMeriseItemTypeEnum.ASSOCIATION:
        meriseItemFindResult = dependencies.findMeriseAssociationByFlowId(props.id);
        break;
      default:
        return null;
    }

    // TODO : handle error, with an error node ?
    if (!meriseItemFindResult.success || !meriseItemFindResult.data) {
      return null;
    }

    return (
      <>
        <FlowNode>{meriseItemFindResult.data.renderComponent()}</FlowNode>
        <Handle type="source" position={Position.Top} />
        <Handle type="target" position={Position.Bottom} />
      </>
    );
  },
  (prevProps, nextProps) => prevProps.id === nextProps.id && prevProps.data === nextProps.data
);
