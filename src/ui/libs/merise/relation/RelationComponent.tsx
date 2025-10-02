import { useDomainContext } from "@/core/domain";
import type { Relation } from "@/libs/merise";
import "./relation.scss";

interface RelationComponentProps {
  relation: Relation;
}

export const RelationComponent = ({ relation }: RelationComponentProps) => {
  const { operations } = useDomainContext();

  return (
    <div className="relation" onClick={() => operations.handleDialogRelationEdit(relation)}>
      <span>{relation.getCardinality()}</span>
    </div>
  );
};
