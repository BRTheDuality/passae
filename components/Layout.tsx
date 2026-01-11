
import React from 'react';
import { ChevronLeft, GraduationCap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, onBack, showBack = true }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      {/* Header Institucional */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 safe-top shadow-md">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="w-10">
            {showBack && onBack && (
              <button 
                onClick={onBack} 
                className="p-2 rounded-lg hover:bg-slate-800 active:scale-90 transition-all text-slate-400"
              >
                <ChevronLeft size={22} />
              </button>
            )}
          </div>
          
          <div className="flex flex-col items-center">
            <h1 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-0.5">
              PassaAê Digital
            </h1>
            <h2 className="text-xs font-bold text-white uppercase truncate max-w-[200px]">
              {title}
            </h2>
          </div>

          <div className="w-10 flex justify-end">
            <GraduationCap size={20} className="text-slate-600" />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 pb-12">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </main>

      {/* Footer Branding */}
      <div className="py-4 text-center pointer-events-none">
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
          Excelência em Aprovação
        </p>
      </div>
    </div>
  );
};

export default Layout;
