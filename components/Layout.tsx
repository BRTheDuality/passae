
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
    <div className="min-h-screen w-full flex flex-col bg-slate-50">
      {/* Header Fixo com suporte a Safe Area Top */}
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50 safe-top">
        <div className="px-4 py-4 flex items-center h-16">
          {showBack && onBack ? (
            <button 
              onClick={onBack} 
              className="mr-3 p-2 rounded-full active:bg-indigo-800 active:scale-90 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
          ) : (
            <div className="w-4" />
          )}
          <h1 className="text-lg font-bold flex-1 text-center truncate pr-8">{title}</h1>
        </div>
      </header>

      {/* Conteúdo flexível que cresce conforme necessário */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 safe-bottom">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </main>

      {/* Footer minimalista fixo no fundo da página */}
      <footer className="p-4 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          PassaAê • Tecnologia para Aprovação
        </p>
      </footer>
    </div>
  );
};

export default Layout;