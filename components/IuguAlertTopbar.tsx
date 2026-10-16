import React from 'react';
import { useIuguStatus } from '../contexts/IuguStatusContext';
import { IuguStatusModal } from './IuguStatusModal';

export const IuguAlertTopbar: React.FC = () => {
  const {
    isDegradedOrPending,
    effectiveDegradedName,
    pendingInvoice,
    lastChecked,
    setOpenDetailsModal,
    hideGreenBadge,
    setHideGreenBadge
  } = useIuguStatus();

  // Caso 1: Houver lentidão ou falha OU fatura aguardando confirmação
  // Exibe o banner amarelo/âmbar no formato exato solicitado
  if (isDegradedOrPending) {
    const serviceName = effectiveDegradedName || 'Gatilhos (Webhook)';
    const invoiceNum = pendingInvoice.number || '9842';

    return (
      <>
        <IuguStatusModal />
        <div className="w-full bg-amber-500 text-slate-950 px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm font-semibold border-b border-amber-600/30 z-40 transition-all duration-300">
          
          {/* Esquerda: Aviso com o formato solicitado */}
          <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
            <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-950/15 text-amber-950">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            <span className="leading-tight text-amber-950">
              <strong>Aviso de processamento:</strong> O serviço de <strong>{serviceName}</strong> da iugu está com lentidão. A baixa automática de faturas pagas pode levar alguns minutos a mais.
            </span>
          </div>

          {/* Direita: Badge da fatura atual e opções */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setOpenDetailsModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 text-amber-100 font-bold text-xs tracking-tight shadow-sm hover:bg-slate-900 transition-colors"
              title="Clique para detalhes da fatura ou serviços"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>Fatura #{invoiceNum} • Aguardando confirmação</span>
            </button>

            <button
              onClick={() => setOpenDetailsModal(true)}
              className="p-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/40 text-amber-950 transition-colors"
              title="Ver detalhes de todos os serviços da iugu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </div>

        </div>
      </>
    );
  }

  // Caso 2: Todos os serviços operacionais e sem fatura pendente
  // Regra 3: Fica oculta ou mostra um selo discreto verde
  if (hideGreenBadge) {
    return (
      <>
        <IuguStatusModal />
        {/* Botão ultra-discreto no topo para reabrir o status se desejado */}
        <div className="fixed top-2 right-4 z-40 hidden md:block">
          <button
            onClick={() => setHideGreenBadge(false)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold backdrop-blur-sm transition"
            title="Exibir status da iugu"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            iugu normal
          </button>
        </div>
      </>
    );
  }

  // Selo discreto verde conforme Regra 3
  return (
    <>
      <IuguStatusModal />
      <div className="w-full bg-emerald-50/80 dark:bg-emerald-950/30 border-b border-emerald-200/60 dark:border-emerald-800/40 px-4 py-1.5 flex items-center justify-between gap-2 text-xs font-medium text-emerald-900 dark:text-emerald-200 z-40 backdrop-blur-sm">
        
        {/* Selo verde discreto */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-900 dark:text-emerald-200 font-semibold text-[11px] md:text-xs">
            iugu: Todos os serviços operacionais
          </span>
          <span className="hidden sm:inline-block text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            (Webhooks, Pix, Boletos e API)
          </span>
        </div>

        {/* Informações adicionais discretas e controles */}
        <div className="flex items-center gap-2 text-[10px] md:text-xs">
          <span className="hidden lg:inline-block text-emerald-600/70 dark:text-emerald-400/60">
            {lastChecked ? `Atualizado às ${lastChecked.toLocaleTimeString('pt-BR')}` : 'Verificando...'}
          </span>

          <button
            onClick={() => setOpenDetailsModal(true)}
            className="px-2.5 py-0.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-800 dark:text-emerald-300 font-bold transition text-[10px]"
          >
            Ver Detalhes
          </button>

          <button
            onClick={() => setHideGreenBadge(true)}
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-white px-1 font-bold text-[10px]"
            title="Ocultar barra de status"
          >
            ✕
          </button>
        </div>

      </div>
    </>
  );
};
