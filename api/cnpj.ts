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

    // fallback 3: Minha Receita (if BrasilAPI still fails)
    if (response.status === 404) {
      response = await fetch(`https://minhareceita.org/${cnpjLimpo}`);
    }

    // fallback 4: CNPJ.ws (if others fail)
    if (response.status === 404) {
      response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpjLimpo}`);
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      let errorMessage = 'Erro na comunicação com o serviço de dados.';
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (e) {
        // Not JSON
      }

      return res.status(response.status).json({ 
        error: response.status === 404 ? 'CNPJ não encontrado em nenhuma das bases consultadas.' : errorMessage
      });
    }

    const data = await response.json();
    
    // Normalization logic for different APIs
    const normalizedData = {
      razao_social: data.razao_social || data.nome_fantasia || "",
      nome_fantasia: data.nome_fantasia || data.razao_social || "",
      porte: data.porte || data.porte_descricao || "",
      descricao_situacao_cadastral: data.descricao_situacao_cadastral || data.situacao_cadastral_descricao || (data.estabelecimento ? data.estabelecimento.situacao_cadastral : ""),
      logradouro: data.logradouro || (data.estabelecimento ? data.estabelecimento.logradouro : ""),
      numero: data.numero || (data.estabelecimento ? data.estabelecimento.numero : ""),
      complemento: data.complemento || (data.estabelecimento ? data.estabelecimento.complemento : ""),
      bairro: data.bairro || (data.estabelecimento ? data.estabelecimento.bairro : ""),
      municipio: data.municipio || (data.estabelecimento ? data.estabelecimento.municipio.nome : ""),
      uf: data.uf || (data.estabelecimento ? data.estabelecimento.estado.sigla : ""),
      cep: data.cep || (data.estabelecimento ? data.estabelecimento.cep : ""),
      ddd_telefone_1: data.ddd_telefone_1 || (data.estabelecimento ? (data.estabelecimento.ddd1 + data.estabelecimento.telefone1) : ""),
      email: data.email || (data.estabelecimento ? data.estabelecimento.email : "")
    };

    return res.json(normalizedData);
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro interno ao processar a consulta.' });
  }
}
