import type { ReactNode } from "react";
import "./flowEdge.scss";

type FlowEdgeProps = {
  children: ReactNode;
  centerX: number;
  centerY: number;
};

export const FlowEdge = (props: FlowEdgeProps) => {
  return (
    <div className="edge" style={{ transform: `translate(-50%, -50%) translate(${props.centerX}px, ${props.centerY}px)` }}>
      {props.children}
    </div>
  );
};
