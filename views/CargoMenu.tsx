import React from 'react';
import Layout from '../components/Layout';
import { Concurso, QuestionType } from '../types';
import { Zap, LayoutGrid, FileText, BarChart3, ChevronRight } from 'lucide-react';

interface CargoMenuProps {
  concurso?: Concurso; // 🔹 Tornado opcional para segurança
  cargo?: string;      // 🔹 Tornado opcional para segurança
  onBack: () => void;
  onStartQuiz: (type: QuestionType, materia?: string) => void;
  onShowPerformance: () => void;
}

const CargoMenu: React.FC<CargoMenuProps> = ({ concurso, cargo, onBack, onStartQuiz, onShowPerformance }) => {

  // 🔹 Se não receber dados, mostra aviso
  if (!concurso || !cargo) {
    return (
      <Layout title="Erro" onBack={onBack}>
        <p className="text-center text-red-500 font-bold mt-10">
          Nenhum cargo ou concurso selecionado.
        </p>
      </Layout>
    );
  }

  const menuItems = [
    { 
      id: 'rapida', 
      title: 'Questões Rápidas', 
      desc: 'SIM ou NÃO em 75s', 
      icon: <Zap className="text-yellow-500" />,
      color: 'border-yellow-100 bg-yellow-50'
    },
    { 
      id: 'simulado', 
      title: 'Simulado Rápido', 
      desc: 'Simule a prova real', 
      icon: <LayoutGrid className="text-blue-500" />,
      color: 'border-blue-100 bg-blue-50'
    },
    { 
      id: 'original', 
      title: 'Questões Originais', 
      desc: 'Múltipla escolha (A-D)', 
      icon: <FileText className="text-indigo-500" />,
      color: 'border-indigo-100 bg-indigo-50'
    },
    { 
      id: 'desempenho', 
      title: 'Desempenho Geral', 
      desc: 'Veja sua evolução', 
      icon: <BarChart3 className="text-green-500" />,
      color: 'border-green-100 bg-green-50'
    },
  ];

  const handleSelect = (id: string) => {
    if (id === 'desempenho') onShowPerformance();
    else onStartQuiz(id as QuestionType);
  };

  return (
    <Layout title={concurso.nome} onBack={onBack}>
      <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Cargo Selecionado</p>
        <p className="text-lg font-bold text-slate-800 leading-tight">{cargo}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all hover:shadow-lg active:scale-[0.98] ${item.color}`}
          >
            <div className="bg-white p-3 rounded-xl shadow-sm">
              {item.icon}
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-slate-800">{item.title}</h3>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
            <ChevronRight className="text-slate-400" size={20} />
          </button>
        ))}
      </div>
    </Layout>
  );
};

export default CargoMenu;
