
import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, onBack, showBack = true }) => {
  return (
    <div className="h-full w-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header com preenchimento para Notch */}
      <header className="bg-indigo-700 text-white px-4 pb-4 flex items-center shadow-md sticky top-0 z-50">
        {showBack && onBack && (
          <button 
            onClick={onBack} 
            className="mr-3 p-2 rounded-full hover:bg-indigo-600 active:bg-indigo-800 active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-lg font-bold flex-1 text-center truncate px-2">{title}</h1>
        {showBack && onBack && <div className="w-10" />} {/* Balancer */}
      </header>

      {/* Área de conteúdo com scroll independente */}
      <main className="flex-1 overflow-y-auto p-4 pb-12 custom-scrollbar">
        <div className="max-w-md mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Rodapé fixo (opcional, pode ser removido para ganhar tela) */}
      <footer className="p-3 text-center text-slate-400 text-[9px] bg-white border-t border-slate-100 uppercase tracking-tighter">
        PassaAê - Seu Futuro Concurso
      </footer>
    </div>
  );
};

export default Layout;