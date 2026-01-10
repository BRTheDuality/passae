
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import Timer from '../components/Timer';
import { Question, QuestionType } from '../types';
import { getQuestions, savePerformance, getAIExplanation } from '../services/db';
import { CheckCircle2, XCircle, ChevronRight, MessageCircle, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface QuizSessionProps {
  concurso: string;
  cargo: string;
  type: QuestionType;
  materia?: string;
  onFinish: () => void;
}

const QuizSession: React.FC<QuizSessionProps> = ({ concurso, cargo, type, materia, onFinish }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [isTimerActive, setIsTimerActive] = useState(true);
  
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    setLoading(true);
    getQuestions(concurso, cargo, type, materia).then(data => {
      setQuestions(data);
      setLoading(false);
    });
  }, [concurso, cargo, type, materia]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (ans: string) => {
    if (showFeedback) return;
    setSelectedAnswer(ans);
    setShowFeedback(true);
    setIsTimerActive(false);

    const isCorrect = ans === currentQuestion.resposta;
    
    if (isCorrect) {
      setStats(s => ({ ...s, correct: s.correct + 1 }));
    } else {
      setStats(s => ({ ...s, wrong: s.wrong + 1 }));
    }

    if (type === 'rapida') {
      savePerformance(currentQuestion.materia, isCorrect);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsTimerActive(true);
      setAiExplanation(null);
    } else {
      onFinish();
    }
  };

  const onTimeUp = useCallback(() => {
    if (!showFeedback) {
      handleAnswer('TIME_UP');
    }
  }, [showFeedback, currentQuestion]);

  const handleGetAIExplanation = async () => {
    if (!currentQuestion) return;
    setLoadingAi(true);
    const explanation = await getAIExplanation(
      currentQuestion.enunciado,
      currentQuestion.resposta,
      currentQuestion.comentario
    );
    setAiExplanation(explanation);
    setLoadingAi(false);
  };

  if (loading) {
    return (
      <Layout title="Buscando Questões..." showBack={false}>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
          <p className="mt-4 text-slate-500 font-medium">Consultando o banco de dados...</p>
        </div>
      </Layout>
    );
  }

  if (questions.length === 0) {
    return (
      <Layout title="Nenhuma Questão" onBack={onFinish}>
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-200">
          <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Ops! Não encontramos nada.</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Verifique se os dados abaixo batem <span className="font-bold text-indigo-600">exatamente</span> com o que está escrito no seu Firebase Firestore:
          </p>
          
          <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-2 mb-6 border border-slate-100 font-mono text-xs">
            <p><strong>Coleção:</strong> questoes</p>
            <p><strong>concurso:</strong> "{concurso}"</p>
            <p><strong>cargo:</strong> "{cargo}"</p>
            <p><strong>menu:</strong> "{type}"</p>
            {materia && <p><strong>materia:</strong> "{materia}"</p>}
          </div>

          <button 
            onClick={onFinish}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-md active:scale-95 transition-all"
          >
            Voltar e Tentar Outro
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={type === 'simulado' ? 'Simulado' : currentQuestion.materia} onBack={onFinish}>
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
          {currentIndex + 1} / {questions.length}
        </span>
        <div className="flex gap-2">
           <span className="text-xs text-green-600 font-bold">{stats.correct} Acertos</span>
           <span className="text-xs text-red-600 font-bold">{stats.wrong} Erros</span>
        </div>
      </div>

      <Timer initialTime={75} onTimeUp={onTimeUp} isActive={isTimerActive} />

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 min-h-[160px] flex items-center mb-6">
        <p className="text-slate-700 font-medium leading-relaxed">
          {currentQuestion.enunciado}
        </p>
      </div>

      {/* Answer Area */}
      {type === 'rapida' || type === 'simulado' ? (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => handleAnswer('SIM')}
            disabled={showFeedback}
            className={`py-4 rounded-2xl font-bold border-2 transition-all active:scale-95 ${
              showFeedback && currentQuestion.resposta === 'SIM' ? 'bg-green-100 border-green-500 text-green-700' :
              showFeedback && selectedAnswer === 'SIM' && currentQuestion.resposta !== 'SIM' ? 'bg-red-100 border-red-500 text-red-700' :
              'bg-white border-slate-200 text-slate-700 hover:border-indigo-400'
            }`}
          >
            SIM
          </button>
          <button
            onClick={() => handleAnswer('NAO')}
            disabled={showFeedback}
            className={`py-4 rounded-2xl font-bold border-2 transition-all active:scale-95 ${
              showFeedback && currentQuestion.resposta === 'NAO' ? 'bg-green-100 border-green-500 text-green-700' :
              showFeedback && selectedAnswer === 'NAO' && currentQuestion.resposta !== 'NAO' ? 'bg-red-100 border-red-500 text-red-700' :
              'bg-white border-slate-200 text-slate-700 hover:border-indigo-400'
            }`}
          >
            NÃO
          </button>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {(Object.entries(currentQuestion.alternativas || {}) as [string, string][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => handleAnswer(key)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                showFeedback && currentQuestion.resposta === key ? 'bg-green-50 border-green-500' :
                showFeedback && selectedAnswer === key && currentQuestion.resposta !== key ? 'bg-red-50 border-red-500' :
                'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                showFeedback && currentQuestion.resposta === key ? 'bg-green-500 text-white' :
                showFeedback && selectedAnswer === key ? 'bg-red-500 text-white' :
                'bg-slate-100 text-slate-500'
              }`}>{key}</span>
              <span className="text-sm font-medium text-slate-700">{val}</span>
            </button>
          ))}
        </div>
      )}

      {/* Feedback Section */}
      {showFeedback && (
        <div className="animate-in slide-in-from-bottom-4 duration-300 pb-10">
          <div className={`p-5 rounded-3xl mb-4 border ${
            selectedAnswer === currentQuestion.resposta ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {selectedAnswer === currentQuestion.resposta ? (
                <CheckCircle2 className="text-green-500" />
              ) : (
                <XCircle className="text-red-500" />
              )}
              <span className={`font-bold ${
                selectedAnswer === currentQuestion.resposta ? 'text-green-700' : 'text-red-700'
              }`}>
                {selectedAnswer === currentQuestion.resposta ? 'Você acertou!' : selectedAnswer === 'TIME_UP' ? 'O tempo acabou!' : 'Você errou!'}
              </span>
            </div>
            
            <div className="flex gap-2 text-slate-600 mb-4 bg-white/50 p-3 rounded-xl italic text-sm">
              <MessageCircle size={18} className="shrink-0 mt-0.5 text-indigo-400" />
              <p>{currentQuestion.comentario}</p>
            </div>

            {!aiExplanation ? (
              <button
                onClick={handleGetAIExplanation}
                disabled={loadingAi}
                className="w-full mb-3 bg-indigo-50 text-indigo-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors disabled:opacity-50"
              >
                {loadingAi ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Sparkles size={18} className="text-indigo-500" />
                )}
                Explicar com Professor IA
              </button>
            ) : (
              <div className="mb-4 bg-indigo-600 text-white p-5 rounded-3xl shadow-xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                {/* Header fixo da explicação */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <Sparkles size={18} className="text-yellow-300" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest opacity-90">Explicação Detalhada</span>
                </div>
                
                {/* Área scrollable para o texto longo */}
                <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar scroll-smooth">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap opacity-95">
                    {aiExplanation}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={nextQuestion}
              className="w-full bg-indigo-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              {currentIndex < questions.length - 1 ? 'Próxima Questão' : 'Finalizar Sessão'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default QuizSession;