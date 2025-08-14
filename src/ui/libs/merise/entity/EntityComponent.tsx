import type { MeriseEntityInterface } from "@/libs/merise";
import { useMeriseContext } from "@/libs/merise";
import "./entity.scss";

interface EntityComponentProps {
  entity: MeriseEntityInterface;
}

export const EntityComponent = ({ entity }: EntityComponentProps) => {
  const { operations } = useMeriseContext();

  return (
    <div className="entity" onClick={() => operations.onEntitySelect(entity)}>
      <p>
        {entity.getEmoji()} {entity.getName()}
      </p>
    </div>
  );
};
