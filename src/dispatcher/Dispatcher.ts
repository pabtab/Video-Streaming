import type { Action } from "../actions/types";

type Callback = (action: Action) => void;

class Dispatcher {
  private listeners: Array<Callback> = [];

  public register(callback: Callback) {
    this.listeners.push(callback);
  }

  public dispatch(action: Action): void {
    this.listeners.forEach((listener) => listener(action));
  }
}

export const dispatcher = new Dispatcher();
