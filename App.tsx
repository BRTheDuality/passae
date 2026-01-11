
import React, { useState } from 'react';
import Home from './views/Home';
import Concursos from './views/Concursos';
import CargoMenu from './views/CargoMenu';
import QuizSession from './views/QuizSession';
import Performance from './views/Performance';
import { Concurso, QuestionType } from './types';

type ViewState = 
  | 'home' 
  | 'concursos' 
  | 'cargo-menu' 
  | 'quiz' 
  | 'performance';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [selectedConcurso, setSelectedConcurso] = useState<Concurso | null>(null);
  const [selectedCargo, setSelectedCargo] = useState<string | null>(null);
  const [quizType, setQuizType] = useState<QuestionType | null>(null);
  const [selectedMateria, setSelectedMateria] = useState<string | undefined>(undefined);

  const navigateTo = (newView: ViewState) => setView(newView);

  const startQuiz = (type: QuestionType, materia?: string) => {
    setQuizType(type);
    setSelectedMateria(materia);
    setView('quiz');
  };

  return (
    <div className="bg-slate-900 min-h-screen">
      {view === 'home' && (
        <Home 
          onNavigateToConcursos={() => navigateTo('concursos')} 
        />
      )}
      
      {view === 'concursos' && (
        <Concursos 
          onBack={() => navigateTo('home')}
          onSelectCargo={(concurso, cargo) => {
            setSelectedConcurso(concurso);
            setSelectedCargo(cargo);
            navigateTo('cargo-menu');
          }}
        />
      )}

      {view === 'cargo-menu' && selectedConcurso && selectedCargo && (
        <CargoMenu 
          concurso={selectedConcurso}
          cargo={selectedCargo}
          onBack={() => navigateTo('concursos')}
          onStartQuiz={startQuiz}
          onShowPerformance={() => navigateTo('performance')}
        />
      )}

      {view === 'quiz' && selectedConcurso && selectedCargo && quizType && (
        <QuizSession 
          concurso={selectedConcurso.nome}
          cargo={selectedCargo}
          type={quizType}
          materia={selectedMateria}
          onFinish={() => navigateTo('cargo-menu')}
        />
      )}

      {view === 'performance' && (
        <Performance onBack={() => navigateTo('cargo-menu')} />
      )}
    </div>
  );
};

export default App;
