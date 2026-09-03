import type { IndicadorOrcamento } from "@/utils/tipagem";
import type { DespesaPorCategoriaItem } from "./tipagem";

const CORES_CATEGORIA_PALETTE = [
  "#2f8a3b",
  "#246bb3",
  "#357bc0",
  "#f59e0b",
  "#d63b82",
  "#31aa8d",
  "#aaa",
];

export function getCorIndicadorOrcamento(
  indicador: IndicadorOrcamento,
): { cor: string; background: string; border: string; label: string } {
  switch (indicador) {
    case "NORMAL":
      return {
        cor: "#438b4d",
        background: "#edf8ef",
        border: "#b8d8bc",
        label: "Dentro do limite",
      };
    case "PROXIMO":
      return {
        cor: "#f59e0b",
        background: "#fff7e8",
        border: "#f5d68a",
        label: "Próximo do limite",
      };
    case "ULTRAPASSADO":
      return {
        cor: "#e53935",
        background: "#fff0f0",
        border: "#f5c6c6",
        label: "Ultrapassado",
      };
  }
}

export function getCorStatusMeta(status: string): string {
  switch (status) {
    case "EM_ANDAMENTO":
      return "#2f8a3b";
    case "CONCLUIDA":
      return "#31aa8d";
    case "CANCELADA":
      return "#aaa";
    default:
      return "#aaa";
  }
}

export function getLabelStatusMeta(status: string): string {
  switch (status) {
    case "EM_ANDAMENTO":
      return "Em andamento";
    case "CONCLUIDA":
      return "Concluída";
    case "CANCELADA":
      return "Cancelada";
    default:
      return status;
  }
}

export function getCoresDespesasPorCategoria(
  itens: DespesaPorCategoriaItem[],
): Map<string, string> {
  const mapa = new Map<string, string>();
  itens.forEach((item, i) => {
    const key = item.categoria?.id ?? "__sem__";
    mapa.set(
      key,
      item.categoria?.cor ?? CORES_CATEGORIA_PALETTE[i % CORES_CATEGORIA_PALETTE.length],
    );
  });
  return mapa;
}

export function formatarPeriodoLabel(periodo: string, granularidade: string): string {
  if (granularidade === "MES") {
    const [ano, mes] = periodo.split("-");
    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    return `${meses[Number(mes) - 1]}/${ano?.slice(2)}`;
  }
  const [ano, mes, dia] = periodo.split("-");
  return `${dia}/${mes}`;
}

export function getCorVariacao(valor: number): string {
  return valor >= 0 ? "#2f8a3b" : "#e52424";
}

export function getIconeVariacao(valor: number): string {
  return valor >= 0 ? "\u2197" : "\u2198";
}
