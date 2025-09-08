import type { NavigatorManagerInterface } from "./NavigatorTypes";

export default class NavigatorManager implements NavigatorManagerInterface {
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
