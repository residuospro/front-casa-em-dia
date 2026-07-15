import { useClient } from "@/client";

export async function enviarTokenPush(token: string): Promise<void> {
  await useClient.post("/notifications/push-subscribe", {
    token,
    platform: "fcm",
  });
}
