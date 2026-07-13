import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  type Messaging,
  type MessagePayload,
} from "firebase/messaging";
import { getFirebaseApp } from ".";

let messaging: Messaging | null = null;

function getMessagingInstance(): Messaging {
  if (!messaging) {
    const app = getFirebaseApp();
    messaging = getMessaging(app);
  }

  return messaging;
}

export async function isFirebaseMessagingSupported(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.log("[FCM Debug] window.Notification não existe");
    return false;
  }
  if (!("serviceWorker" in navigator)) {
    console.log("[FCM Debug] serviceWorker não suportado");
    return false;
  }
  if (!("PushManager" in window)) {
    console.log("[FCM Debug] PushManager não existe");
    return false;
  }

  const supported = await isSupported();
  console.log("[FCM Debug] firebase/messaging isSupported:", supported);
  return supported;
}

export async function obterTokenFCM(): Promise<string | null> {
  const instance = getMessagingInstance();
  console.log("[FCM Debug] Registrando service worker...");

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );
  console.log("[FCM Debug] Service worker registrado:", registration.scope);

  console.log("[FCM Debug] Chamando getToken...");
  const token = await getToken(instance, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
  console.log("[FCM Debug] getToken retornou:", token ? "token ok" : "null");

  return token ?? null;
}

export function onForegroundMessage(
  callback: (payload: MessagePayload) => void,
): void {
  const instance = getMessagingInstance();
  console.log("[FCM Debug] Listener de foreground message registrado");
  onMessage(instance, callback);
}
