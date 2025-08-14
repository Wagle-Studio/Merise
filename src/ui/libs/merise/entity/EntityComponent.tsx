import type { MeriseEntityInterface } from "@/libs/merise";
import "./entity.scss";

interface EntityComponentProps {
  entity: MeriseEntityInterface;
}

export const EntityComponent = ({ entity }: EntityComponentProps) => {
  return (
    <div className="entity" onClick={() => entity.handleSelection()}>
      <p>
        {entity.getEmoji()} {entity.getName()}
      </p>
    </div>
  );
};
