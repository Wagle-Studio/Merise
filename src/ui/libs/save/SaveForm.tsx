import { format } from "date-fns";
import { useDomainContext } from "@/core/domain/DomainContext";
import { useKernelContext } from "@/core/kernel/KernelContext";
import { type SaveDTOInterface, SaveFormTypeSchema } from "@/core/libs/save";
import { Button, FieldText, Fieldset, Form, SaveIcon, TrashIcon, useFormErrors } from "@/ui/system";

interface SaveFormComponentProps {
  save: SaveDTOInterface;
  isCurrentSave: boolean;
}

export const SaveFormComponent = ({ save, isCurrentSave = true }: SaveFormComponentProps) => {
  const kernelContext = useKernelContext();
  const domainContext = useDomainContext();

  const { fieldErrors, setZodErrors, clearErrors, hasErrors } = useFormErrors();

  const handleSubmit = () => {
    clearErrors();

    const form = document.getElementById("save-form");

    // TODO : handle error
    if (!form) return;

    const formData = new FormData(form as HTMLFormElement);

    const formValues = {
      name: formData.get("save-name"),
    };

    const validationResult = SaveFormTypeSchema.safeParse(formValues);

    if (!validationResult.success) {
      setZodErrors(validationResult.error);
      return;
    }

    save.hydrate(validationResult.data);

    if (isCurrentSave) domainContext.operations.handleSaveCurrent();
    if (!isCurrentSave) kernelContext.operations.handleSaveUpdate(save);
  };

  const handleDelete = () => {
    if (isCurrentSave) kernelContext.operations.handleDialogSaveRemoveCurrent();
    if (!isCurrentSave) kernelContext.operations.handleDialogSaveRemove(save.getId());
  };

  const formActions = (
    <>
      <Button onClick={handleSubmit} width="full">
        <SaveIcon /> Sauvegarder
      </Button>
      <Button onClick={handleDelete} width="full">
        <TrashIcon /> Supprimer
      </Button>
    </>
  );

  return (
    <Form id="save-form" className="save-form" onSubmit={handleSubmit} actions={formActions} error={hasErrors}>
      <Fieldset>
        <FieldText
          label="Nom du diagramme"
          htmlFor="save-name"
          defaultValue={save.getName()}
          error={fieldErrors.name}
        />
      </Fieldset>
      <Fieldset>
        <p>
          <span className="field-text__label">Création : </span>
          {format(save.getCreated(), "dd/MM/yyyy KK:w")}
        </p>
        <p>
          <span className="field-text__label">Modification : </span>
          {format(save.getUpdated(), "dd/MM/yyyy KK:w")}
        </p>
      </Fieldset>
    </Form>
  );
};
