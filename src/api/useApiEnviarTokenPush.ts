import { useClient } from "@/client";

export async function enviarTokenPush(token: string): Promise<void> {
  console.log("[FCM Debug] POST /notifications/push-subscribe com token:", token.substring(0, 30) + "...");
  const response = await useClient.post("/notifications/push-subscribe", {
    token,
    platform: "fcm",
  });
  console.log("[FCM Debug] Resposta do backend:", response);
}
