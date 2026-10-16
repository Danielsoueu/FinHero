export interface IuguComponent {
  id: string;
  name: string;
  status: 'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage' | 'under_maintenance' | string;
  created_at?: string;
  updated_at?: string;
  position?: number;
  description?: string | null;
}

export interface IuguStatusSummary {
  page: {
    id: string;
    name: string;
    url: string;
    time_zone: string;
    updated_at: string;
  };
  components: IuguComponent[];
  status?: {
    indicator: string;
    description: string;
  };
}

export const PRIORITY_SERVICES = [
  'Gatilhos (Webhook)',
  'Pix',
  'Boletos',
  'API',
  'Faturas',
  'Cartão de Crédito',
  'Checkout',
  'Serviços Financeiros'
];

/**
 * Consulta a API de status da iugu com fallback para proxy interno
 */
export async function fetchIuguStatus(): Promise<IuguStatusSummary> {
  const directUrl = 'https://status.iugu.com/api/v2/summary.json';
  const proxyUrl = '/api/iugu-status';

  // Tentativa 1: API pública direta com timeout de 6 segundos
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(directUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.components)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[iuguStatusService] Falha na consulta direta a status.iugu.com, tentando proxy...', err);
  }

  // Tentativa 2: Proxy do servidor local
  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) {
      throw new Error(`Proxy iugu retornou ${res.status}`);
    }
    const data = await res.json();
    if (data && Array.isArray(data.components)) {
      return data;
    }
    throw new Error('Formato de resposta inválido retornado pelo proxy');
  } catch (err: any) {
    console.error('[iuguStatusService] Erro em ambos os métodos de consulta:', err);
    throw err;
  }
}

/**
 * Encontra componentes que não estejam com status "operational"
 */
export function getDegradedComponents(components: IuguComponent[]): IuguComponent[] {
  if (!Array.isArray(components)) return [];
  return components.filter(c => c.status && c.status.toLowerCase() !== 'operational');
}

/**
 * Identifica o serviço com lentidão ou falha de maior prioridade
 */
export function getPrimaryDegradedService(degraded: IuguComponent[]): IuguComponent | null {
  if (!degraded || degraded.length === 0) return null;

  // Busca na ordem prioritária indicada pelas regras do usuário
  for (const prioName of PRIORITY_SERVICES) {
    const found = degraded.find(c => c.name.toLowerCase().includes(prioName.toLowerCase()));
    if (found) return found;
  }

  return degraded[0];
}

/**
 * Formata o nome do status da iugu para exibição legível
 */
export function formatStatusLabel(status: string): string {
  switch (status.toLowerCase()) {
    case 'operational':
      return 'Operacional';
    case 'degraded_performance':
      return 'Lentidão';
    case 'partial_outage':
      return 'Instabilidade Parcial';
    case 'major_outage':
      return 'Fora do Ar';
    case 'under_maintenance':
      return 'Em Manutenção';
    default:
      return status;
  }
}
