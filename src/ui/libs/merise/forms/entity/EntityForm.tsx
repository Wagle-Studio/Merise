import type { ZodError } from "zod";
import type { MeriseEntityInterface, MeriseResult } from "@/libs/merise";
import type { EntityFormType } from "@/libs/merise/models/entity/EntityFormSchema";
import { Button } from "@/ui/system";
import "./entityForm.scss";

type OnSave = (formData: EntityFormType) => MeriseResult<EntityFormType, ZodError>;

export const EntityFormComponent = (entity: MeriseEntityInterface, onSave: OnSave) => {
  const handleSubmit = () => {
    const nameInput = document.getElementById("name") as HTMLInputElement;
    const emojiSelect = document.getElementById("entity-emoji") as HTMLSelectElement;

    const name = nameInput?.value;
    const emoji = emojiSelect?.value;

    const saveResult = onSave({ name, emoji });

    if (!saveResult.success && saveResult.error) {
      console.log(saveResult.error.issues);
    }
  };

  return (
    <div className="entity-form">
      <div className="entity-form__wrapper_horizontal">
        <div className="entity-form__wrapper_horizontal__input-wrapper--select">
          <label className="entity-form__wrapper_horizontal__input-wrapper__label" htmlFor="entity-emoji">
            Emoji
          </label>
          <select className="entity-form__wrapper_horizontal__input-wrapper__select" id="entity-emoji" name="entity-emoji">
            <option value="📚">📚 </option>
            <option value="👤">👤 </option>
            <option value="📖">📖 </option>
            <option value="🏛️">🏛️ </option>
            <option value="👨‍💼">👨‍💼 </option>
          </select>
        </div>
        <div className="entity-form__wrapper_horizontal__input-wrapper--name">
          <label className="entity-form__wrapper_horizontal__input-wrapper__label" htmlFor="name">
            Nom
          </label>
          <input className="entity-form__wrapper_horizontal__input-wrapper__input" type="text" id="name" name="name" defaultValue={entity.getName()} />
        </div>
      </div>
      <div className="entity-form__actions">
        <Button onClick={handleSubmit}>Sauvegarder</Button>
      </div>
    </div>
  );
};
