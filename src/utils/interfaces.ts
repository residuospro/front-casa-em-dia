interface IResponseError {
  response: {
    data: {
      message: string | string[];
    };
    status: number;
  };
}

interface IOpcoes {
  text: string;
  value: string;
  fotoPerfil: string;
}

export type { IResponseError, IOpcoes };
