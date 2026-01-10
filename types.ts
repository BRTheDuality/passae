
export type QuestionType = 'rapida' | 'simulado' | 'original';

export interface Question {
  id: string;

  // 🔹 Referências
  concurso: string;
  cargo: string;
  materia: string;

  // 🔹 Tipo de menu
  menu: QuestionType;

  // 🔹 Conteúdo
  enunciado: string;

  alternativas?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };

  // 🔹 Resposta correta
  resposta: 'SIM' | 'NAO' | 'A' | 'B' | 'C' | 'D';

  // 🔹 Explicação
  comentario: string;
}

export interface PerformanceStats {
  totalRespondidas: number;
  acertos: number;
  erros: number;

  porMateria: Record<
    string,
    {
      acertos: number;
      erros: number;
    }
  >;
}

export interface Concurso {
  id: string;

  nome: string;

  // 🔹 Aceita exatamente o que vem do Firebase
  tipo: 'nacional' | 'estado' | 'municipio';

  // 🔹 SEMPRE array (blindagem contra crash)
  cargos: string[];
}
