interface CpfResponse {
  code: number;
  data?: {
    cpf: string;
    nome: string;
    genero: string;
    data_nascimento: string;
  };
  message?: string;
}

export const consultarCPF = async (cpf: string): Promise<CpfResponse> => {
  try {
    const response = await fetch(`https://apicpf.com/api/consulta?cpf=${cpf}`, {
      headers: {
        'X-API-KEY': 'e05f3c3e6e7694f2c754c2724324baebf7d3f92ea2d0b0925df5cf368550c5e8',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Erro ao consultar CPF');
  }
}; 