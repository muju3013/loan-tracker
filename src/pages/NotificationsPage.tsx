import { useNotifications } from "../hooks/useNotifications";
import { format } from "date-fns";
import { Bell, CheckCircle, Clock, Calendar, AlertTriangle, Check } from "lucide-react";

export function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  const getIconForType = (type: string) => {
    switch (type) {
      case "reminder_7d":
        return <Calendar className="w-5 h-5 text-blue-400" />;
      case "reminder_3d":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "due_today":
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case "overdue":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-brand-400" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 dark:from-brand-400 dark:to-brand-300 bg-clip-text text-transparent">
            Notification Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Stay on top of your EMI schedules
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 text-brand-700 dark:text-brand-300 text-sm font-medium rounded-xl transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] text-center">
            <div className="w-16 h-16 bg-brand-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-brand-400 dark:text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No notifications yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mt-2">
              When you have upcoming EMIs, we'll remind you here.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`group relative flex gap-4 p-5 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  notification.isRead
                    ? "bg-white/40 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50 opacity-70"
                    : "bg-white/80 dark:bg-slate-800/80 border-brand-200 dark:border-brand-500/30 shadow-lg shadow-brand-500/5"
                }`}
              >
                {!notification.isRead && (
                  <div className="absolute top-0 right-0 w-2 h-2 mt-5 mr-5 rounded-full bg-brand-500 animate-pulse" />
                )}
                
                <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-700`}>
                  {getIconForType(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className={`text-base font-semibold ${notification.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-slate-100'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {notification.createdAt ? format(new Date(notification.createdAt), "MMM d, h:mm a") : 'Unknown time'}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${notification.isRead ? 'text-slate-500 dark:text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                    {notification.message}
                  </p>
                </div>

                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 ml-2 self-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-brand-500 transition-all focus:opacity-100"
                    title="Mark as read"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
