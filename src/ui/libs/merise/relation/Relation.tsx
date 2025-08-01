import type { MeriseRelationInterface } from "@/libs/merise";
import "./relation.scss";

export const RelationComponent = (relation: MeriseRelationInterface) => {
  return (
    <div className="relation" onClick={() => relation.handleSelection()}>
      <span>{relation.getCardinality() || relation.getName()}</span>
    </div>
  );
};
