export interface EmpresaPadronizada {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  situacaoCadastral: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  origem: 'brasilapi' | 'cnpja';
  // Propriedades complementares para compatibilidade total com a interface do app
  complemento?: string;
  porte?: string;
  ddd_telefone_1?: string;
  email?: string;
  razao_social?: string;
  nome_fantasia?: string;
  descricao_situacao_cadastral?: string;
}

// Utilitário com timeout seguro (evita travamentos caso alguma API esteja lenta)
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

// 1. Busca na BrasilAPI (Provedor Principal)
export async function buscarBrasilApi(cnpj: string): Promise<EmpresaPadronizada> {
  const res = await fetchWithTimeout(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
    headers: {
      'User-Agent': 'FinHero-App/1.0',
      'Accept': 'application/json'
    }
  }, 5000);

  if (!res.ok) throw new Error(`BrasilAPI falhou: ${res.status}`);

  const data = await res.json();
  const razaoSocial = data.razao_social || data.nome_fantasia || '';
  const nomeFantasia = data.nome_fantasia || '';
  const situacaoCadastral = data.descricao_situacao_cadastral || 'ATIVA';

  return {
    cnpj: data.cnpj || cnpj,
    razaoSocial,
    nomeFantasia,
    situacaoCadastral,
    logradouro: data.logradouro || '',
    numero: data.numero || '',
    bairro: data.bairro || '',
    municipio: data.municipio || '',
    uf: data.uf || '',
    cep: data.cep || '',
    origem: 'brasilapi',
    complemento: data.complemento || '',
    porte: data.porte || data.porte_descricao || '',
    ddd_telefone_1: data.ddd_telefone_1 || '',
    email: data.email || '',
    razao_social: razaoSocial,
    nome_fantasia: nomeFantasia,
    descricao_situacao_cadastral: situacaoCadastral
  };
}

// 2. Busca na CNPJá (Fallback Imediato)
export async function buscarCnpja(cnpj: string): Promise<EmpresaPadronizada> {
  const res = await fetchWithTimeout(`https://open.cnpja.com/office/${cnpj}`, {
    headers: {
      'User-Agent': 'FinHero-App/1.0',
      'Accept': 'application/json'
    }
  }, 5000);

  if (!res.ok) throw new Error(`CNPJá falhou: ${res.status}`);

  const data = await res.json();
  const razaoSocial = data.company?.name || data.alias || '';
  const nomeFantasia = data.alias || '';
  const situacaoCadastral = data.status?.text || 'ATIVA';
  const logradouro = data.address?.street || '';
  const numero = data.address?.number || '';
  const bairro = data.address?.district || '';
  const municipio = data.address?.city || '';
  const uf = data.address?.state || '';
  const cep = data.address?.zip || '';
  const complemento = data.address?.details || '';
  const porte = data.company?.size?.text || '';

  let telefone = '';
  if (Array.isArray(data.phones) && data.phones.length > 0) {
    const p = data.phones[0];
    telefone = `${p.area || ''}${p.number || ''}`;
  }

  let email = '';
  if (Array.isArray(data.emails) && data.emails.length > 0) {
    email = data.emails[0]?.address || '';
  }

  return {
    cnpj: data.taxId || cnpj,
    razaoSocial,
    nomeFantasia,
    situacaoCadastral,
    logradouro,
    numero,
    bairro,
    municipio,
    uf,
    cep,
    origem: 'cnpja',
    complemento,
    porte,
    ddd_telefone_1: telefone,
    email,
    razao_social: razaoSocial,
    nome_fantasia: nomeFantasia,
    descricao_situacao_cadastral: situacaoCadastral
  };
}

// 3. Orquestrador principal com Fallback
export async function buscarCnpjComFallback(cnpjRaw: string): Promise<EmpresaPadronizada> {
  const cnpjLimpo = cnpjRaw.replace(/\D/g, '');

  if (cnpjLimpo.length !== 14) {
    throw new Error('CNPJ deve conter exatamente 14 dígitos.');
  }

  // Tentativa 1: BrasilAPI (Principal)
  try {
    return await buscarBrasilApi(cnpjLimpo);
  } catch (err) {
    console.warn('Falha na BrasilAPI, tentando CNPJá...', err);
  }

  // Tentativa 2: CNPJá (Fallback)
  try {
    return await buscarCnpja(cnpjLimpo);
  } catch (err) {
    console.error('Falha em ambos os provedores:', err);
    throw new Error('Não foi possível localizar o CNPJ em nenhum dos provedores.');
  }
}
