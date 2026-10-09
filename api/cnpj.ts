import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buscarCnpjComFallback } from '../services/cnpjService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cnpj = req.query.cnpj;

  if (!cnpj || typeof cnpj !== 'string') {
    return res.status(400).json({ error: 'CNPJ é obrigatório' });
  }

  try {
    const empresa = await buscarCnpjComFallback(cnpj);
    return res.json(empresa);
  } catch (error: any) {
    return res.status(404).json({ 
      error: error.message || 'Não foi possível localizar o CNPJ em nenhum dos provedores.' 
    });
  }
}
