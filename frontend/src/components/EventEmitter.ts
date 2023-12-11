export class EventEmitter {
  private listeners: { [event: string]: ((data: unknown) => void)[] } = {};

  public on(event: string, callback: (data: unknown) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public emit(event: string, data: unknown): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        listener(data);
      });
    }
  }

  public subscribe(callback: (data: unknown) => void): {
    unsubscribe: () => void;
  } {
    this.on("message", callback);
    return {
      unsubscribe: () => {
        this.listeners["message"] = this.listeners["message"].filter(
          (listener) => listener !== callback
        );
      },
    };
  }
}
