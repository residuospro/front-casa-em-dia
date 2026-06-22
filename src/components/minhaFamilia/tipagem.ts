interface IFamiliaPessoa {
  id: string;
  usuarioId: string;
  familiaId: string;
  nome: string;
  tipoPessoa: "MARIDO" | "ESPOSA" | "FILHO" | "OUTRO"; // ajuste conforme seu domínio
  permissao: "ADMIN" | "USUARIO"; // ajuste conforme sua regra
  dependente: boolean;
  conviteEnviado: boolean;
  fotoPerfil?: string;
  criadoEm: string;
  usuario: IUsuario;
  genero: "MASCULINO" | "FEMININO" | "OUTRO";
  status: "ACEITO" | "PENDENTE" | "RECUSADO";
}

interface IUsuario {
  id: string;
  nome: string;
  email: string;
  fotoPerfil: string | null;
  genero: "MASCULINO" | "FEMININO" | "OUTRO";
}

interface IFamilia {
  id: string;
  nome: string;
}

export type { IFamiliaPessoa, IUsuario, IFamilia };
