import { useState, useEffect } from "react";
import { AppNotification } from "../types";
import { NotificationService } from "../services/notificationService";
import { useAuth } from "./useAuth";

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Start listening for foreground messages
    NotificationService.setupForegroundListener();
    
    // Request permission (in a real app, this might be triggered by a user action)
    NotificationService.requestPermissionAndGetToken();

    const unsubscribe = NotificationService.subscribeToNotifications(user.id, (data) => {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    });

    return () => unsubscribe();
  }, [user]);

  return {
    notifications,
    unreadCount,
    markAsRead: (id: string) => user && NotificationService.markAsRead(user.id, id),
    markAllAsRead: () => user && NotificationService.markAllAsRead(user.id),
  };
}
