import { NotificationProvider, NotificationViewport } from "../features/notifications";
import SupportAssistant from "../features/support/SupportAssistant";

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <NotificationProvider>
      {children}
      <NotificationViewport />
      <SupportAssistant />
    </NotificationProvider>
  );
}
