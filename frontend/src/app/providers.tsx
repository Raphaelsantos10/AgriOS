import { NotificationProvider, NotificationViewport } from "../features/notifications";

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <NotificationProvider>
      {children}
      <NotificationViewport />
    </NotificationProvider>
  );
}
