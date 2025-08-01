import type { MeriseAssociationInterface } from "@/libs/merise";
import "./association.scss";

export const AssociationComponent = (association: MeriseAssociationInterface) => {
  return (
    <div className="association" onClick={() => association.handleSelection()}>
      <p>
        {association.getEmoji()} {association.getName()}
      </p>
    </div>
  );
};
