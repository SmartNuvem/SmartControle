import { EventEmitter } from "node:events";

type ChangeEvent = {
  type: string;
  at: string;
};

const realtimeBus = new EventEmitter();
realtimeBus.setMaxListeners(1000);

export function publishEvent(type: string) {
  const payload: ChangeEvent = {
    type,
    at: new Date().toISOString(),
  };
  realtimeBus.emit("change", payload);
}

export function subscribeEvents(listener: (event: ChangeEvent) => void) {
  realtimeBus.on("change", listener);
  return () => {
    realtimeBus.off("change", listener);
  };
}

