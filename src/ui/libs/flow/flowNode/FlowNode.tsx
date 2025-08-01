import type { ReactNode } from "react";
import "./flowNode.scss";

type FlowNodeProps = {
  children: ReactNode;
};

export const FlowNode = (props: FlowNodeProps) => {
  return <div className="node">{props.children}</div>;
};
