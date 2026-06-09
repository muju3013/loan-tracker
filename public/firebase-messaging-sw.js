importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyC86hIX1Naskfk1Fv3PP0VeACXSuUHl6ZQ",
  authDomain: "loanemi-f359c.firebaseapp.com",
  projectId: "loanemi-f359c",
  storageBucket: "loanemi-f359c.firebasestorage.app",
  messagingSenderId: "417271382128",
  appId: "1:417271382128:web:6ca84cdeab04846e9c74b5"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification?.title || 'EMI Reminder';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/vite.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
