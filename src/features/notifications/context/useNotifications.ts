import { useContext } from "react";
import { NotificationContext } from "./notificationContext";

export function useNotifications() {
  const value = useContext(NotificationContext);
  if (!value) {
    throw new Error("useNotifications deve ser usado dentro de NotificationProvider.");
  }
  return value;
}
