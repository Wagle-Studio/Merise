import { createElement } from "react";
import { FieldFormComponent } from "@/ui";
import { type MeriseFieldInterface, type MeriseFieldTypeType, type MeriseFormType, type MeriseItemType, MeriseItemTypeEnum } from "../../types";
import AbstractMeriseItem from "../AbstractMeriseItem";
import type { FieldFormType } from "./FieldFormSchema";

export default class Field extends AbstractMeriseItem implements MeriseFieldInterface {
  private meriseItemId: string;
  private meriseItemType: MeriseItemType;
  private name: string | null = null;
  private typeField: MeriseFieldTypeType | null = null;
  private primaryKey: boolean = false;
  private nullable: boolean = true;
  private unique: boolean = false;

  constructor(meriseItemId: string, meriseItemType: MeriseItemType, id?: string, name: string | null = null, typeField: MeriseFieldTypeType | null = null, primaryKey?: boolean, nullable?: boolean, unique?: boolean) {
    super(MeriseItemTypeEnum.FIELD, id);
    this.meriseItemId = meriseItemId;
    this.meriseItemType = meriseItemType;
    this.name = name;
    this.typeField = typeField;
    this.primaryKey = primaryKey ?? false;
    this.nullable = nullable ?? true;
    this.unique = unique ?? false;
  }

  hydrate = (formData: FieldFormType): void => {
    this.setName(formData.name);
    this.setTypeField(formData.type);
    this.setIsPrimary(formData.primary);
    this.setIsNullable(formData.nullable);
    this.setIsUnique(formData.unique);
  };

  getMeriseItemId = (): string => {
    return this.meriseItemId;
  };

  getMeriseItemType = (): MeriseItemType => {
    return this.meriseItemType;
  };

  getName = (): string | null => {
    return this.name;
  };

  getTypeField = (): MeriseFieldTypeType | null => {
    return this.typeField;
  };

  isPrimary = (): boolean => {
    return this.primaryKey;
  };

  isNullable = (): boolean => {
    return this.nullable;
  };

  isUnique = (): boolean => {
    return this.unique;
  };

  renderFormComponent = (formType: MeriseFormType): React.ReactElement => {
    return createElement(FieldFormComponent, { field: this, formType: formType });
  };

  private setName = (name: string): void => {
    this.name = name;
  };

  private setTypeField = (typeField: MeriseFieldTypeType): void => {
    this.typeField = typeField;
  };

  private setIsPrimary = (isPrimaryKey: boolean): void => {
    this.primaryKey = isPrimaryKey;
  };

  private setIsNullable = (isNullable: boolean): void => {
    this.nullable = isNullable;
  };

  private setIsUnique = (isUnique: boolean): void => {
    this.unique = isUnique;
  };
}
