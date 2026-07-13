import { useRegisterSW } from "virtual:pwa-register/vue";
import { onUnmounted, ref, watch } from "vue";

export function useAtualizarVersao() {
  const DEFAULT_PERIODO = 5 * 60 * 1000;
  const periodo = DEFAULT_PERIODO;

  const swAtivado = ref(false);
  const contador = ref(2);
  let intervalId: number | null = null;

  function registrarSincPeriodica(
    swUrl: string,
    r: ServiceWorkerRegistration,
    periodoArg?: number,
  ) {
    const tempo = periodoArg ?? periodo;
    if (!tempo || tempo <= 0) return;

    setInterval(async () => {
      if ("onLine" in navigator && !navigator.onLine) return;

      const resp = await fetch(swUrl, {
        cache: "no-store",
        headers: {
          cache: "no-store",
          "cache-control": "no-cache",
        },
      });

      if (resp?.status === 200) await r.update();
    }, periodo);
  }

  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    immediate: true,

    onRegisteredSW(swUrl, r) {
      if (periodo <= 0) return;
      if (r?.active?.state === "activated") {
        swAtivado.value = true;
        registrarSincPeriodica(swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target as ServiceWorker;
          swAtivado.value = sw.state === "activated";
          if (swAtivado.value) registrarSincPeriodica(swUrl, r);
        });
      }
    },
  });

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
  });

  const CHAVE_ATUALIZANDO = "ce_atualizando";

  async function executarAtualizacao() {
    sessionStorage.setItem(CHAVE_ATUALIZANDO, "1");

    updateServiceWorker(true);

    const reg = await navigator.serviceWorker.ready;
    const swEspera = reg.waiting;
    if (!swEspera) {
      window.location.reload();
      return;
    }

    let recarregou = false;

    if (swEspera.state === "activated") {
      window.location.reload();
      return;
    }

    swEspera.addEventListener("statechange", () => {
      if (swEspera.state === "activated" && !recarregou) {
        recarregou = true;
        window.location.reload();
      }
    });

    swEspera.postMessage({ type: "SKIP_WAITING" });

    setTimeout(() => {
      if (!recarregou) {
        recarregou = true;
        window.location.reload();
      }
    }, 5000);
  }

  watch(
    needRefresh,
    (ativo) => {
      if (!ativo) {
        contador.value = 2;
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        return;
      }

      if (sessionStorage.getItem(CHAVE_ATUALIZANDO)) {
        sessionStorage.removeItem(CHAVE_ATUALIZANDO);
        needRefresh.value = false;
        return;
      }

      contador.value = 2;

      intervalId = window.setInterval(() => {
        contador.value--;

        if (contador.value <= 0) {
          clearInterval(intervalId!);
          intervalId = null;
          executarAtualizacao();
        }
      }, 1000);
    },
    { immediate: true },
  );

  return {
    offlineReady,
    needRefresh,
    swAtivado,
    periodo,
    contador,
    updateServiceWorker,
    registrarSincPeriodica,
  };
}
