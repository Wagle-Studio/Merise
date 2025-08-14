import type { MeriseAssociationInterface } from "@/libs/merise";
import { useMeriseContext } from "@/libs/merise/core/MeriseContext";
import "./association.scss";

interface AssociationComponentProps {
  association: MeriseAssociationInterface;
}

export const AssociationComponent = ({ association }: AssociationComponentProps) => {
  const { operations } = useMeriseContext();

  return (
    <div className="association" onClick={() => operations.onAssociationSelect(association)}>
      <p>
        {association.getEmoji()} {association.getName()}
      </p>
    </div>
  );
};
