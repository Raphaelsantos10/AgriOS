import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

import { useNotifications } from "../context/useNotifications";
import type { NotificationTone } from "../types/notification";

const iconByTone = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
} satisfies Record<NotificationTone, typeof Info>;

const classByTone = {
  success: "border-emerald-400/30 bg-emerald-950/95 text-emerald-100",
  info: "border-sky-400/30 bg-sky-950/95 text-sky-100",
  warning: "border-amber-400/30 bg-amber-950/95 text-amber-100",
  error: "border-red-400/30 bg-red-950/95 text-red-100",
} satisfies Record<NotificationTone, string>;

export default function NotificationViewport() {
  const { notifications, dismiss } = useNotifications();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[2000] grid w-[min(92vw,380px)] gap-3">
      {notifications.map((notification) => {
        const Icon = iconByTone[notification.tone];
        return (
          <article key={notification.id} className={`pointer-events-auto rounded-2xl border p-4 shadow-2xl backdrop-blur ${classByTone[notification.tone]}`} role="status">
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 shrink-0" size={20} />
              <div className="min-w-0 flex-1">
                <p className="font-bold">{notification.title}</p>
                {notification.message ? <p className="mt-1 text-sm opacity-80">{notification.message}</p> : null}
              </div>
              <button type="button" onClick={() => dismiss(notification.id)} className="rounded-lg p-1 opacity-70 transition hover:bg-white/10 hover:opacity-100" aria-label="Fechar notificação">
                <X size={16} />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
