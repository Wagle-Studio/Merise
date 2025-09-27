// List of all available Merise error types
export enum SeverityType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

// Represents a successful Merise operation
export type MeriseResultSuccess<T> = {
  success: true;
  data: T;
};

// Represents a failed Merise operation
export type MeriseResultFail<E> = {
  success: false;
  message: string;
  severity: SeverityType;
  error?: E;
};

// Union type representing the result of a Merise operation
export type MeriseResult<T, E = undefined> = MeriseResultSuccess<T> | MeriseResultFail<E>;

// List of all available merise form types
export enum MeriseFormType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
}

// List of all available merise item types
export enum MeriseItemType {
  ENTITY = "ENTITY",
  ASSOCIATION = "ASSOCIATION",
  RELATION = "RELATION",
  FIELD = "FIELD",
}

// List of all available merise relation cardinality item types
export enum MeriseRelationCardinalityType {
  ZERO_ONE = "0,1",
  ONE_ONE = "1,1",
  ZERO_N = "0,N",
  ONE_N = "1,N",
}

// List of all available merise field type item types
export enum MeriseFieldTypeType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  DATE = "DATE",
  OTHER = "OTHER",
}
