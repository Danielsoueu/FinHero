import React, { useState } from 'react';
import { 
    Presentation, 
    ChevronLeft, 
    ChevronRight, 
    Maximize2, 
    Minimize2, 
    Copy, 
    Check, 
    RotateCcw, 
    Code, 
    Tv, 
    Sparkles, 
    FileText, 
    Target, 
    Zap, 
    TrendingUp, 
    ShieldAlert, 
    CheckCircle2, 
    ArrowRight, 
    ExternalLink, 
    Send, 
    Loader2, 
    Printer, 
    Download,
    X,
    Lightbulb
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export interface KeyMetric {
    label: string;
    value: string;
    highlight?: boolean;
}

export interface ActionExample {
    trigger: string;
    copy: string;
}

export interface ColumnItem {
    header: string;
    items: string[];
}

export interface SlideContent {
    total_volume?: string;
    key_metrics?: KeyMetric[];
    insight_takeaway?: string;
    objective?: string;
    variables?: string[];
    action_example?: ActionExample;
    problem_context?: string;
    proposed_solution?: string;
    ai_approach?: string;
    columns?: ColumnItem[];
    final_goal?: string;
    [key: string]: any;
}

export interface Slide {
    slide_number: number;
    type: string;
    title: string;
    subtitle?: string;
    layout: string;
    content: SlideContent;
}

export interface PresentationData {
    presentation_title: string;
    theme: {
        primary_color: string;
        accent_color: string;
        background_color: string;
        text_color: string;
        font_family: string;
    };
    slides: Slide[];
}

const SAMPLE_PROMPTS = [
    {
        title: "Relatório de Renovação e Churn - Julho",
        icon: "📊",
        prompt: "Crie uma apresentação executiva sobre o relatório de renovação de julho. Tivemos 570 retornos de clientes. 134 solicitações de cancelamento (23%) e 73 de desconto (12%). Proponha a estratégia de Health Score de Pagamento para antecipar receitas e um fluxo automatizado de retenção via IA para clientes que pedem cancelamento. Defina os próximos passos."
    },
    {
        title: "Lançamento de Produto / Módulo IA",
        icon: "🚀",
        prompt: "Apresentação executiva para lançamento do Módulo FinHero de Análise de Crédito com Inteligência Artificial. Destaque redução de tempo de análise em 80%, aumento na taxa de aprovação segura para 94%, automação de consultas CNPJ e plano de implantação em 3 fases para os próximos 60 dias."
    },
    {
        title: "Planejamento Estratégico de Vendas Q3",
        icon: "🎯",
        prompt: "Apresentação para diretoria sobre a meta de vendas do Q3. Meta principal de R$ 2,5 milhões em novos contratos. Destaque 3 pilares: Expansão na base atual, Prospecção ativa de grandes contas e Automação de cobrança preventiva. Inclua métricas chave e cronograma de execução."
    },
    {
        title: "Reestruturação do Fluxo de Cobrança",
        icon: "💡",
        prompt: "Gere slides para alinhar a reestruturação da régua de cobrança. Problema atual: inadimplência em 8,5% no 30+ dias. Solução proposta: régua multicanal via WhatsApp e e-mail com ofertas automáticas de parcelamento e abatimento de juros. Meta: reduzir inadimplência para 4% até o final do ano."
    }
];

const DEFAULT_PRESENTATION: PresentationData = {
    "presentation_title": "Principais Insights e Estratégias de Renovação",
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
            "title": "Principais Insights - Julho",
            "subtitle": "Qualificação dos retornos via Trable e E-mail",
            "layout": "split_table_metrics",
            "content": {
                "total_volume": "570 retornos",
                "key_metrics": [
                    {
                        "label": "Solicitações de Cancelamento",
                        "value": "134 clientes (23%)",
                        "highlight": true
                    },
                    {
                        "label": "Solicitações de Desconto",
                        "value": "73 clientes (12%)",
                        "highlight": true
                    }
                ],
                "insight_takeaway": "Estes dois motivos concentram a maior oportunidade de atuação para alavancar a conversão no mês."
            }
        },
        {
            "slide_number": 2,
            "type": "strategy_card",
            "title": "Ideia 1 - Health Score de Pagamento",
            "subtitle": "Histórico de comportamento para antecipação de receita",
            "layout": "cards_grid",
            "content": {
                "objective": "Antecipar ações preventivas conforme o perfil e momento financeiro do cliente.",
                "variables": [
                    "Pagamento pré-vencimento vs. pós-vencimento",
                    "Tempo de relacionamento (1ª ou 2ª renovação)",
                    "Histórico de liquidação após a virada do mês"
                ],
                "action_example": {
                    "trigger": "Cliente com hábito de pagar após virar o mês",
                    "copy": "Renovando ainda este mês ou antecipando o pagamento, você garante desconto exclusivo."
                }
            }
        },
        {
            "slide_number": 3,
            "type": "strategy_card",
            "title": "Ideia 2 - Fluxo de Reversão para Cancelamentos",
            "subtitle": "Retenção inteligente automatizada via IA",
            "layout": "step_flow",
            "content": {
                "problem_context": "23% da base qualificada solicita cancelamento direto.",
                "proposed_solution": "Intercalagem de fluxo de negociação por IA antes do direcionamento de saída.",
                "ai_approach": "A IA identifica o motivo específico, propõe contrapropostas personalizadas e negocia a manutenção da parceria."
            }
        },
        {
            "slide_number": 4,
            "type": "action_plan",
            "title": "Próximos Passos & Metas",
            "subtitle": "Execução tática para aumento de conversão",
            "layout": "two_column_list",
            "content": {
                "columns": [
                    {
                        "header": "Health Score",
                        "items": [
                            "Classificar base por comportamento financeiro",
                            "Disparar comunicações preventivas segmentadas"
                        ]
                    },
                    {
                        "header": "Fluxo de Cancelamento",
                        "items": [
                            "Construir prompt e árvore de decisão na IA",
                            "Personalizar tratativas conforme intenção detectada"
                        ]
                    }
                ],
                "final_goal": "Elevar a conversão da renovação anual com abordagens personalizadas e preventivas."
            }
        }
    ]
};

const ExecutivePresentations: React.FC = () => {
    const { addToast } = useToast();
    const [promptInput, setPromptInput] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [presentation, setPresentation] = useState<PresentationData>(DEFAULT_PRESENTATION);
    const [jsonInput, setJsonInput] = useState<string>(JSON.stringify(DEFAULT_PRESENTATION, null, 2));
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<'generator' | 'visualizer' | 'json'>('generator');
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [copiedJson, setCopiedJson] = useState<boolean>(false);
    const [copiedOutline, setCopiedOutline] = useState<boolean>(false);
    const [showGoogleSlidesModal, setShowGoogleSlidesModal] = useState<boolean>(false);

    const handleGenerate = async (textToUse?: string) => {
        const textPrompt = textToUse || promptInput;
        if (!textPrompt.trim()) {
            addToast("Digite ou selecione um prompt antes de gerar a apresentação.", "warning");
            return;
        }

        setIsGenerating(true);
        addToast("Gerando apresentação executiva com Inteligência Artificial...", "info");

        try {
            const response = await fetch('/api/generate-presentation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: textPrompt }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `Erro HTTP ${response.status}`);
            }

            const data: PresentationData = await response.json();
            setPresentation(data);
            setJsonInput(JSON.stringify(data, null, 2));
            setJsonError(null);
            setCurrentSlideIndex(0);
            setActiveTab('visualizer');
            addToast("Apresentação gerada com sucesso!", "success");
        } catch (error: any) {
            console.error("Erro na geração de slides:", error);
            addToast(`Falha ao gerar apresentação: ${error.message || 'Tente novamente.'}`, "error");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleJsonChange = (val: string) => {
        setJsonInput(val);
        try {
            const parsed = JSON.parse(val);
            if (!parsed.slides || !Array.isArray(parsed.slides)) {
                setJsonError("O JSON precisa conter uma propriedade 'slides' como array.");
            } else {
                setPresentation(parsed);
                setJsonError(null);
                if (currentSlideIndex >= parsed.slides.length) {
                    setCurrentSlideIndex(0);
                }
            }
        } catch (e: any) {
            setJsonError(`Erro de sintaxe JSON: ${e.message}`);
        }
    };

    const generateTextOutline = (): string => {
        const slides = presentation.slides || [];
        let outline = `# ${presentation.presentation_title || 'Apresentação Executiva'}\n\n`;
        
        slides.forEach((slide) => {
            outline += `----------------------------------------\n`;
            outline += `SLIDE ${slide.slide_number}: ${slide.title.toUpperCase()}\n`;
            if (slide.subtitle) outline += `Subtítulo: ${slide.subtitle}\n`;
            outline += `----------------------------------------\n`;

            if (slide.content?.total_volume) {
                outline += `• Volume Total: ${slide.content.total_volume}\n`;
            }

            if (Array.isArray(slide.content?.key_metrics)) {
                outline += `Métricas Principais:\n`;
                slide.content.key_metrics.forEach(m => {
                    outline += `  - ${m.label}: ${m.value}\n`;
                });
            }

            if (slide.content?.insight_takeaway) {
                outline += `Insight Principal: ${slide.content.insight_takeaway}\n`;
            }

            if (slide.content?.objective) {
                outline += `Objetivo: ${slide.content.objective}\n`;
            }

            if (Array.isArray(slide.content?.variables)) {
                outline += `Variáveis:\n`;
                slide.content.variables.forEach(v => outline += `  - ${v}\n`);
            }

            if (slide.content?.action_example) {
                outline += `Gatilho: ${slide.content.action_example.trigger}\n`;
                outline += `Copy / Abordagem: ${slide.content.action_example.copy}\n`;
            }

            if (slide.content?.problem_context) outline += `Problema: ${slide.content.problem_context}\n`;
            if (slide.content?.proposed_solution) outline += `Solução: ${slide.content.proposed_solution}\n`;
            if (slide.content?.ai_approach) outline += `Abordagem IA: ${slide.content.ai_approach}\n`;

            if (Array.isArray(slide.content?.columns)) {
                slide.content.columns.forEach(col => {
                    outline += `\n${col.header}:\n`;
                    if (Array.isArray(col.items)) {
                        col.items.forEach(it => outline += `  - ${it}\n`);
                    }
                });
            }

            if (slide.content?.final_goal) outline += `\nMeta Final: ${slide.content.final_goal}\n`;
            outline += `\n\n`;
        });

        return outline;
    };

    const copyOutline = () => {
        const text = generateTextOutline();
        navigator.clipboard.writeText(text);
        setCopiedOutline(true);
        setTimeout(() => setCopiedOutline(false), 2000);
        addToast("Roteiro estruturado copiado com sucesso!", "success");
    };

    const copyJson = () => {
        navigator.clipboard.writeText(jsonInput);
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2000);
        addToast("JSON da apresentação copiado!", "success");
    };

    const handleOpenGoogleSlides = () => {
        window.open('https://slides.new', '_blank');
        setShowGoogleSlidesModal(true);
    };

    const handlePrintPDF = () => {
        window.print();
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
            setIsFullscreen(false);
        }
    };

    const slides = presentation.slides || [];
    const currentSlide = slides[currentSlideIndex] || slides[0];

    const prevSlide = () => {
        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
    };

    const nextSlide = () => {
        setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#101828] text-[#FF0066] rounded-2xl flex items-center justify-center shadow-md shrink-0">
                        <Presentation size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Gerador de Apresentações com IA
                            </h2>
                            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#FF0066]/10 text-[#FF0066] border border-[#FF0066]/20 uppercase tracking-wider">
                                Interativo
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Digite seu prompt, notas ou dados e crie slides profissionais no padrão da sua marca.
                        </p>
                    </div>
                </div>

                {/* Primary Google Slides Button */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={handleOpenGoogleSlides}
                        className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs font-extrabold transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95"
                    >
                        <ExternalLink size={16} />
                        <span>Abrir no Google Apresentações</span>
                    </button>

                    <button
                        onClick={handlePrintPDF}
                        className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                        title="Imprimir / Exportar PDF"
                    >
                        <Printer size={15} />
                        <span className="hidden sm:inline">Exportar PDF</span>
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 max-w-2xl mx-auto">
                <button
                    onClick={() => setActiveTab('generator')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'generator'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Sparkles size={16} className="text-[#FF0066]" />
                    <span>1. Digitar Prompt & Gerar</span>
                </button>

                <button
                    onClick={() => setActiveTab('visualizer')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'visualizer'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Tv size={16} className="text-purple-500" />
                    <span>2. Ver Slides ({slides.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab('json')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'json'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Code size={16} className="text-blue-500" />
                    <span>3. Estrutura JSON</span>
                </button>
            </div>

            {/* TAB 1: GENERATOR & PROMPT INPUT */}
            {activeTab === 'generator' && (
                <div className="space-y-6">
                    {/* Main Prompt Form */}
                    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-[#FF0066]/10 text-[#FF0066]">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        Insira suas informações ou escolha um exemplo
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Cole relatórios, metas, notas de reunião ou resumos. A IA estruturará os slides automaticamente.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Prompt Input Box */}
                        <div className="space-y-2">
                            <textarea
                                value={promptInput}
                                onChange={(e) => setPromptInput(e.target.value)}
                                rows={6}
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#FF0066] focus:ring-2 focus:ring-[#FF0066]/20 text-sm placeholder:text-slate-400 transition-all leading-relaxed"
                                placeholder="Exemplo: Crie uma apresentação executiva sobre o balanço de cobrança e renovações do mês. Tivemos R$ 1,2M recuperados, 150 novos acordos fechados e precisamos criar uma régua automatizada para inadimplência com metas para o próximo trimestre..."
                            />

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                                <span className="text-xs text-slate-400">
                                    {promptInput.length} caracteres digitados
                                </span>

                                <button
                                    onClick={() => handleGenerate()}
                                    disabled={isGenerating || !promptInput.trim()}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#FF0066] hover:bg-[#e0005a] disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Gerando Slides...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            <span>Gerar Apresentação com IA</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Example Prompt Chips */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex items-center gap-2">
                            <Lightbulb size={18} className="text-amber-500" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                Exemplos Práticos de Teste Rápido
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {SAMPLE_PROMPTS.map((sample, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setPromptInput(sample.prompt);
                                        handleGenerate(sample.prompt);
                                    }}
                                    disabled={isGenerating}
                                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-left transition-all group flex flex-col justify-between gap-3 hover:border-[#FF0066]/50"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-lg">{sample.icon}</span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#FF0066] transition-colors">
                                            {sample.title}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                        {sample.prompt}
                                    </p>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#FF0066] pt-1">
                                        <span>Usar este exemplo e gerar</span>
                                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: SLIDE VISUALIZER */}
            {activeTab === 'visualizer' && (
                <div className="space-y-4">
                    {/* Presentation Toolbar Header */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                Título:
                            </span>
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                                {presentation.presentation_title || 'Apresentação Gerada'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleOpenGoogleSlides}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold hover:bg-amber-500/20 transition-all"
                            >
                                <ExternalLink size={14} />
                                <span>Exportar p/ Google Slides</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('generator')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-all"
                            >
                                <Sparkles size={14} className="text-[#FF0066]" />
                                <span>Novo Prompt</span>
                            </button>
                        </div>
                    </div>

                    {/* Presentation Canvas Container */}
                    <div className="bg-[#101828] text-[#101828] rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 min-h-[520px] flex flex-col justify-between relative overflow-hidden transition-all">
                        {/* Slide Top Accent Bar */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF0066] via-purple-500 to-[#FF0066]" />

                        {/* Top Metadata Header */}
                        <div className="flex items-center justify-between pb-6 border-b border-slate-800 text-slate-300">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-[#FF0066]" />
                                <span className="text-xs font-black tracking-widest text-slate-300 uppercase font-mono">
                                    {presentation.presentation_title || 'Apresentação Executiva'}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                    Slide {currentSlideIndex + 1} / {slides.length}
                                </span>
                                <button
                                    onClick={toggleFullscreen}
                                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                                    title="Tela cheia"
                                >
                                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* SLIDE CONTENT DISPLAY */}
                        {currentSlide ? (
                            <div className="py-8 my-auto space-y-6 text-[#101828]">
                                {/* Slide Title & Subtitle Card */}
                                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-l-8 border-[#FF0066]">
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#101828] tracking-tight">
                                            {currentSlide.title}
                                        </h3>
                                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#101828] text-white uppercase tracking-wider">
                                            {currentSlide.type}
                                        </span>
                                    </div>
                                    {currentSlide.subtitle && (
                                        <p className="text-sm font-medium text-[#667085] mt-1">
                                            {currentSlide.subtitle}
                                        </p>
                                    )}
                                </div>

                                {/* Slide Layout Renderers */}

                                {/* 1. Split Table / Metrics Summary */}
                                {(currentSlide.layout === 'split_table_metrics' || currentSlide.type === 'metrics_summary') && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Total Volume */}
                                        {currentSlide.content?.total_volume && (
                                            <div className="bg-[#F3F3F3] p-6 rounded-2xl border border-slate-300 flex flex-col justify-center items-center text-center">
                                                <TrendingUp className="text-[#FF0066] mb-2" size={32} />
                                                <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Volume Total</span>
                                                <span className="text-3xl font-black text-[#101828] mt-1">
                                                    {currentSlide.content.total_volume}
                                                </span>
                                            </div>
                                        )}

                                        {/* Key Metrics */}
                                        <div className="md:col-span-2 space-y-3">
                                            {Array.isArray(currentSlide.content?.key_metrics) &&
                                                currentSlide.content.key_metrics.map((m: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className={`p-4 rounded-2xl flex items-center justify-between ${
                                                            m.highlight
                                                                ? 'bg-white border-2 border-[#FF0066] shadow-md'
                                                                : 'bg-[#F3F3F3] border border-slate-300'
                                                        }`}
                                                    >
                                                        <span className="text-sm font-bold text-[#101828]">{m.label}</span>
                                                        <span className="text-base font-black text-[#FF0066] bg-[#FF0066]/10 px-3 py-1 rounded-xl">
                                                            {m.value}
                                                        </span>
                                                    </div>
                                                ))}

                                            {currentSlide.content?.insight_takeaway && (
                                                <div className="p-4 rounded-2xl bg-[#101828] text-white flex items-start gap-3">
                                                    <Zap className="text-[#FF0066] shrink-0 mt-0.5" size={20} />
                                                    <p className="text-xs font-semibold leading-relaxed">
                                                        {currentSlide.content.insight_takeaway}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 2. Cards Grid Layout */}
                                {(currentSlide.layout === 'cards_grid' || currentSlide.type === 'strategy_card') && !currentSlide.content?.problem_context && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Objective & Variables */}
                                        <div className="bg-[#F3F3F3] p-6 rounded-2xl border border-slate-300 space-y-4">
                                            <div className="flex items-center gap-2 text-[#FF0066] font-bold text-xs uppercase tracking-wider">
                                                <Target size={18} />
                                                <span>Objetivo da Estratégia</span>
                                            </div>
                                            <p className="text-sm font-bold text-[#101828]">
                                                {currentSlide.content?.objective}
                                            </p>

                                            {Array.isArray(currentSlide.content?.variables) && (
                                                <div className="pt-2 border-t border-slate-300">
                                                    <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block mb-2">
                                                        Variáveis Consideradas:
                                                    </span>
                                                    <ul className="space-y-2">
                                                        {currentSlide.content.variables.map((v: string, i: number) => (
                                                            <li key={i} className="flex items-center gap-2 text-xs font-medium text-[#101828]">
                                                                <div className="w-2 h-2 rounded-full bg-[#FF0066]" />
                                                                <span>{v}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Example Card */}
                                        {currentSlide.content?.action_example && (
                                            <div className="bg-[#101828] text-white p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
                                                <div className="space-y-2">
                                                    <span className="text-xs font-bold text-[#FF0066] uppercase tracking-wider">
                                                        Gatilho de Ação
                                                    </span>
                                                    <p className="text-sm font-bold text-slate-200">
                                                        "{currentSlide.content.action_example.trigger}"
                                                    </p>
                                                </div>

                                                <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-1">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                                                        Exemplo de Abordagem / Copy:
                                                    </span>
                                                    <p className="text-xs font-medium text-white italic">
                                                        "{currentSlide.content.action_example.copy}"
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 3. Step Flow Layout */}
                                {(currentSlide.layout === 'step_flow' || currentSlide.content?.problem_context) && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-[#101828] text-white p-5 rounded-2xl border border-red-500/30 flex items-start gap-3">
                                                <ShieldAlert className="text-[#FF0066] shrink-0 mt-0.5" size={24} />
                                                <div>
                                                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Contexto / Problema</span>
                                                    <p className="text-sm font-bold mt-1">{currentSlide.content?.problem_context}</p>
                                                </div>
                                            </div>

                                            <div className="bg-white p-5 rounded-2xl border-2 border-[#FF0066] shadow-md flex items-start gap-3">
                                                <CheckCircle2 className="text-[#FF0066] shrink-0 mt-0.5" size={24} />
                                                <div>
                                                    <span className="text-xs font-bold text-[#FF0066] uppercase tracking-wider">Proposta de Solução</span>
                                                    <p className="text-sm font-bold text-[#101828] mt-1">{currentSlide.content?.proposed_solution}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {currentSlide.content?.ai_approach && (
                                            <div className="bg-[#F3F3F3] p-5 rounded-2xl border border-slate-300 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#101828] text-[#FF0066] flex items-center justify-center shrink-0 font-black">
                                                    IA
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Abordagem Automatizada por IA</span>
                                                    <p className="text-xs font-bold text-[#101828] mt-0.5">{currentSlide.content.ai_approach}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 4. Action Plan / Two Column List */}
                                {(currentSlide.layout === 'two_column_list' || currentSlide.type === 'action_plan') && !currentSlide.content?.problem_context && !currentSlide.content?.total_volume && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {Array.isArray(currentSlide.content?.columns) &&
                                                currentSlide.content.columns.map((col: any, idx: number) => (
                                                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-300 shadow-md space-y-3">
                                                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                                                            <div className="w-3 h-3 rounded-full bg-[#FF0066]" />
                                                            <h4 className="text-base font-extrabold text-[#101828]">{col.header}</h4>
                                                        </div>
                                                        <ul className="space-y-2">
                                                            {Array.isArray(col.items) &&
                                                                col.items.map((item: string, i: number) => (
                                                                    <li key={i} className="flex items-start gap-2 text-xs font-semibold text-[#667085]">
                                                                        <ArrowRight size={14} className="text-[#FF0066] shrink-0 mt-0.5" />
                                                                        <span>{item}</span>
                                                                    </li>
                                                                ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                        </div>

                                        {currentSlide.content?.final_goal && (
                                            <div className="bg-[#101828] text-white p-5 rounded-2xl border border-slate-800 text-center flex items-center justify-center gap-3">
                                                <Target size={20} className="text-[#FF0066]" />
                                                <p className="text-xs font-extrabold tracking-wide uppercase">
                                                    Meta Final: <span className="text-white normal-case font-bold">{currentSlide.content.final_goal}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-slate-400">
                                Nenhum slide disponível.
                            </div>
                        )}

                        {/* Footer Controls */}
                        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                            <button
                                onClick={prevSlide}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
                            >
                                <ChevronLeft size={16} />
                                <span>Anterior</span>
                            </button>

                            {/* Slide Dot Indicators */}
                            <div className="flex items-center gap-2">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentSlideIndex(i)}
                                        className={`h-2.5 rounded-full transition-all ${
                                            i === currentSlideIndex
                                                ? 'w-8 bg-[#FF0066]'
                                                : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                                        }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextSlide}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF0066] hover:bg-[#e0005a] text-white text-xs font-bold transition-all shadow-md"
                            >
                                <span>Próximo</span>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: JSON EDITOR */}
            {activeTab === 'json' && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Code size={18} className="text-blue-500" />
                                <span>Estrutura JSON do Slide Deck</span>
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Edite diretamente o JSON para atualizar a apresentação em tempo real
                            </p>
                        </div>

                        <button
                            onClick={copyJson}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all"
                        >
                            {copiedJson ? <Check size={14} /> : <Copy size={14} />}
                            <span>{copiedJson ? 'Copiado!' : 'Copiar JSON'}</span>
                        </button>
                    </div>

                    {jsonError && (
                        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-600 dark:text-red-400">
                            {jsonError}
                        </div>
                    )}

                    <textarea
                        value={jsonInput}
                        onChange={(e) => handleJsonChange(e.target.value)}
                        rows={18}
                        className="w-full font-mono text-xs p-4 rounded-2xl bg-slate-950 text-emerald-400 border border-slate-800 focus:outline-none focus:border-[#FF0066] transition-all"
                        placeholder="Cole seu JSON de slides aqui..."
                    />
                </div>
            )}

            {/* GOOGLE SLIDES EXPORT MODAL */}
            {showGoogleSlidesModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative animate-scale-up">
                        <button
                            onClick={() => setShowGoogleSlidesModal(false)}
                            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <ExternalLink size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Exportar para o Google Apresentações
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Siga os passos abaixo para transferir o conteúdo gerado para o Google Slides
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                                        1
                                    </div>
                                    <p className="text-xs text-slate-700 dark:text-slate-300">
                                        Uma nova aba foi aberta no <strong>Google Apresentações</strong> (<code className="text-amber-600 dark:text-amber-400 font-mono">slides.new</code>).
                                    </p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                                        2
                                    </div>
                                    <p className="text-xs text-slate-700 dark:text-slate-300">
                                        Clique no botão abaixo para copiar o <strong>roteiro completo e estruturado</strong> dos slides para a sua área de transferência.
                                    </p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                                        3
                                    </div>
                                    <p className="text-xs text-slate-700 dark:text-slate-300">
                                        Cole o conteúdo diretamente no seu Google Slides ou use a opção <strong>Arquivo &gt; Importar slides</strong>.
                                    </p>
                                </div>
                            </div>

                            {/* Copy Outline Button */}
                            <button
                                onClick={copyOutline}
                                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#FF0066] hover:bg-[#e0005a] text-white font-bold text-xs transition-all shadow-md active:scale-95"
                            >
                                {copiedOutline ? <Check size={16} /> : <Copy size={16} />}
                                <span>{copiedOutline ? 'Roteiro Copiado!' : 'Copiar Roteiro dos Slides em Texto'}</span>
                            </button>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                            <button
                                onClick={() => setShowGoogleSlidesModal(false)}
                                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-all"
                            >
                                Concluído
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExecutivePresentations;
