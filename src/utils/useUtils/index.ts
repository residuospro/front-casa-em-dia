export const useUtils = () => {
  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    });
  };

  const idadeFormatada = (idadeAtual: number | null): number => {
    if (!idadeAtual) return 0;

    const anos = Math.floor(idadeAtual);

    return anos;
  };

  const parseFotoPerfil = (foto: string) => {
    if (foto.startsWith("https")) return foto;

    return import.meta.env.VITE_API_URL + foto;
  };

  const parsePermissao = (permissao: "ADMIN" | "USUARIO") => {
    return permissao === "ADMIN" ? "Administrador" : "Usuário";
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

  return {
    formatarData,
    idadeFormatada,
    parseFotoPerfil,
    parsePermissao,
    setarFormDataDependente,
  };
};
