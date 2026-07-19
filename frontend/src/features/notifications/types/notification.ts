export type NotificationTone = "success" | "info" | "warning" | "error";

export type AppNotification = {
  id: string;
  title: string;
  message?: string;
  tone: NotificationTone;
  createdAt: number;
  durationMs: number;
};

export type PushNotificationInput = Omit<
  AppNotification,
  "id" | "createdAt" | "durationMs"
> & {
  durationMs?: number;
};
