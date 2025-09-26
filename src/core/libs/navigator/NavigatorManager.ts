import type { NavigatorManagerInterface } from "./NavigatorTypes";

export default class NavigatorManager implements NavigatorManagerInterface {
  private static instance: NavigatorManager;

  private constructor() {}

  static getInstance = () => {
    if (!this.instance) {
      this.instance = new NavigatorManager();
    }

    return this.instance;
  };

  setSaveUrlParams = (saveId: string): void => {
    const url = new URL(window.location.href);
    url.searchParams.set("save", saveId);
    window.history.pushState({}, "", url.toString());
  };

  clearSaveUrlParams = (): void => {
    const url = new URL(window.location.href);
    url.searchParams.delete("save");
    window.history.pushState({}, "", url.toString());
  };
}
