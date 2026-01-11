
import React from 'react';
import { BookOpen, Instagram, Star, Award, GraduationCap, ArrowRight } from 'lucide-react';

interface HomeProps {
  onNavigateToConcursos: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigateToConcursos }) => {
  const openInstagram = () => window.open('https://instagram.com/joaonvsbh', '_blank');
  const openPremium = () => window.open('https://play.google.com/store/apps/details?id=com.passaae.premium', '_blank');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Hero Section Acadêmica */}
      <div className="bg-indigo-700 pt-16 pb-20 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <GraduationCap size={200} className="text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="bg-white p-5 rounded-3xl shadow-2xl mb-6 inline-block transform -rotate-2">
            <Award size={60} className="text-indigo-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">PassaAê</h1>
          <p className="text-indigo-100 mt-2 font-medium opacity-90 text-sm uppercase tracking-widest">Excelência em Concursos</p>
        </div>
      </div>

      {/* Menu de Ações */}
      <div className="flex-1 px-6 -mt-10 space-y-4 max-w-md mx-auto w-full pb-10">
        <button 
          onClick={onNavigateToConcursos}
          className="w-full bg-white p-6 rounded-3xl academic-shadow flex items-center gap-4 group active:scale-[0.98] transition-all border border-slate-100"
        >
          <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <BookOpen size={28} />
          </div>
          <div className="text-left flex-1">
            <h3 className="font-bold text-slate-800 text-lg">Área de Estudos</h3>
            <p className="text-xs text-slate-400 font-medium italic">Selecione seu concurso alvo</p>
          </div>
          <ArrowRight className="text-slate-300" size={20} />
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={openInstagram}
            className="bg-white p-5 rounded-3xl academic-shadow flex flex-col items-center gap-2 active:scale-[0.95] transition-all border border-slate-100"
          >
            <div className="bg-pink-50 p-3 rounded-2xl text-pink-500">
              <Instagram size={24} />
            </div>
            <span className="text-xs font-bold text-slate-600">Comunidade</span>
          </button>

          <button 
            onClick={openPremium}
            className="bg-slate-900 p-5 rounded-3xl academic-shadow flex flex-col items-center gap-2 active:scale-[0.95] transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
            </div>
            <div className="bg-white/10 p-3 rounded-2xl text-yellow-400">
              <Star size={24} className="fill-yellow-400" />
            </div>
            <span className="text-xs font-bold text-white">Versão PRO</span>
          </button>
        </div>

        <div className="pt-6 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
            Prepare-se com as melhores ferramentas<br/>de memorização ativa
          </p>
        </div>
      </div>
      
      <footer className="py-6 text-center">
        <div className="h-1 w-12 bg-slate-200 mx-auto rounded-full"></div>
      </footer>
    </div>
  );
};

export default Home;
