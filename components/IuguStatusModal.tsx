import React from 'react';
import { useIuguStatus } from '../contexts/IuguStatusContext';
import { formatStatusLabel } from '../services/iuguStatusService';

export const IuguStatusModal: React.FC = () => {
  const {
    components,
    degradedComponents,
    openDetailsModal,
    setOpenDetailsModal,
    refreshStatus,
    isLoading,
    lastChecked
  } = useIuguStatus();

  if (!openDetailsModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
              iugu
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Status dos Serviços iugu
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold px-2 py-0.5 rounded-full">
                  API pública v2
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monitoramento a cada 60s via <code className="text-[11px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">status.iugu.com</code>
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpenDetailsModal(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">

          {/* Aviso se houver serviços degradados */}
          {degradedComponents.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
              <span className="w-2.5 h-2.5 mt-1 rounded-full bg-amber-500 animate-ping shrink-0" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-amber-900 dark:text-amber-200">
                  Instabilidade detectada em {degradedComponents.length} {degradedComponents.length === 1 ? 'serviço' : 'serviços'}
                </p>
                <p className="text-amber-700 dark:text-amber-300">
                  A baixa automática de faturas e processamento de pagamentos podem sofrer atrasos até a normalização pela iugu.
                </p>
              </div>
            </div>
          )}

          {/* Componentes em Tempo Real da iugu */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Componentes Oficiais iugu ({components.length})
              </span>
              <button
                onClick={() => refreshStatus()}
                disabled={isLoading}
                className="text-xs text-brand-pink hover:underline font-bold disabled:opacity-50"
              >
                {isLoading ? 'Verificando...' : 'Atualizar agora'}
              </button>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
              {components.map((comp) => {
                const isOp = comp.status?.toLowerCase() === 'operational';
                const isHighlighted = ['Gatilhos (Webhook)', 'Pix', 'Boletos', 'API'].some(k => comp.name.toLowerCase().includes(k.toLowerCase()));

                return (
                  <div
                    key={comp.id || comp.name}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs ${
                      isHighlighted ? 'bg-slate-100/80 dark:bg-slate-800/80 font-medium' : 'bg-slate-50 dark:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isOp ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">
                        {comp.name}
                      </span>
                      {isHighlighted && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded font-semibold">
                          Crítico
                        </span>
                      )}
                    </div>
                    <span className={`font-bold ${isOp ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {formatStatusLabel(comp.status)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            Última checagem:{' '}
            <strong className="text-slate-700 dark:text-slate-300">
              {lastChecked ? lastChecked.toLocaleTimeString('pt-BR') : 'Carregando...'}
            </strong>
          </div>
          <button
            onClick={() => setOpenDetailsModal(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
