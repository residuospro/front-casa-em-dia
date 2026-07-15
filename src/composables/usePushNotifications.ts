import { ref, readonly } from "vue";
import {
  isFirebaseMessagingSupported,
  obterTokenFCM,
  onForegroundMessage,
} from "@/firebase/messaging";
import type { MessagePayload } from "firebase/messaging";
import { enviarTokenPush } from "@/api/useApiEnviarTokenPush";

const suporte = ref(false);
const status = ref<NotificationPermission | null>(null);
const token = ref<string | null>(null);
const erro = ref<string | null>(null);
const carregando = ref(false);

export function usePushNotifications() {
  async function verificarSuporte(): Promise<boolean> {
    if (suporte.value) return true;

    suporte.value = await isFirebaseMessagingSupported();

    return suporte.value;
  }

  async function registrarDispositivo(): Promise<boolean> {
    erro.value = null;
    carregando.value = true;

    try {
      const temSuporte = await verificarSuporte();
      if (!temSuporte) {
        erro.value = "Push notifications não são suportadas neste navegador";

        return false;
      }

      status.value = Notification.permission;

      if (Notification.permission === "denied") {
        erro.value = "Permissão de notificação negada";

        return false;
      }

      if (Notification.permission === "default") {
        status.value = await Notification.requestPermission();

        if (status.value !== "granted") {
          return false;
        }
      }

      const fcmToken = await obterTokenFCM();

      if (!fcmToken) {
        erro.value = "Falha ao obter token FCM";

        return false;
      }

      token.value = fcmToken;

      await enviarTokenPush(fcmToken);

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      erro.value = message;

      return false;
    } finally {
      carregando.value = false;
    }
  }

  function onForegroundMessageHandler(
    callback: (payload: MessagePayload) => void,
  ): void {
    onForegroundMessage(callback);
  }

  return {
    suporte: readonly(suporte),
    status: readonly(status),
    token: readonly(token),
    erro: readonly(erro),
    carregando: readonly(carregando),
    verificarSuporte,
    registrarDispositivo,
    onForegroundMessage: onForegroundMessageHandler,
  };
}
