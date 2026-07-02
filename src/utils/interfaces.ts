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
}

export type { IResponseError, IOpcoes };
