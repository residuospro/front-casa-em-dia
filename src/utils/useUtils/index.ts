import type { StatusExecucao } from "../tipagem";

export const useUtils = () => {
  const formatarData = (data: string, comHora: boolean = true) => {
    if (comHora) {
      return new Date(data).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return new Date(data).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const idadeFormatada = (idadeAtual: number | null): number => {
    if (!idadeAtual) return 0;

    const anos = Math.floor(idadeAtual);

    return anos;
  };

  const parseFotoPerfil = (foto: string) => {
    if (!foto) return "";
    if (foto.startsWith("data:") || foto.startsWith("https")) return foto;
    return import.meta.env.VITE_API_URL + foto;
  };

  const parsePermissao = (permissao: "ADMIN" | "USUARIO") => {
    return permissao === "ADMIN" ? "Administrador" : "Usuário";
  };

  const criarDataLocal = (valor: string | Date) => {
    if (valor instanceof Date) {
      return new Date(valor);
    }

    // yyyy-MM-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      const [ano = 0, mes = 0, dia = 0] = valor.split("-").map(Number);

      return new Date(ano, mes - 1, dia);
    }

    // ISO
    return new Date(valor);
  };

  const criarExecucoes = (
    start: [string, ...string[]],
    end: [string, ...string[]] | undefined,
    horario: string,
  ) => {
    if (!start.length) return [];

    const inicio = criarDataLocal(start[0]);

    const fim = end?.length ? criarDataLocal(end[0]) : criarDataLocal(start[0]);

    const [hora = 0, minuto = 0] = horario.split(":").map(Number);

    const execucoes = [];

    const dataAtual = new Date(inicio);

    while (dataAtual <= fim) {
      const data = new Date(dataAtual);

      data.setHours(hora, minuto, 0, 0);

      execucoes.push({
        data: data.toISOString(),
        status: "AGENDADA" as StatusExecucao,
        pontosObtidos: null,
      });

      dataAtual.setDate(dataAtual.getDate() + 1);
    }

    return execucoes;
  };

  const setarFormDataDependente = (dependente: {
    nome: string;
    genero: string;
    tipoPessoa: string;
    fotoPerfil: string;
  }) => {
    const formData = new FormData();

    formData.append("nome", dependente.nome);
    formData.append("genero", dependente.genero);
    formData.append("tipoPessoa", dependente.tipoPessoa);
    formData.append("fotoPerfil", dependente.fotoPerfil);

    return formData;
  };

  const formatarReal = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formartarValor = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    const reais = numeros ? Number(numeros) / 100 : 0;
    return reais;
  };

  return {
    formatarData,
    idadeFormatada,
    parseFotoPerfil,
    parsePermissao,
    setarFormDataDependente,
    criarDataLocal,
    criarExecucoes,
    formartarValor,
    formatarReal,
  };
};
