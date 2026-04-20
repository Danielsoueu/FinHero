import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy endpoint for CNPJ to avoid CORS/Network issues in the browser
  app.get('/api/cnpj', async (req, res) => {
    const cnpj = req.query.cnpj as string;
    if (!cnpj) return res.status(400).json({ error: 'CNPJ é obrigatório' });

    console.log(`[CNPJ Search] Requesting data for: ${cnpj}`);
    
    try {
      let response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
        headers: {
          'User-Agent': 'FinHero-App/1.0',
          'Accept': 'application/json'
        }
      });

      console.log(`[CNPJ Search] v1 API returned status: ${response.status}`);

      // Try v2 if v1 fails with 404
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

      // fallback 3: Minha Receita
      if (response.status === 404) {
        console.log(`[CNPJ Search] v1 and v2 failed, trying Minha Receita for: ${cnpj}`);
        response = await fetch(`https://minhareceita.org/${cnpj}`);
        console.log(`[CNPJ Search] Minha Receita returned status: ${response.status}`);
      }

      // fallback 4: CNPJ.ws
      if (response.status === 404) {
        console.log(`[CNPJ Search] Trying CNPJ.ws for: ${cnpj}`);
        response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`);
        console.log(`[CNPJ Search] CNPJ.ws returned status: ${response.status}`);
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        let errorMessage = 'Erro na comunicação com o serviço de dados.';
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (e) { }

        console.error(`[CNPJ Search] API Error Body:`, errorText);
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

      res.json(normalizedData);
    } catch (error: any) {
      console.error('[CNPJ Search] Proxy Exception:', error.message);
      res.status(500).json({ error: 'Erro interno ao processar a consulta.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
