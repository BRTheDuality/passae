
import React from 'react';
import { BookOpen, Instagram, Star, Award } from 'lucide-react';

interface HomeProps {
  onNavigateToConcursos: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigateToConcursos }) => {
  const openInstagram = () => {
    window.open('https://instagram.com/joaonvsbh', '_blank');
  };

  const openPremium = () => {
    window.open('https://play.google.com/store/apps/details?id=com.passaae.premium', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 max-w-md mx-auto bg-gradient-to-br from-indigo-700 to-blue-900 text-white shadow-2xl">
      <div className="mb-12 text-center animate-bounce-slow">
        <div className="bg-white p-6 rounded-3xl shadow-2xl mb-4 inline-block transform rotate-3">
          <Award size={80} className="text-indigo-600" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter">PassaAê</h1>
        <p className="text-indigo-200 mt-2 font-medium">Aprovação em alta velocidade</p>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={onNavigateToConcursos}
          className="w-full bg-white text-indigo-700 py-4 px-6 rounded-2xl font-bold flex items-center justify-between shadow-lg active:scale-95 transition-all"
        >
          <span className="flex items-center gap-3">
            <BookOpen className="text-indigo-500" />
            Concursos
          </span>
          <span className="bg-indigo-100 px-2 py-1 rounded text-xs">Começar</span>
        </button>

        <button 
          onClick={openInstagram}
          className="w-full bg-indigo-500/20 border border-white/20 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-between active:scale-95 transition-all backdrop-blur-sm"
        >
          <span className="flex items-center gap-3">
            <Instagram className="text-pink-400" />
            Instagram
          </span>
          <span className="text-white/60 text-xs">@joaonvsbh</span>
        </button>

        <button 
          onClick={openPremium}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 py-4 px-6 rounded-2xl font-bold flex items-center justify-between shadow-lg active:scale-95 transition-all"
        >
          <span className="flex items-center gap-3">
            <Star className="fill-slate-900" />
            Versão Premium
          </span>
          <span className="bg-slate-900/10 px-2 py-1 rounded text-xs uppercase tracking-widest">PRO</span>
        </button>
      </div>

      <p className="mt-12 text-indigo-300 text-xs uppercase tracking-widest font-bold">
        Prepare-se para vencer
      </p>
    </div>
  );
};

export default Home;
