import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cnpj = req.query.cnpj;

  if (!cnpj || typeof cnpj !== 'string') {
    return res.status(400).json({ error: 'CNPJ é obrigatório' });
  }

  const cnpjLimpo = cnpj.replace(/\D/g, '');

  try {
    let response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`, {
      headers: {
        'User-Agent': 'FinHero-App/1.0',
        'Accept': 'application/json'
      }
    });

    if (response.status === 404) {
      response = await fetch(`https://brasilapi.com.br/api/cnpj/v2/${cnpjLimpo}`, {
        headers: {
          'User-Agent': 'FinHero-App/1.0',
          'Accept': 'application/json'
        }
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: response.status === 404 ? 'CNPJ não encontrado na base de dados.' : (errorData.message || 'Erro na comunicação com o serviço de dados.')
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro interno ao processar a consulta.' });
  }
}
