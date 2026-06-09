import { collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy, onSnapshot } from "firebase/firestore";
import { db, messaging } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";
import { AppNotification, NotificationType, Loan, EmiInstallment } from "../types";
import { differenceInDays, isSameDay, startOfDay } from "date-fns";

export class NotificationService {
  // private static VAPID_KEY = "BNyqX_...YOUR_VAPID_KEY"; // Optional, usually better to provide this

  static async requestPermissionAndGetToken() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const msg = await messaging();
        if (msg) {
          const token = await getToken(msg, {
            // vapidKey: this.VAPID_KEY
          });
          if (token) {
            // In a real app, save token to the user's document in Firestore
            console.log("FCM Token:", token);
          }
        }
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  }

  static setupForegroundListener() {
    messaging().then(msg => {
      if (msg) {
        onMessage(msg, (payload) => {
          console.log("Message received. ", payload);
          // Can show a toast here
          const title = payload.notification?.title || 'Notification';
          const options = {
            body: payload.notification?.body,
            icon: '/vite.svg'
          };
          if (Notification.permission === 'granted') {
            new Notification(title, options);
          }
        });
      }
    });
  }

  static async showLocalSystemNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification(title, {
        body,
        icon: '/vite.svg',
      });
    }
  }

  static subscribeToNotifications(userId: string, callback: (notifications: AppNotification[]) => void) {
    const q = query(
      collection(db, "users", userId, "notifications"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AppNotification[];
      callback(notifications);
    });
  }

  static async markAsRead(userId: string, notificationId: string) {
    const docRef = doc(db, "users", userId, "notifications", notificationId);
    await updateDoc(docRef, { isRead: true });
  }

  static async markAllAsRead(userId: string) {
    const q = query(
      collection(db, "users", userId, "notifications"),
      where("isRead", "==", false)
    );
    const snapshot = await getDocs(q);
    const promises = snapshot.docs.map(d => updateDoc(doc(db, "users", userId, "notifications", d.id), { isRead: true }));
    await Promise.all(promises);
  }

  static async generateReminders(userId: string, loans: Loan[], emiSchedule: EmiInstallment[]) {
    // Determine which notifications to create based on schedule
    const today = startOfDay(new Date());
    
    // Fetch today's existing notifications to avoid duplicate generation
    const q = query(
      collection(db, "users", userId, "notifications")
    );
    const snapshot = await getDocs(q);
    const existing = snapshot.docs.map(d => d.data() as AppNotification);

    const newNotifications: Partial<AppNotification>[] = [];

    emiSchedule.forEach(emi => {
      if (emi.status === "paid") return;

      const loan = loans.find(l => l.id === emi.loanId);
      if (!loan) return;

      const dueDate = startOfDay(new Date(emi.effectiveDueDate));
      const daysDiff = differenceInDays(dueDate, today);

      let type: NotificationType | null = null;
      let title = "";
      let message = "";

      if (daysDiff === 7) {
        type = "reminder_7d";
        title = "Upcoming EMI";
        message = `${loan.loanName} EMI ₹${emi.emiAmount} is due in 7 days`;
      } else if (daysDiff === 3) {
        type = "reminder_3d";
        title = "EMI Reminder";
        message = `Reminder: ${loan.loanName} EMI ₹${emi.emiAmount} is due in 3 days`;
      } else if (daysDiff === 0) {
        type = "due_today";
        title = "EMI Due Today";
        message = `Your EMI payment of ₹${emi.emiAmount} is due today`;
      } else if (daysDiff < 0) {
        type = "overdue";
        title = "EMI Overdue";
        const overdueDays = Math.abs(daysDiff);
        message = `EMI payment overdue by ${overdueDays} days`;
      }

      if (type) {
        // For overdue, we want to create one daily. But for others, just one ever for that EMI.
        // Let's create a unique key based on type + emiId.
        // Actually, for overdue, maybe we check if there's already an overdue notification created TODAY.
        const alreadyExists = existing.some(n => {
          if (n.relatedEmiId !== emi.id) return false;
          if (type === "overdue") {
            // Check if there is an overdue notification created today
            if (!n.createdAt) return false;
            const createdDate = startOfDay(new Date(n.createdAt));
            return n.type === "overdue" && isSameDay(createdDate, today);
          }
          // For other types, just check if it was ever created
          return n.type === type;
        });

        if (!alreadyExists) {
          newNotifications.push({
            userId,
            title,
            message,
            type,
            relatedLoanId: loan.id,
            relatedEmiId: emi.id,
            isRead: false,
            createdAt: new Date().toISOString()
          });
        }
      }
    });

    // Create the notifications
    for (const notif of newNotifications) {
      await addDoc(collection(db, "users", userId, "notifications"), notif);
      // Trigger a local system notification for the user
      await this.showLocalSystemNotification(notif.title!, notif.message!);
    }
  }
}
