import type { ZodError } from "zod";
import type { MeriseAssociationInterface, MeriseResult } from "@/libs/merise";
import type { AssociationFormType } from "@/libs/merise/models/association/AssociationFormSchema";
import { Button } from "@/ui/system";
import "./associationForm.scss";

type OnSave = (formData: AssociationFormType) => MeriseResult<AssociationFormType, ZodError>;

export const AssociationFormComponent = (association: MeriseAssociationInterface, onSave: OnSave) => {
  const handleSubmit = () => {
    const nameInput = document.getElementById("name") as HTMLInputElement;
    const emojiSelect = document.getElementById("association-emoji") as HTMLSelectElement;

    const name = nameInput?.value;
    const emoji = emojiSelect?.value;

    const saveResult = onSave({ name, emoji });

    if (!saveResult.success && saveResult.error) {
      console.log(saveResult.error.issues);
    }
  };

  return (
    <div className="association-form">
      <div className="association-form__wrapper_horizontal">
        <div className="association-form__wrapper_horizontal__input-wrapper--select">
          <label className="association-form__wrapper_horizontal__input-wrapper__label" htmlFor="association-emoji">
            Emoji
          </label>
          <select className="association-form__wrapper_horizontal__input-wrapper__select" id="association-emoji" name="association-emoji">
            <option value="📋">📋 </option>
            <option value="📝">📝 </option>
            <option value="🔍">🔍 </option>
            <option value="📊">📊 </option>
          </select>
        </div>
        <div className="association-form__wrapper_horizontal__input-wrapper--name">
          <label className="association-form__wrapper_horizontal__input-wrapper__label" htmlFor="name">
            Nom
          </label>
          <input className="association-form__wrapper_horizontal__input-wrapper__input" type="text" id="name" name="name" defaultValue={association.getName()} />
        </div>
      </div>
      <div className="association-form__actions">
        <Button onClick={handleSubmit}>Sauvegarder</Button>
      </div>
    </div>
  );
};
