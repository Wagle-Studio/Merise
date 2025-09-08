// Contract for the navigator manager implementation
export interface NavigatorManagerInterface {
  setSaveUrlParams: (saveId: string) => void;
  clearSaveUrlParams: () => void;
}
