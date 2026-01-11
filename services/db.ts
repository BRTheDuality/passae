
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

const shuffle = <T>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const getConcursos = async (): Promise<Concurso[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'concursos'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      nome: doc.data().nome || 'Concurso sem nome',
      tipo: doc.data().tipo || 'nacional',
      cargos: Array.isArray(doc.data().cargos) ? doc.data().cargos : []
    } as Concurso));
  } catch (error) {
    console.error("Erro ao buscar concursos:", error);
    return [];
  }
};

export const getQuestions = async (
  concurso: string,
  cargo: string,
  menu: QuestionType,
  materia?: string
): Promise<Question[]> => {
  try {
    let constraints = [
      where('concurso', '==', concurso.trim()),
      where('cargo', '==', cargo.trim()),
      where('menu', '==', menu.trim())
    ];

    if (materia) {
      constraints.push(where('materia', '==', materia.trim()));
    }

    const q = query(collection(db, 'questoes'), ...constraints);
    const snapshot = await getDocs(q);
    
    // Fix: Explicitly mapping each field and using a typed array to resolve the 'unknown[]' and missing properties error
    const results: Question[] = snapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        concurso: data.concurso,
        cargo: data.cargo,
        materia: data.materia,
        menu: data.menu,
        enunciado: data.enunciado,
        alternativas: data.alternativas,
        resposta: data.resposta,
        comentario: data.comentario
      } as Question;
    });

    if (menu === 'rapida' && results.length > 0) {
      return shuffle(results).slice(0, 10);
    }

    return results;
  } catch (error) {
    console.error("❌ Erro ao buscar questões:", error);
    return [];
  }
};

export const savePerformance = async (
  materia: string,
  isCorrect: boolean
) => {
  const stats = getPerformance();
  stats.totalRespondidas++;
  if (isCorrect) stats.acertos++; else stats.erros++;
  if (!stats.porMateria[materia]) stats.porMateria[materia] = { acertos: 0, erros: 0 };
  if (isCorrect) stats.porMateria[materia].acertos++; else stats.porMateria[materia].erros++;

  localStorage.setItem('passaae_performance', JSON.stringify(stats));

  try {
    await addDoc(collection(db, 'performance'), {
      materia,
      correta: isCorrect,
      createdAt: serverTimestamp()
    });
  } catch (e) { console.warn(e); }
};

export const getPerformance = (): PerformanceStats => {
  const data = localStorage.getItem('passaae_performance');
  return data ? JSON.parse(data) : { totalRespondidas: 0, acertos: 0, erros: 0, porMateria: {} };
};

export const getAIExplanation = async (enunciado: string, resposta: string, comentario: string): Promise<string> => {
  try {
    // Fix: Initializing GoogleGenAI with process.env.API_KEY as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Fix: Using 'gemini-3-pro-preview' for complex reasoning task of explaining exam questions
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{
        parts: [{
          text: `Você é o Professor PassaAê, especialista em concursos. 
          Explique didaticamente por que a resposta correta é "${resposta}".
          Questão: ${enunciado}
          Comentário base: ${comentario}`
        }]
      }],
    });

    return response.text || "Não consegui gerar a explicação no momento.";
  } catch (error) {
    console.error("Erro Gemini:", error);
    return "O Tutor IA encontrou um erro técnico ao processar sua explicação. Verifique sua conexão ou tente mais tarde.";
  }
};
