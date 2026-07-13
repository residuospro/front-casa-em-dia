import { useRegisterSW } from "virtual:pwa-register/vue";
import { onUnmounted, ref, watch } from "vue";

export function useAtualizarVersao() {
  const PERIODO_PADRAO = 5 * 60 * 1000; // 5 minutos

  const swAtivado = ref(false);
  const contador = ref(2);
  const needRefresh = ref(false); // we'll get it from the hook

  let checkInterval: number | null = null;
  let countdownInterval: number | null = null;

  const {
    offlineReady,
    needRefresh: needRefreshFromHook,
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,

    onRegisteredSW(swUrl, r) {
      if (!r) return;

      // Activate flag
      const activateSW = (state: string) => {
        swAtivado.value = state === "activated";
      };

      if (r.active?.state === "activated") {
        swAtivado.value = true;
        startPeriodicCheck(swUrl, r);
      } else if (r.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target as ServiceWorker;
          activateSW(sw.state);
          if (sw.state === "activated") {
            startPeriodicCheck(swUrl, r);
          }
        });
      }
    },
  });

  // Sync the reactive ref
  watch(needRefreshFromHook, (val) => {
    needRefresh.value = val;
  });

  function startPeriodicCheck(
    swUrl: string,
    registration: ServiceWorkerRegistration,
  ) {
    if (checkInterval) clearInterval(checkInterval);

    checkInterval = window.setInterval(async () => {
      if (!navigator.onLine) return;

      try {
        const resp = await fetch(swUrl, {
          cache: "no-store",
          headers: {
            "cache-control": "no-cache",
          },
        });

        if (resp.status === 200) {
          await registration.update();
        }
      } catch (err) {
        // Silent fail - network error or SW not found is common
        console.debug("Periodic SW check failed:", err);
      }
    }, PERIODO_PADRAO);
  }

  // Countdown when update is available
  watch(
    needRefresh,
    (hasUpdate) => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }

      if (!hasUpdate) {
        contador.value = 2;
        return;
      }

      contador.value = 2;

      countdownInterval = window.setInterval(() => {
        contador.value--;

        if (contador.value <= 0) {
          clearInterval(countdownInterval!);
          countdownInterval = null;
          updateServiceWorker(true);
          needRefresh.value = false;
        }
      }, 1000);
    },
    { immediate: true },
  );

  onUnmounted(() => {
    if (checkInterval) clearInterval(checkInterval);
    if (countdownInterval) clearInterval(countdownInterval);
  });

  return {
    offlineReady,
    needRefresh,
    swAtivado,
    contador,
    updateServiceWorker,
    // Optional: expose manual check
    checkForUpdate: async () => {
      // You can call this from UI if needed
    },
  };
}
