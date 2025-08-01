import type { MeriseEntityInterface } from "@/libs/merise";
import { Button } from "@/ui/system";
import "./entityForm.scss";

export const EntityFormComponent = (entity: MeriseEntityInterface, onSave: Function) => {
  const handleSubmit = () => {
    const nameInput = document.getElementById("name") as HTMLInputElement;
    const emojiSelect = document.getElementById("entity-emoji") as HTMLSelectElement;

    const name = nameInput?.value;
    const emoji = emojiSelect?.value;

    if (name && onSave) {
      onSave({ name, emoji });
    }
  };

  return (
    <div className="entity-form">
      <div className="entity-form__wrapper_horizontal">
        <div className="entity-form__wrapper_horizontal__input-wrapper--select">
          <label className="entity-form__wrapper_horizontal__input-wrapper__label" htmlFor="entity-emoji">
            Emoji
          </label>
          <select className="entity-form__wrapper_horizontal__input-wrapper__select" id="entity-emoji" name="entity-emoji" defaultValue="📋">
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
