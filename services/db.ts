
import { 
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp
} from 'firebase/firestore/lite';
import { GoogleGenAI } from "@google/genai";

import { db } from '../firebase';
import { Question, PerformanceStats, QuestionType, Concurso } from '../types';

/**
 * Helper para embaralhar um array (Algoritmo Fisher-Yates)
 */
const shuffle = <T>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

/* =========================
   CONCURSOS
========================= */
export const getConcursos = async (): Promise<Concurso[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'concursos'));
    const data = snapshot.docs.map(doc => {
      const docData = doc.data();
      return {
        id: doc.id,
        nome: docData.nome || 'Concurso sem nome',
        tipo: docData.tipo || 'nacional',
        cargos: Array.isArray(docData.cargos) ? docData.cargos : []
      } as Concurso;
    });
    return data;
  } catch (error) {
    console.error("Erro ao buscar concursos:", error);
    return [];
  }
};

/* =========================
   QUESTÕES (SORTEIO DE 10 QUESTÕES EQUILIBRADO)
========================= */
export const getQuestions = async (
  concurso: string,
  cargo: string,
  menu: QuestionType,
  materia?: string
): Promise<Question[]> => {
  try {
    const params = {
      concurso: concurso.trim(),
      cargo: cargo.trim(),
      menu: menu.trim(),
      materia: materia?.trim()
    };

    console.log("🔍 Buscando base de questões:", params);

    let constraints = [
      where('concurso', '==', params.concurso),
      where('cargo', '==', params.cargo),
      where('menu', '==', params.menu)
    ];

    if (params.materia) {
      constraints.push(where('materia', '==', params.materia));
    }

    const q = query(collection(db, 'questoes'), ...constraints);
    const snapshot = await getDocs(q);
    
    let results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Question)
    }));

    // --- LÓGICA PARA QUESTÕES RÁPIDAS (LIMITE DE 10 E DISTRIBUIÇÃO PROPORCIONAL) ---
    if (params.menu === 'rapida' && results.length > 0) {
      const LIMITE_QUESTOES = 10;
      
      // 1. Agrupar por matéria para garantir diversidade
      const porMateria: Record<string, Question[]> = {};
      results.forEach(quest => {
        const mat = quest.materia || 'Geral';
        if (!porMateria[mat]) porMateria[mat] = [];
        porMateria[mat].push(quest);
      });

      // 2. Embaralhar individualmente cada matéria
      const chavesMaterias = Object.keys(porMateria);
      chavesMaterias.forEach(m => {
        porMateria[m] = shuffle(porMateria[m]);
      });

      const selecaoFinal: Question[] = [];
      let materiasComQuestoes = [...chavesMaterias];
      let pointer = 0;

      // 3. Distribuição Equilibrada (Round-Robin)
      // Vai pegando uma de cada matéria até atingir 10 ou acabar o estoque total
      while (selecaoFinal.length < LIMITE_QUESTOES && materiasComQuestoes.length > 0) {
        const materiaAtual = materiasComQuestoes[pointer % materiasComQuestoes.length];
        const questao = porMateria[materiaAtual].pop();

        if (questao) {
          selecaoFinal.push(questao);
        }

        // Se as questões dessa matéria acabaram, removemos da lista de rotação
        if (porMateria[materiaAtual].length === 0) {
          materiasComQuestoes.splice(pointer % materiasComQuestoes.length, 1);
        } else {
          pointer++;
        }
      }

      console.log(`🎯 Sorteio Rápido concluído: ${selecaoFinal.length} questões selecionadas.`);
      return shuffle(selecaoFinal); // Embaralha a ordem final para o usuário
    }

    return results;
  } catch (error) {
    console.error("❌ Erro ao buscar questões:", error);
    return [];
  }
};

/* =========================
   PERFORMANCE
========================= */
export const savePerformance = async (
  materia: string,
  isCorrect: boolean
) => {
  const stats = getPerformance();
  stats.totalRespondidas++;

  if (isCorrect) stats.acertos++;
  else stats.erros++;

  if (!stats.porMateria[materia]) {
    stats.porMateria[materia] = { acertos: 0, erros: 0 };
  }

  if (isCorrect) stats.porMateria[materia].acertos++;
  else stats.porMateria[materia].erros++;

  localStorage.setItem('passaae_performance', JSON.stringify(stats));

  try {
    await addDoc(collection(db, 'performance'), {
      materia,
      correta: isCorrect,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.warn("Erro ao salvar performance:", error);
  }
};

export const getPerformance = (): PerformanceStats => {
  const data = localStorage.getItem('passaae_performance');
  if (!data) {
    return { totalRespondidas: 0, acertos: 0, erros: 0, porMateria: {} };
  }
  return JSON.parse(data);
};

/* =========================
   AI SERVICE (Gemini 3 Pro)
========================= */
export const getAIExplanation = async (enunciado: string, resposta: string, comentario: string): Promise<string> => {
  try {
    // Inicialização segura conforme diretrizes do SDK
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Modelo Gemini 3 Pro para máxima qualidade nas explicações acadêmicas
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Você é um tutor acadêmico especialista em concursos públicos. 
Explique de forma clara e objetiva por que a alternativa correta é "${resposta}".
Questão: ${enunciado}
Comentário base: ${comentario}`,
    });

    return response.text || "Não foi possível gerar a explicação automatizada.";
  } catch (error) {
    console.error("Erro na AI Service:", error);
    return "O Tutor IA está descansando. Tente novamente em alguns minutos!";
  }
};
