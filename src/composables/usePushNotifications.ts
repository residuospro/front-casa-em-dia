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
    console.log("[FCM Debug] Suporte a messaging:", suporte.value);
    return suporte.value;
  }

  async function registrarDispositivo(): Promise<boolean> {
    erro.value = null;
    carregando.value = true;

    try {
      console.log("[FCM Debug] Verificando suporte...");
      const temSuporte = await verificarSuporte();
      if (!temSuporte) {
        erro.value = "Push notifications não são suportadas neste navegador";
        console.log("[FCM Debug] Sem suporte, abortando.");
        return false;
      }

      console.log("[FCM Debug] Permissão atual:", Notification.permission);
      status.value = Notification.permission;

      if (Notification.permission === "denied") {
        erro.value = "Permissão de notificação negada";
        console.log("[FCM Debug] Permissão negada pelo usuário.");
        return false;
      }

      if (Notification.permission === "default") {
        console.log("[FCM Debug] Solicitando permissão...");
        status.value = await Notification.requestPermission();
        console.log("[FCM Debug] Permissão após request:", status.value);
        if (status.value !== "granted") {
          console.log("[FCM Debug] Permissão não concedida.");
          return false;
        }
      }

      console.log("[FCM Debug] Obtendo token FCM...");
      const fcmToken = await obterTokenFCM();
      console.log("[FCM Debug] Token obtido:", fcmToken ? fcmToken.substring(0, 30) + "..." : "null");

      if (!fcmToken) {
        erro.value = "Falha ao obter token FCM";
        console.log("[FCM Debug] Token nulo, abortando.");
        return false;
      }

      token.value = fcmToken;
      console.log("[FCM Debug] Enviando token para backend...");
      await enviarTokenPush(fcmToken);
      console.log("[FCM Debug] Token enviado com sucesso!");

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      erro.value = message;
      console.error("[FCM Debug] Erro no registro:", err);

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
