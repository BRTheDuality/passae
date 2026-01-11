
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
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-slate-50 shadow-xl overflow-hidden">
      {/* Header */}
      <header className="bg-indigo-700 text-white p-4 flex items-center shadow-md sticky top-0 z-50">
        {showBack && onBack && (
          <button onClick={onBack} className="mr-3 p-1 rounded-full hover:bg-indigo-600 transition-colors">
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-bold flex-1 text-center">{title}</h1>
        {showBack && onBack && <div className="w-6" />} {/* Balancer */}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        {children}
      </main>

      {/* Simple Footer/Watermark */}
      <footer className="p-4 text-center text-slate-400 text-xs">
        PassaAê © 2024 - O seu futuro começa aqui
      </footer>
    </div>
  );
};

export default Layout;
