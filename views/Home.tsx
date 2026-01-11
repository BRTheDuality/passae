
import React from 'react';
import { BookOpen, Instagram, Star, Award, GraduationCap, ChevronRight, Bookmark } from 'lucide-react';

interface HomeProps {
  onNavigateToConcursos: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigateToConcursos }) => {
  const openInstagram = () => window.open('https://instagram.com/joaonvsbh', '_blank');
  const openPremium = () => window.open('https://play.google.com/store/apps/details?id=com.passaae.premium', '_blank');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section Acadêmica */}
      <div className="bg-slate-900 pt-16 pb-20 px-8 text-white rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        {/* Marca d'água de ícone */}
        <div className="absolute -bottom-10 -right-10 opacity-10 transform -rotate-12">
          <GraduationCap size={280} />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl mb-6 transform rotate-3">
            <Award size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">PassaAê</h1>
          <p className="text-indigo-300 mt-1 font-bold text-xs uppercase tracking-[0.3em]">Ambiente de Estudos</p>
        </div>
      </div>

      {/* Ações de Estudo */}
      <main className="flex-1 px-6 -mt-12 space-y-4 max-w-md mx-auto w-full pb-10">
        <button 
          onClick={onNavigateToConcursos}
          className="w-full bg-white p-6 rounded-3xl academic-card flex items-center gap-5 group active:scale-[0.98] transition-all"
        >
          <div className="bg-slate-900 p-4 rounded-2xl text-white group-hover:bg-indigo-600 transition-colors shadow-lg">
            <BookOpen size={32} />
          </div>
          <div className="text-left flex-1">
            <h3 className="font-black text-slate-800 text-xl tracking-tight">Banco de Questões</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Pratique agora</p>
          </div>
          <ChevronRight className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" size={24} />
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={openInstagram}
            className="bg-white p-5 rounded-3xl academic-card flex flex-col items-center gap-3 active:scale-[0.95] transition-all"
          >
            <div className="bg-pink-50 p-3 rounded-2xl text-pink-500 shadow-sm">
              <Instagram size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Comunidade</span>
          </button>

          <button 
            onClick={openPremium}
            className="bg-slate-800 p-5 rounded-3xl academic-card flex flex-col items-center gap-3 active:scale-[0.95] transition-all relative overflow-hidden"
          >
            <div className="bg-amber-400/20 p-3 rounded-2xl text-amber-400 shadow-sm">
              <Star size={24} className="fill-amber-400" />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Plano PRO</span>
          </button>
        </div>

        {/* Citação Motivacional Acadêmica */}
        <div className="pt-8 px-4 flex items-start gap-3 opacity-60">
          <Bookmark size={16} className="text-indigo-500 shrink-0 mt-1" />
          <p className="text-[11px] leading-relaxed text-slate-500 italic font-medium">
            "A educação é a arma mais poderosa que você pode usar para mudar o mundo." - Nelson Mandela
          </p>
        </div>
      </main>

      <footer className="py-6 text-center">
        <div className="h-1 w-10 bg-slate-200 mx-auto rounded-full"></div>
      </footer>
    </div>
  );
};

export default Home;
