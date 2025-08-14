import type { MeriseRelationInterface } from "@/libs/merise";
import { useMeriseContext } from "@/libs/merise";
import "./relation.scss";

interface RelationComponentProps {
  relation: MeriseRelationInterface;
}

export const RelationComponent = ({ relation }: RelationComponentProps) => {
  const { operations } = useMeriseContext();

  return (
    <div className="relation" onClick={() => operations.onRelationSelect(relation)}>
      <span>{relation.getCardinality()}</span>
    </div>
  );
};
