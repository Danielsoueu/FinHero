import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { buscarCnpjComFallback } from './services/cnpjService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI Presentation Generator Endpoint
  app.post('/api/generate-presentation', async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: 'O prompt ou texto de entrada é obrigatório.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({
        apiKey: apiKey || '',
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `Você é um especialista em design de apresentações executivas e comunicação corporativa de alta performance.
Sua tarefa é receber dados operacionais, resumos, notas de reuniões, métricas ou solicitações do usuário e transformá-los em uma apresentação de slides executiva profissional com 3 a 5 slides estruturados estritamente em JSON.

REGRAS DE BRANDING E DESIGN DA MARCA:
- Cores Primárias: Obsidian Black (#101828), Pure White (#FFFFFF), Electric Rose (#FF0066), Denim Blue (#667085), Chalk White (#F3F3F3).
- Tipografia Referência: Asap Hero Semibold / Arial.
- Tom de voz: Profissional, prático, empoderador e direto ao ponto.
- Estrutura Visual: Cada slide deve ter um propósito claro (métrica, gráfico/tabela, proposta de ideia ou plano de ação).
- Resuma dados em bullet points objetivos e tabelas claras. Evite blocos extensos de texto.

TIPOS DE SLIDE PERMITIDOS (type):
- "metrics_summary" (resumo de métricas/insights)
- "strategy_card" (cartão de estratégia/ideia)
- "action_plan" (plano de ação/próximos passos)

LAYOUTS PERMITIDOS (layout):
- "split_table_metrics" (Volume total, métricas destacadas em key_metrics array com label, value e highlight, e insight_takeaway)
- "cards_grid" (Objetivo em objective, variáveis em array de strings, e action_example com trigger e copy)
- "step_flow" (problem_context, proposed_solution, e ai_approach)
- "two_column_list" (columns array com objetos { header, items: string[] } e final_goal)

Sua resposta DEVE ser estritamente um JSON válido conforme esta estrutura:
{
  "presentation_title": "Título da Apresentação",
  "theme": {
    "primary_color": "#101828",
    "accent_color": "#FF0066",
    "background_color": "#F3F3F3",
    "text_color": "#101828",
    "font_family": "Asap Hero, Arial, sans-serif"
  },
  "slides": [
    {
      "slide_number": 1,
      "type": "metrics_summary",
      "title": "Título do Slide 1",
      "subtitle": "Subtítulo do Slide 1",
      "layout": "split_table_metrics",
      "content": {
        "total_volume": "...",
        "key_metrics": [
          { "label": "...", "value": "...", "highlight": true }
        ],
        "insight_takeaway": "..."
      }
    },
    {
      "slide_number": 2,
      "type": "strategy_card",
      "title": "Estratégia ou Ideia 1",
      "subtitle": "Subtítulo explicativo",
      "layout": "cards_grid",
      "content": {
        "objective": "...",
        "variables": ["...", "..."],
        "action_example": {
          "trigger": "...",
          "copy": "..."
        }
      }
    },
    {
      "slide_number": 3,
      "type": "strategy_card",
      "title": "Fluxo de Ação ou Solução",
      "subtitle": "Subtítulo explicativo",
      "layout": "step_flow",
      "content": {
        "problem_context": "...",
        "proposed_solution": "...",
        "ai_approach": "..."
      }
    },
    {
      "slide_number": 4,
      "type": "action_plan",
      "title": "Próximos Passos & Metas",
      "subtitle": "Execução tática",
      "layout": "two_column_list",
      "content": {
        "columns": [
          {
            "header": "Fase 1",
            "items": ["Item 1", "Item 2"]
          },
          {
            "header": "Fase 2",
            "items": ["Item 1", "Item 2"]
          }
        ],
        "final_goal": "..."
      }
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Analise as informações enviadas e gere a apresentação no formato JSON solicitado:\n\n${prompt}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      let presentationData;
      try {
        presentationData = JSON.parse(responseText);
      } catch (e) {
        console.error("Erro ao interpretar JSON da IA:", responseText);
        return res.status(500).json({ error: "O modelo não retornou um JSON no formato adequado." });
      }

      res.json(presentationData);
    } catch (error: any) {
      console.error('[API Presentation Generator] Exception:', error);
      res.status(500).json({ error: error.message || 'Falha na comunicação com a inteligência artificial.' });
    }
  });

  // Endpoint para CNPJ com busca prioritária na BrasilAPI e fallback para CNPJá
  app.get('/api/cnpj', async (req, res) => {
    const cnpj = req.query.cnpj as string;
    if (!cnpj) return res.status(400).json({ error: 'CNPJ é obrigatório' });

    console.log(`[CNPJ Search] Buscando dados para: ${cnpj} (BrasilAPI -> CNPJá fallback)`);
    
    try {
      const empresa = await buscarCnpjComFallback(cnpj);
      console.log(`[CNPJ Search] Sucesso obtido via: ${empresa.origem}`);
      res.json(empresa);
    } catch (error: any) {
      console.error('[CNPJ Search] Erro na consulta:', error.message);
      res.status(404).json({ 
        error: error.message || 'Não foi possível localizar o CNPJ em nenhum dos provedores.' 
      });
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
