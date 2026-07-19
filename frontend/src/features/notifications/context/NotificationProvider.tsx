import { useCallback, useMemo, useState } from "react";

import { NotificationContext } from "./notificationContext";
import type { AppNotification, PushNotificationInput } from "../types/notification";

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const push = useCallback(
    (input: PushNotificationInput) => {
      const id = crypto.randomUUID();
      const item: AppNotification = {
        ...input,
        id,
        createdAt: Date.now(),
        durationMs: input.durationMs ?? 4500,
      };

      setNotifications((current) => [item, ...current].slice(0, 5));
      window.setTimeout(() => dismiss(id), item.durationMs);
      return id;
    },
    [dismiss],
  );

  const clear = useCallback(() => setNotifications([]), []);

  const value = useMemo(
    () => ({ notifications, push, dismiss, clear }),
    [notifications, push, dismiss, clear],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
