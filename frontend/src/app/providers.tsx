import { NotificationProvider, NotificationViewport } from "../features/notifications";
import SupportAssistant from "../features/support/SupportAssistant";
import { ToastProvider } from "../design-system";

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
      <ToastProvider><NotificationProvider>
        {children}
        <NotificationViewport />
        <SupportAssistant />
      </NotificationProvider></ToastProvider>
  );
}
