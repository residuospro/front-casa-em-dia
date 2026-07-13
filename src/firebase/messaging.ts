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
  if (!("Notification" in window)) return false;
  if (!("serviceWorker" in navigator)) return false;
  if (!("PushManager" in window)) return false;

  return isSupported();
}

export async function obterTokenFCM(): Promise<string | null> {
  const instance = getMessagingInstance();

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );

  const token = await getToken(instance, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  return token ?? null;
}

export function onForegroundMessage(
  callback: (payload: MessagePayload) => void,
): void {
  const instance = getMessagingInstance();
  onMessage(instance, callback);
}
