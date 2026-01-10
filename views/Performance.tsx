
import React, { useMemo } from 'react';
import Layout from '../components/Layout';
import { getPerformance } from '../services/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, Trophy, AlertTriangle, PieChart } from 'lucide-react';

interface PerformanceProps {
  onBack: () => void;
}

const Performance: React.FC<PerformanceProps> = ({ onBack }) => {
  const stats = getPerformance();

  const chartData = useMemo(() => {
    return Object.entries(stats.porMateria).map(([name, data]) => ({
      materia: name,
      acertos: data.acertos,
      erros: data.erros,
      total: data.acertos + data.erros,
      porcentagem: data.acertos + data.erros > 0 
        ? Math.round((data.acertos / (data.acertos + data.erros)) * 100) 
        : 0
    })).sort((a, b) => b.porcentagem - a.porcentagem);
  }, [stats]);

  const acertoGlobal = stats.totalRespondidas > 0 
    ? Math.round((stats.acertos / stats.totalRespondidas) * 100) 
    : 0;

  return (
    <Layout title="Seu Desempenho" onBack={onBack}>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-50 flex flex-col items-center">
          <Target className="text-indigo-500 mb-2" size={24} />
          <p className="text-slate-400 text-[10px] font-bold uppercase">Total</p>
          <p className="text-2xl font-black text-slate-800">{stats.totalRespondidas}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-green-50 flex flex-col items-center">
          <PieChart className="text-green-500 mb-2" size={24} />
          <p className="text-slate-400 text-[10px] font-bold uppercase">Aproveitamento</p>
          <p className="text-2xl font-black text-green-600">{acertoGlobal}%</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-yellow-500" size={20} />
          <h2 className="font-bold text-slate-800">Acertos por Matéria (%)</h2>
        </div>
        
        {chartData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: -10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis 
                  dataKey="materia" 
                  type="category" 
                  width={100} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-800 text-white p-2 rounded shadow-xl text-xs">
                          <p className="font-bold mb-1">{payload[0].payload.materia}</p>
                          <p>Acertos: {payload[0].payload.acertos}</p>
                          <p>Erros: {payload[0].payload.erros}</p>
                          <p className="text-green-400 font-bold">{payload[0].payload.porcentagem}% de êxito</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="porcentagem" radius={[0, 4, 4, 0]} barSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.porcentagem > 70 ? '#10b981' : entry.porcentagem > 50 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-10">
            <AlertTriangle className="mx-auto mb-2 text-slate-300" size={32} />
            <p className="text-slate-400 text-sm">Responda algumas questões rápidas para ver seus gráficos!</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Detalhamento</h3>
        {chartData.map((item) => (
          <div key={item.materia} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-700 text-sm">{item.materia}</p>
              <p className="text-[10px] text-slate-400">{item.total} questões respondidas</p>
            </div>
            <div className="text-right">
              <span className={`text-lg font-black ${item.porcentagem >= 70 ? 'text-green-600' : 'text-slate-700'}`}>
                {item.porcentagem}%
              </span>
              <div className="flex gap-1 text-[9px] font-bold mt-1">
                <span className="text-green-500">{item.acertos}A</span>
                <span className="text-red-400">{item.erros}E</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Performance;
