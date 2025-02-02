type Listener = () => void;

export class EventEmitter {
  private listeners: Array<Listener> = [];

  public subscribeComponent(listener: Listener) {
    console.log(listener);
    this.listeners.push(listener);
  }

  protected emit(): void {
    this.listeners.forEach((listener) => listener());
  }
}
