import { createElement } from "react";
import { FieldComponent, FieldFormComponent } from "@/ui";
import { type MeriseFieldInterface, type MeriseItemType, MeriseItemTypeEnum } from "../../types";
import AbstractMeriseItem from "../AbstractMeriseItem";
import type { FieldFormType } from "./FieldFormSchema";

export default class Field extends AbstractMeriseItem implements MeriseFieldInterface {
  private meriseItemId: string;
  private meriseItemType: MeriseItemType;

  constructor(meriseItemId: string, meriseItemType: MeriseItemType, id?: string) {
    super(MeriseItemTypeEnum.FIELD, id);
    this.meriseItemId = meriseItemId;
    this.meriseItemType = meriseItemType;
  }

  hydrate = (formData: FieldFormType): void => {
    this.setName(formData.name);
  };

  getMeriseItemId = (): string => {
    return this.meriseItemId;
  };

  getMeriseItemType = (): MeriseItemType => {
    return this.meriseItemType;
  };

  renderComponent = (): React.ReactElement => {
    return createElement(FieldComponent, { field: this });
  };

  renderFormComponent = (): React.ReactElement => {
    return createElement(FieldFormComponent, { field: this });
  };
}
