import type { MeriseRelationInterface } from "@/libs/merise";
import "./relation.scss";

interface RelationComponentProps {
  relation: MeriseRelationInterface;
}

export const RelationComponent = ({ relation }: RelationComponentProps) => {
  return (
    <div className="relation" onClick={() => relation.handleSelection()}>
      <span>{relation.getCardinality() || relation.getName()}</span>
    </div>
  );
};
