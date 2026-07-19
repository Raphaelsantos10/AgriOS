export type AppEventMap = {
  "field.created": { fieldId: string; farmId: string };
  "field.updated": { fieldId: string; farmId: string };
  "field.deleted": { fieldId: string; farmId: string };
  "mission.created": { missionId: string; farmId: string };
  "mission.updated": { missionId: string; farmId: string };
  "mission.completed": { missionId: string; farmId: string };
  "notification.created": { notificationId: string };
};

type EventName = keyof AppEventMap;
type EventHandler<K extends EventName> = (payload: AppEventMap[K]) => void;

class EventBus {
  private listeners = new Map<EventName, Set<(payload: unknown) => void>>();

  on<K extends EventName>(eventName: K, handler: EventHandler<K>): () => void {
    const handlers = this.listeners.get(eventName) ?? new Set();
    handlers.add(handler as (payload: unknown) => void);
    this.listeners.set(eventName, handlers);

    return () => this.off(eventName, handler);
  }

  off<K extends EventName>(eventName: K, handler: EventHandler<K>): void {
    const handlers = this.listeners.get(eventName);
    if (!handlers) return;

    handlers.delete(handler as (payload: unknown) => void);
    if (handlers.size === 0) this.listeners.delete(eventName);
  }

  emit<K extends EventName>(eventName: K, payload: AppEventMap[K]): void {
    const handlers = this.listeners.get(eventName);
    if (!handlers) return;

    for (const handler of handlers) {
      try {
        handler(payload);
      } catch (error) {
        console.error(`[EventBus] Falha no evento ${eventName}`, error);
      }
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const eventBus = new EventBus();
