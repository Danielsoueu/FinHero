import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  IuguComponent,
  IuguStatusSummary,
  fetchIuguStatus,
  getDegradedComponents,
  getPrimaryDegradedService
} from '../services/iuguStatusService';

export interface PendingInvoice {
  number: string;
  isPending: boolean;
  amount?: number;
  client?: string;
  updatedAt?: string;
}

export interface SimulationState {
  enabled: boolean;
  serviceName: string;
  serviceStatus: string;
}

interface IuguStatusContextType {
  summary: IuguStatusSummary | null;
  components: IuguComponent[];
  degradedComponents: IuguComponent[];
  primaryDegraded: IuguComponent | null;
  effectiveDegradedName: string | null;
  hasDegradedServices: boolean;
  isDegradedOrPending: boolean;
  isLoading: boolean;
  lastChecked: Date | null;
  nextCheckIn: number;
  pendingInvoice: PendingInvoice;
  setPendingInvoice: React.Dispatch<React.SetStateAction<PendingInvoice>>;
  simulation: SimulationState;
  setSimulation: React.Dispatch<React.SetStateAction<SimulationState>>;
  refreshStatus: () => Promise<void>;
  hideGreenBadge: boolean;
  setHideGreenBadge: (val: boolean) => void;
  openDetailsModal: boolean;
  setOpenDetailsModal: (open: boolean) => void;
}

const IuguStatusContext = createContext<IuguStatusContextType | undefined>(undefined);

const POLLING_INTERVAL_SEC = 60;

export const IuguStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [summary, setSummary] = useState<IuguStatusSummary | null>(null);
  const [components, setComponents] = useState<IuguComponent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [nextCheckIn, setNextCheckIn] = useState<number>(POLLING_INTERVAL_SEC);
  const [openDetailsModal, setOpenDetailsModal] = useState<boolean>(false);
  const [hideGreenBadge, setHideGreenBadge] = useState<boolean>(false);

  // Fatura aguardando confirmação (inicia com #9842 aguardando confirmação para teste inicial ou configurável)
  const [pendingInvoice, setPendingInvoice] = useState<PendingInvoice>(() => {
    try {
      const saved = localStorage.getItem('finhero_pending_invoice');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      number: '9842',
      isPending: false, // Por padrão inicial começa limpa, mas pode ser ativada com 1 clique
      client: 'Colégio Alpha',
      updatedAt: new Date().toISOString()
    };
  });

  // Remove resquícios de simulação do localStorage se existirem
  useEffect(() => {
    try {
      localStorage.removeItem('finhero_iugu_simulation');
    } catch (e) {
      // ignore
    }
  }, []);

  const [simulation, setSimulation] = useState<SimulationState>({
    enabled: false,
    serviceName: '',
    serviceStatus: 'operational'
  });

  const loadStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchIuguStatus();
      setSummary(data);
      if (Array.isArray(data.components)) {
        setComponents(data.components);
      }
      setLastChecked(new Date());
      setNextCheckIn(POLLING_INTERVAL_SEC);
    } catch (err) {
      console.error('[IuguStatusContext] Falha ao atualizar status da iugu:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Polling automático a cada 60 segundos
  useEffect(() => {
    loadStatus();

    const intervalId = setInterval(() => {
      loadStatus();
    }, POLLING_INTERVAL_SEC * 1000);

    const countdownId = setInterval(() => {
      setNextCheckIn((prev) => (prev > 1 ? prev - 1 : POLLING_INTERVAL_SEC));
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(countdownId);
    };
  }, [loadStatus]);

  // Lista de componentes reais degradados
  const realDegraded = getDegradedComponents(components);
  const realPrimary = getPrimaryDegradedService(realDegraded);

  // Calcula se há instabilidade ou falha nos serviços oficiais da iugu
  const hasDegradedServices = realDegraded.length > 0;
  const effectiveDegradedName = realPrimary?.name || (pendingInvoice.isPending ? 'Gatilhos (Webhook)' : null);

  // Regra 2: Quando houver lentidão ou falha (ou enquanto uma fatura estiver aguardando confirmação)
  const isDegradedOrPending = hasDegradedServices || pendingInvoice.isPending;

  return (
    <IuguStatusContext.Provider
      value={{
        summary,
        components,
        degradedComponents: realDegraded,
        primaryDegraded: realPrimary,
        effectiveDegradedName,
        hasDegradedServices,
        isDegradedOrPending,
        isLoading,
        lastChecked,
        nextCheckIn,
        pendingInvoice,
        setPendingInvoice,
        simulation,
        setSimulation,
        refreshStatus: loadStatus,
        hideGreenBadge,
        setHideGreenBadge,
        openDetailsModal,
        setOpenDetailsModal,
      }}
    >
      {children}
    </IuguStatusContext.Provider>
  );
};

export const useIuguStatus = () => {
  const context = useContext(IuguStatusContext);
  if (!context) {
    throw new Error('useIuguStatus deve ser usado dentro de um IuguStatusProvider');
  }
  return context;
};
