import { createContext } from "react";
import type { AppNotification, PushNotificationInput } from "../types/notification";

export type NotificationContextValue = {
  notifications: AppNotification[];
  push: (input: PushNotificationInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

export const NotificationContext = createContext<NotificationContextValue | null>(null);
