/// <reference lib="webworker" />

import { precacheAndRoute } from "workbox-precaching";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import { firebaseConfig } from "./firebase/config";

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  const data = payload.data ?? {};

  const titulo = String(data.titulo ?? payload.notification?.title ?? "Casa em Dia");
  const mensagem = String(data.mensagem ?? payload.notification?.body ?? "");
  const imagem = data.imagem ? String(data.imagem) : undefined;
  const url = String(data.url ?? "/");
  const id = data.id ? String(data.id) : undefined;
  const execucaoId = data.execucaoId ? String(data.execucaoId) : undefined;

  const options: NotificationOptions & {
    data?: Record<string, unknown>;
    image?: string;
  } = {
    body: mensagem,
    icon: "/pwa-192.png",
    badge: "/maskable-icon.png",
    data: { url, id, execucaoId },
  };

  if (imagem) {
    options.image = imagem;
  }

  self.registration.showNotification(titulo, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data as Record<string, unknown> | undefined;
  const url = (data?.url as string) ?? "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            return client.focus();
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      }),
  );
});
