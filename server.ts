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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[CNPJ Search] API Error:`, errorData);
        return res.status(response.status).json({ 
          error: response.status === 404 ? 'CNPJ não encontrado na base de dados.' : (errorData.message || 'Erro na comunicação com o serviço de dados.')
        });
      }

      const data = await response.json();
      res.json(data);
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
