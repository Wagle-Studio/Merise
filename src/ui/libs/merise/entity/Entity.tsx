import type { MeriseEntityInterface } from "@/libs/merise";
import "./entity.scss";

export const EntityComponent = (entity: MeriseEntityInterface) => {
  return (
    <div className="entity" onClick={() => entity.handleSelection()}>
      <p>
        {entity.getEmoji()} {entity.getName()}
      </p>
    </div>
  );
};
