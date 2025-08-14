import type { MeriseAssociationInterface } from "@/libs/merise";
import "./association.scss";

interface AssociationComponentProps {
  association: MeriseAssociationInterface;
}

export const AssociationComponent = ({ association }: AssociationComponentProps) => {
  return (
    <div className="association" onClick={() => association.handleSelection()}>
      <p>
        {association.getEmoji()} {association.getName()}
      </p>
    </div>
  );
};
