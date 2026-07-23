import { NotificationProvider, NotificationViewport } from "../features/notifications";
import { ToastProvider } from "../design-system";

type Props = { children: React.ReactNode };

export function Providers({ children }: Props) {
  return (
    <ToastProvider>
      <NotificationProvider>
        {children}
        <NotificationViewport />
      </NotificationProvider>
    </ToastProvider>
  );
}
