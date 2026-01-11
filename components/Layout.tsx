
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
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      {/* Header Acadêmico Clean */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 safe-top">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="w-10">
            {showBack && onBack && (
              <button 
                onClick={onBack} 
                className="p-2 rounded-xl hover:bg-slate-100 active:scale-90 transition-all text-slate-600"
              >
                <ChevronLeft size={24} />
              </button>
            )}
          </div>
          
          <h1 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight truncate max-w-[200px]">
            {title}
          </h1>

          <div className="w-10 flex justify-end">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-md mx-auto p-5 pb-20">
        <div className="animate-in fade-in duration-500">
          {children}
        </div>
      </main>

      {/* Badge de Rodapé */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none flex justify-center">
        <div className="bg-slate-900/5 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
            PassaAê Digital
          </p>
        </div>
      </div>
    </div>
  );
};

export default Layout;
