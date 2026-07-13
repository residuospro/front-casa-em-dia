importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCEUgC3ANhlVfc7FHoISxWp4BdAGpjYLqw",
  authDomain: "casa-em-dia-757a5.firebaseapp.com",
  projectId: "casa-em-dia-757a5",
  storageBucket: "casa-em-dia-757a5.firebasestorage.app",
  messagingSenderId: "323651728275",
  appId: "1:323651728275:web:dea92e23b0b22277cf6e66",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const titulo = payload.notification?.title || "Casa em Dia";
  const corpo = payload.notification?.body || "";
  const url = payload.data?.url || "/";

  self.registration.showNotification(titulo, {
    body: corpo,
    icon: "/pwa-192.png",
    data: { url },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    }),
  );
});
