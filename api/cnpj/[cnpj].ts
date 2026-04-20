import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { cnpj } = req.query;

  if (!cnpj || typeof cnpj !== 'string') {
    return res.status(400).json({ error: 'CNPJ é obrigatório' });
  }

  console.log(`[CNPJ Search Vercel] Requesting data for: ${cnpj}`);

  try {
    let response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      headers: {
        'User-Agent': 'FinHero-App/1.0',
        'Accept': 'application/json'
      }
    });

    console.log(`[CNPJ Search] v1 API returned status: ${response.status}`);

    if (response.status === 404) {
      console.log(`[CNPJ Search] v1 failed, trying v2 for: ${cnpj}`);
      response = await fetch(`https://brasilapi.com.br/api/cnpj/v2/${cnpj}`, {
        headers: {
          'User-Agent': 'FinHero-App/1.0',
          'Accept': 'application/json'
        }
      });
      console.log(`[CNPJ Search] v2 API returned status: ${response.status}`);
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
    console.error('[CNPJ Search] Exception:', error.message);
    return res.status(500).json({ error: 'Erro interno ao processar a consulta.' });
  }
}
