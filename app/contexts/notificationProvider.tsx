import {
  createContext,
  ReactNode,
  useContext,
  useState
} from "react";
import type {
  NotificationContextType
} from "~/types/notification";

const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  const value: NotificationContextType = {
    setUnreadCount,
    unreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
