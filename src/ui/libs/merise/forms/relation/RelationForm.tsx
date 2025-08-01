import { MeriseRelationCardinalityTypeEnum, type MeriseRelationInterface } from "@/libs/merise";
import { Button } from "@/ui/system";
import "./relationForm.scss";

export const RelationFormComponent = (relation: MeriseRelationInterface, onSave: Function) => {
  const handleSubmit = () => {
    const cardinalitySelect = document.getElementById("relation-cardinality") as HTMLSelectElement;
    const cardinality = cardinalitySelect?.value as MeriseRelationCardinalityTypeEnum;
    onSave({ cardinality });
  };

  return (
    <div className="relation-form">
      <div className="relation-form__input-wrapper">
        <label className="relation-form__input-wrapper__label" htmlFor="relation-cardinality">
          Cardinalité
        </label>
        <select className="relation-form__input-wrapper__select" id="relation-cardinality" name="relation-cardinality" defaultValue={relation.getCardinality() || MeriseRelationCardinalityTypeEnum.ZERO_N}>
          <option value={MeriseRelationCardinalityTypeEnum.ZERO_ONE}>0,1 - Optionnel, unique</option>
          <option value={MeriseRelationCardinalityTypeEnum.ONE_ONE}>1,1 - Obligatoire, unique</option>
          <option value={MeriseRelationCardinalityTypeEnum.ZERO_N}>0,N - Optionnel, multiple</option>
          <option value={MeriseRelationCardinalityTypeEnum.ONE_N}>1,N - Obligatoire, multiple</option>
        </select>
      </div>
      <div className="relation-form__actions">
        <Button onClick={handleSubmit}>Sauvegarder</Button>
      </div>
    </div>
  );
};
