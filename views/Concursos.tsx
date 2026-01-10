
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getConcursos } from '../services/db';
import { Concurso } from '../types';
import { Filter, Globe, MapPin, Building2, ChevronRight, Loader2, RefreshCw } from 'lucide-react';

interface ConcursosProps {
  onBack: () => void;
  onSelectCargo: (concurso: Concurso, cargo: string) => void;
}

const Concursos: React.FC<ConcursosProps> = ({ onBack, onSelectCargo }) => {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [filter, setFilter] = useState<'nacional' | 'estado' | 'municipio'>('nacional');
  const [selectedConcurso, setSelectedConcurso] = useState<Concurso | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError(false);
    console.log("View Concursos - Iniciando carga...");
    getConcursos().then(data => {
      console.log("View Concursos - Dados carregados:", data);
      setConcursos(data);
      setLoading(false);
    }).catch(err => {
      console.error("View Concursos - Erro fatal:", err);
      setError(true);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtro mais tolerante: se o concurso não tiver tipo, aparece em 'nacional'
  const filteredList = concursos.filter(c => {
    const cTipo = (c.tipo || 'nacional').toLowerCase().trim();
    return cTipo === filter.toLowerCase();
  });

  return (
    <Layout title="Escolha o Concurso" onBack={onBack}>
      {/* Filtros de Categoria */}
      <div className="flex bg-slate-200 p-1 rounded-xl mb-6 shadow-inner">
        <button 
          onClick={() => { setFilter('nacional'); setSelectedConcurso(null); }}
          className={`flex-1 flex flex-col items-center py-2 rounded-lg transition-all duration-200 ${filter === 'nacional' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500'}`}
        >
          <Globe size={18} />
          <span className="text-[10px] font-bold mt-1">Nacional</span>
        </button>
        <button 
          onClick={() => { setFilter('estado'); setSelectedConcurso(null); }}
          className={`flex-1 flex flex-col items-center py-2 rounded-lg transition-all duration-200 ${filter === 'estado' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500'}`}
        >
          <MapPin size={18} />
          <span className="text-[10px] font-bold mt-1">Estado</span>
        </button>
        <button 
          onClick={() => { setFilter('municipio'); setSelectedConcurso(null); }}
          className={`flex-1 flex flex-col items-center py-2 rounded-lg transition-all duration-200 ${filter === 'municipio' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500'}`}
        >
          <Building2 size={18} />
          <span className="text-[10px] font-bold mt-1">Município</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
          <p className="text-slate-500 font-medium">Conectando ao banco...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-red-100">
          <p className="text-red-500 font-bold mb-4">Erro ao carregar dados.</p>
          <button 
            onClick={loadData}
            className="flex items-center gap-2 mx-auto bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            <RefreshCw size={18} /> Tentar Novamente
          </button>
        </div>
      ) : !selectedConcurso ? (
        <div className="space-y-3 animate-in fade-in duration-500">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
            {filter === 'nacional' ? 'Âmbito Nacional' : filter === 'estado' ? 'Estaduais' : 'Municipais'}
          </h2>
          
          {filteredList.length > 0 ? (
            filteredList.map(concurso => (
              <button
                key={concurso.id}
                onClick={() => setSelectedConcurso(concurso)}
                className="w-full bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm hover:border-indigo-300 active:scale-[0.98] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span className="font-bold text-slate-700">{concurso.nome}</span>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </button>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
              <Filter className="mx-auto mb-3 text-slate-200" size={56} />
              <p className="text-slate-400 font-medium px-6">
                Nenhum concurso {filter} encontrado.<br/>
                <span className="text-[10px] mt-2 block">(Dica: Verifique se o campo 'tipo' no Firebase está preenchido corretamente)</span>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <button 
              onClick={() => setSelectedConcurso(null)}
              className="text-indigo-600 text-sm font-bold hover:underline p-1"
            >
              &larr; Voltar
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-slate-900 font-black">{selectedConcurso.nome}</span>
          </div>
          
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Cargos Disponíveis</h2>

          {selectedConcurso.cargos && selectedConcurso.cargos.length > 0 ? (
            <div className="space-y-3">
              {selectedConcurso.cargos.map(cargo => (
                <button
                  key={cargo}
                  onClick={() => onSelectCargo(selectedConcurso, cargo)}
                  className="w-full bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm hover:border-indigo-300 active:scale-[0.98] transition-all group"
                >
                  <span className="font-semibold text-slate-700 text-left leading-tight">{cargo}</span>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-500 transition-all" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-100 rounded-2xl border border-slate-200">
              <p className="text-slate-500">Nenhum cargo listado para este concurso.</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Concursos;
