import React, { useState, useRef, useEffect } from 'react';
import { StarIcon, PdfIcon, DownloadIcon, ShareIcon, TwitterIcon, FacebookIcon, WhatsAppIcon, CopyLinkIcon, SunIcon, MountainPathIcon, CompassIcon, IntertwinedHeartsIcon, LotusIcon, BookOpenIcon, SparklesIcon, NewQueryIcon } from './icons';
import Loader from './Loader';

declare const html2canvas: any;
declare const jspdf: any;

interface AnalysisData {
    id: string;
    name: string;
    date: string;
    lifePathNumber: number;
    analysis: string;
    formData: any;
}

interface ResultDisplayProps {
    analysisData: AnalysisData;
    onNewQuery: () => void;
    language: string;
}

const translations: { [key: string]: { [key: string]: string } } = {
    es: {
        lifePathNumberIs: "Tu Número de Camino de Vida es",
        masterNumber: "¡Un Número Maestro!",
        powerfulPath: "Un camino de poder y propósito",
        savePdf: "Guardar PDF",
        downloadTxt: "Descargar (.txt)",
        share: "Compartir",
        shareOnX: "Compartir en X",
        shareOnFacebook: "Compartir en Facebook",
        shareOnWhatsApp: "Compartir en WhatsApp",
        copyLink: "Copiar Enlace",
        copied: "¡Copiado!",
        shareMessage: "¡Descubrí mi Número de Camino de Vida:",
        shareDiscover: "Averigua el tuyo y lo que revela sobre tu destino en Numerología del Ser.",
        shareTitle: "Mi Análisis Numerológico en Numerología del Ser",
        section: "Sección",
        newQuery: "Nueva Consulta",
    },
    en: {
        lifePathNumberIs: "Your Life Path Number is",
        masterNumber: "A Master Number!",
        powerfulPath: "A path of power and purpose",
        savePdf: "Save PDF",
        downloadTxt: "Download (.txt)",
        share: "Share",
        shareOnX: "Share on X",
        shareOnFacebook: "Share on Facebook",
        shareOnWhatsApp: "Share on WhatsApp",
        copyLink: "Copy Link",
        copied: "Copied!",
        shareMessage: "I discovered my Life Path Number:",
        shareDiscover: "Find out yours and what it reveals about your destiny at Numerology of the Self.",
        shareTitle: "My Numerology Analysis at Numerology of the Self",
        section: "Section",
        newQuery: "New Query",
    },
    pt: {
        lifePathNumberIs: "O seu Número de Caminho de Vida é",
        masterNumber: "Um Número Mestre!",
        powerfulPath: "Um caminho de poder e propósito",
        savePdf: "Salvar PDF",
        downloadTxt: "Baixar (.txt)",
        share: "Compartilhar",
        shareOnX: "Compartilhar no X",
        shareOnFacebook: "Compartilhar no Facebook",
        shareOnWhatsApp: "Compartilhar no WhatsApp",
        copyLink: "Copiar Link",
        copied: "Copiado!",
        shareMessage: "Descobri o meu Número de Caminho de Vida:",
        shareDiscover: "Descubra o seu e o que ele revela sobre o seu destino na Numerologia do Ser.",
        shareTitle: "Minha Análise Numerológica na Numerologia do Ser",
        newQuery: "Nova Consulta",
    },
    fr: {
        lifePathNumberIs: "Votre Numéro de Chemin de Vie est",
        masterNumber: "Un Nombre Maître !",
        powerfulPath: "Un chemin de pouvoir et de but",
        savePdf: "Enregistrer en PDF",
        downloadTxt: "Télécharger (.txt)",
        share: "Partager",
        shareOnX: "Partager sur X",
        shareOnFacebook: "Partager sur Facebook",
        shareOnWhatsApp: "Partager sur WhatsApp",
        copyLink: "Copier le lien",
        copied: "Copié !",
        shareMessage: "J'ai découvert mon Numéro de Chemin de Vie :",
        shareDiscover: "Découvrez le vôtre et ce qu'il révèle sur votre destin sur Numérologie de l'Être.",
        shareTitle: "Mon Analyse Numérologique sur Numérologie de l'Être",
        newQuery: "Nouvelle Consultation",
    },
    de: {
        lifePathNumberIs: "Ihre Lebenswegnummer ist",
        masterNumber: "Eine Meisternummer!",
        powerfulPath: "Ein Weg der Macht und Bestimmung",
        savePdf: "PDF speichern",
        downloadTxt: "Herunterladen (.txt)",
        share: "Teilen",
        shareOnX: "Auf X teilen",
        shareOnFacebook: "Auf Facebook teilen",
        shareOnWhatsApp: "Auf WhatsApp teilen",
        copyLink: "Link kopieren",
        copied: "Kopiert!",
        shareMessage: "Ich habe meine Lebenswegnummer entdeckt:",
        shareDiscover: "Finden Sie Ihre heraus und was sie über Ihr Schicksal bei der Numerologie des Selbst enthüllt.",
        shareTitle: "Meine numerologische Analyse bei der Numerologie des Selbst",
        newQuery: "Neue Abfrage",
    },
    it: {
        lifePathNumberIs: "Il tuo Numero del Percorso di Vita è",
        masterNumber: "Un Numero Maestro!",
        powerfulPath: "Un percorso di potere e scopo",
        savePdf: "Salva PDF",
        downloadTxt: "Scarica (.txt)",
        share: "Condividi",
        shareOnX: "Condividi su X",
        shareOnFacebook: "Condividi su Facebook",
        shareOnWhatsApp: "Condividi su WhatsApp",
        copyLink: "Copia Link",
        copied: "Copiato!",
        shareMessage: "Ho scoperto il mio Numero del Percorso di Vita:",
        shareDiscover: "Scopri il tuo e cosa rivela sul tuo destino su Numerologia dell'Essere.",
        shareTitle: "La mia Analisi Numerologica su Numerologia dell'Essere",
        newQuery: "Nuova Domanda",
    },
    ru: {
        lifePathNumberIs: "Ваше Число Жизненного Пути",
        masterNumber: "Мастер-Число!",
        powerfulPath: "Путь силы и предназначения",
        savePdf: "Сохранить PDF",
        downloadTxt: "Скачать (.txt)",
        share: "Поделиться",
        shareOnX: "Поделиться в X",
        shareOnFacebook: "Поделиться в Facebook",
        shareOnWhatsApp: "Поделиться в WhatsApp",
        copyLink: "Копировать ссылку",
        copied: "Скопировано!",
        shareMessage: "Я узнал(а) свое Число Жизненного Пути:",
        shareDiscover: "Узнайте свое и что оно говорит о вашей судьбе в Нумерологии Сущности.",
        shareTitle: "Мой нумерологический анализ в Нумерологии Сущности",
        newQuery: "Новый запрос",
    },
    zh: {
        lifePathNumberIs: "你的生命路径数字是",
        masterNumber: "一个大师数！",
        powerfulPath: "一条充满力量与目标的道路",
        savePdf: "保存为PDF",
        downloadTxt: "下载 (.txt)",
        print: "打印",
        share: "分享",
        shareOnX: "在X上分享",
        shareOnFacebook: "在Facebook上分享",
        shareOnWhatsApp: "在WhatsApp上分享",
        copyLink: "复制链接",
        copied: "已复制！",
        shareMessage: "我发现了我的生命路径数字：",
        shareDiscover: "在“自我命理学”中找出你的数字以及它揭示的你的命运。",
        shareTitle: "我在“自我命理学”的命理分析",
        newQuery: "新查询",
    },
    ja: {
        lifePathNumberIs: "あなたのライフパスナンバーは",
        masterNumber: "マスターナンバーです！",
        powerfulPath: "力と目的の道",
        savePdf: "PDFとして保存",
        downloadTxt: "ダウンロード (.txt)",
        share: "共有",
        shareOnX: "Xで共有",
        shareOnFacebook: "Facebookで共有",
        shareOnWhatsApp: "WhatsAppで共有",
        copyLink: "リンクをコピー",
        copied: "コピーしました！",
        shareMessage: "私のライフパスナンバーを見つけました：",
        shareDiscover: "「自己の数秘術」であなたのナンバーとそれがあなたの運命について何を明らかにしているかを見つけてください。",
        shareTitle: "「自己の数秘術」での私の数秘術分析",
        newQuery: "新しいクエリ",
    },
    hi: {
        lifePathNumberIs: "आपका जीवन पथ संख्या है",
        masterNumber: "एक मास्टर संख्या!",
        powerfulPath: "शक्ति और उद्देश्य का मार्ग",
        savePdf: "पीडीएफ सहेजें",
        downloadTxt: "डाउनलोड (.txt)",
        share: "शेयर करें",
        shareOnX: "X पर शेयर करें",
        shareOnFacebook: "फेसबुक पर शेयर करें",
        shareOnWhatsApp: "व्हाट्सएप पर शेयर करें",
        copyLink: "लिंक कॉपी करें",
        copied: "कॉपी किया गया!",
        shareMessage: "मैंने अपनी जीवन पथ संख्या की खोज की:",
        shareDiscover: "अपनी संख्या और यह आपके भाग्य के बारे में क्या खुलासा करता है, 'आत्म अंकज्योतिष' पर जानें।",
        shareTitle: "'आत्म अंकज्योतिष' पर मेरा अंकज्योतिष विश्लेषण",
        newQuery: "नई क्वेरी",
    },
    ar: {
        lifePathNumberIs: "रقم مسار حياتك هو",
        masterNumber: "رقم سائد!",
        powerfulPath: "مسار القوة والهدف",
        savePdf: "حفظ بصيغة PDF",
        downloadTxt: "تنزيل (.txt)",
        share: "مشاركة",
        shareOnX: "المشاركة على X",
        shareOnFacebook: "المشاركة على فيسبوك",
        shareOnWhatsApp: "المشاركة على واتساب",
        copyLink: "نسخ الرابط",
        copied: "تم النسخ!",
        shareMessage: "لقد اكتشفت رقم مسار حياتي:",
        shareDiscover: "اكتشف رقمك وما يكشفه عن مصيرك في 'علم أعداد الذات'.",
        shareTitle: "تحليلي في علم الأعداد في 'علم أعداد الذات'",
        newQuery: "استعلام جديد",
    }
};

const sectionKeywords: { [key: string]: { [key: string]: string } } = {
    es: {
        personality: "Personalidad",
        challenges: "Desafíos",
        career: "Carrera",
        relationships: "Relaciones",
        growth: "Crecimiento",
        recommendations: "Recomendaciones",
        journey: "Viaje",
    },
    en: {
        personality: "Personality",
        challenges: "Challenges",
        career: "Career",
        relationships: "Relationships",
        growth: "Growth",
        recommendations: "Recommendations",
        journey: "Journey",
    },
    pt: {
        personality: "Personalidade",
        challenges: "Desafios",
        career: "Carreira",
        relationships: "Relacionamentos",
        growth: "Crescimento",
        recommendations: "Recomendações",
        journey: "Jornada",
    },
    fr: {
        personality: "Personnalité",
        challenges: "Défis",
        career: "Carrière",
        relationships: "Relations",
        growth: "Croissance",
        recommendations: "Recommandations",
        journey: "Voyage",
    },
    de: {
        personality: "Persönlichkeitsmerkmale",
        challenges: "Herausforderungen",
        career: "Karriere",
        relationships: "Beziehungen",
        growth: "Wachstumstipps",
        recommendations: "Empfehlungen",
        journey: "Reise",
    },
    it: {
        personality: "Personalità",
        challenges: "Sfide",
        career: "Carriera",
        relationships: "Relazioni",
        growth: "Crescita",
        recommendations: "Raccomandazioni",
        journey: "Viaggio",
    },
    ru: {
        personality: "характера",
        challenges: "вызовы",
        career: "Карьера",
        relationships: "Отношения",
        growth: "роста",
        recommendations: "Рекомендации",
        journey: "Путешествие",
    },
    zh: {
        personality: "人格",
        challenges: "挑战",
        career: "职业",
        relationships: "人际关系",
        growth: "成长",
        recommendations: "建议",
        journey: "之旅",
    },
    ja: {
        personality: "性格",
        challenges: "課題",
        career: "キャリア",
        relationships: "人間関係",
        growth: "成長",
        recommendations: "推奨事項",
        journey: "旅",
    },
    hi: {
        personality: "व्यक्तित्व",
        challenges: "चुनौतियां",
        career: "करियर",
        relationships: "रिश्ते",
        growth: "विकास",
        recommendations: "सिफारिशें",
        journey: "यात्रा",
    },
    ar: {
        personality: "شخصية",
        challenges: "تحديات",
        career: "المهني",
        relationships: "العلاقات",
        growth: "للنمو",
        recommendations: "توصيات",
        journey: "رحلة",
    }
};

const parseAnalysisToSections = (text: string, lang: string) => {
    const sections: { title: string; content: string; key: string; }[] = [];
    const rawSections = text.split('###').filter(s => s.trim() !== '');
    const keywords = sectionKeywords[lang as keyof typeof sectionKeywords];

    rawSections.forEach(sectionText => {
        const lines = sectionText.trim().split('\n');
        const title = lines.shift()?.replace(/\*\*/g, '').trim() || 'Section';
        const content = lines.join('\n').trim();
        
        const keywordEntry = Object.entries(keywords).find(([, value]) => title.toLowerCase().includes(value.toLowerCase()));
        const key = keywordEntry ? keywordEntry[0] : 'growth';

        if (content) {
            sections.push({ title, content, key });
        }
    });

    return sections;
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ analysisData, onNewQuery, language }) => {
    const { lifePathNumber, analysis, name, formData } = analysisData;
    const [isShareMenuOpen, setIsShareMenuOpen] = useState<boolean>(false);
    const [copyLinkText, setCopyLinkText] = useState<string>('');
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const shareMenuRef = useRef<HTMLDivElement>(null);
    const t = translations[language];

    const analysisSections = parseAnalysisToSections(analysis, language);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
                setIsShareMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setCopyLinkText(t.copyLink);
    }, [t.copyLink]);

    const handleSavePdf = async () => {
        setLoadingAction('pdf');
        const input = document.querySelector('.printable-section .bg-slate-800\\/60') as HTMLElement;
        if (!input) {
            setLoadingAction(null);
            return;
        }

        try {
            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#1e293b', 
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            const fileName = `analisis-numerologico-${name.toLowerCase().replace(/\s/g, '-')}.pdf`;
            pdf.save(fileName); 

        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setLoadingAction(null);
        }
    };
    
    const handleDownloadTxt = () => {
        setLoadingAction('txt');
        const plainTextAnalysis = analysis
            .replace(/### \*\*(.*?)\*\*/g, '\n--- $1 ---\n')
            .replace(/\*/g, '')
            .split('\n')
            .map(line => line.trim())
            .join('\n')
            .replace(/\n\n+/g, '\n\n');

        const content = `Análisis Numerológico para ${name} - Camino de Vida ${lifePathNumber}\n\n${plainTextAnalysis}`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const fileName = `analisis-numerologico-${name.toLowerCase().replace(/\s/g, '-')}.txt`;
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setLoadingAction(null);
    };
    
    const getShareUrl = () => {
        const params = new URLSearchParams({
            ...formData,
            lang: language
        });
        // Use a stable, public URL for sharing to avoid DNS errors with temporary dev URLs.
        return `https://aistudio.google.com/app/?${params.toString()}`;
    };

    const handleShare = async () => {
        const shareUrl = getShareUrl();
        const shareText = `${t.shareMessage} ${lifePathNumber}! ✨ ${t.shareDiscover}`;
        const shareData = {
            title: t.shareTitle,
            text: shareText,
            url: shareUrl,
        };
        
        setLoadingAction('share');

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error('Error using Web Share API:', error);
                    setIsShareMenuOpen(true);
                }
            }
        } else {
            setIsShareMenuOpen(prev => !prev);
        }
        setLoadingAction(null);
    };

    const handleSharePlatform = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
        setLoadingAction(platform);
        const shareUrl = getShareUrl();
        const shareText = `${t.shareMessage} ${lifePathNumber}! ✨ ${t.shareDiscover}`;
        let url = '';
        const encodedText = encodeURIComponent(shareText + " " + shareUrl);
        const encodedUrl = encodeURIComponent(shareUrl);

        switch (platform) {
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodedText}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'whatsapp':
                url = `https://api.whatsapp.com/send?text=${encodedText}`;
                break;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
        setIsShareMenuOpen(false);
        setTimeout(() => setLoadingAction(null), 1000);
    };

    const handleCopyLink = async () => {
        setLoadingAction('copy');
        const shareUrl = getShareUrl();
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopyLinkText(t.copied);
            setTimeout(() => {
                setCopyLinkText(t.copyLink);
                setIsShareMenuOpen(false);
                setLoadingAction(null);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            setLoadingAction(null);
        }
    };
    
    const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
        personality: SunIcon,
        challenges: MountainPathIcon,
        career: CompassIcon,
        relationships: IntertwinedHeartsIcon,
        growth: LotusIcon,
        recommendations: BookOpenIcon,
        journey: SparklesIcon
    };

    const styleMap: { [key: string]: string } = {
        personality: "bg-green-500/10 border-green-500/30",
        challenges: "bg-red-500/10 border-red-500/30",
        career: "bg-blue-500/10 border-blue-500/30",
        relationships: "bg-pink-500/10 border-pink-500/30",
        growth: "bg-yellow-500/10 border-yellow-500/30",
        recommendations: "bg-purple-500/10 border-purple-500/30",
        journey: "bg-indigo-500/10 border-indigo-500/30"
    };

    const secondaryButtonClasses = "flex items-center justify-center gap-2 w-full sm:w-auto font-bold py-2 px-4 rounded-md shadow-md border border-slate-600 bg-gradient-to-br from-slate-700 to-slate-800 text-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-500/50 transition-all duration-300 transform hover:-translate-y-px hover:shadow-lg hover:shadow-slate-800/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
    const primaryButtonClasses = "flex items-center justify-center gap-2 w-full sm:w-auto font-bold py-2 px-4 rounded-md shadow-md border border-transparent bg-gradient-to-br from-indigo-600 to-purple-600 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-300 transform hover:-translate-y-px hover:shadow-lg hover:shadow-indigo-500/40 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none disabled:from-indigo-700 disabled:to-purple-700";


    return (
        <>
            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-lg p-6 sm:p-8 shadow-2xl shadow-purple-900/40 animate-fade-in-up">
                <header className="text-center border-b border-slate-700 pb-4 mb-6">
                    <h3 className="text-lg font-medium text-indigo-400">{t.lifePathNumberIs}</h3>
                    <p className="text-6xl sm:text-7xl font-bold my-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
                        {lifePathNumber}
                    </p>
                    <div className="flex justify-center items-center gap-2 mt-2 text-yellow-400">
                        <StarIcon className="w-5 h-5"/>
                        {lifePathNumber === 11 || lifePathNumber === 22 || lifePathNumber === 33 ? (
                           <p className="text-sm font-semibold">{t.masterNumber}</p>
                        ) : (
                           <p className="text-sm font-semibold">{t.powerfulPath}</p>
                        )}
                    </div>
                </header>
                
                <div className="space-y-6">
                    {analysisSections.map((section, index) => {
                        const IconComponent = iconMap[section.key] || LotusIcon;
                        const styleClass = styleMap[section.key] || styleMap.growth;

                        return (
                            <div key={index} className={`border rounded-lg p-4 transition-all duration-300 ${styleClass}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <IconComponent className="w-6 h-6 text-slate-300 flex-shrink-0" />
                                    <h2 className="text-xl font-bold text-slate-200">{section.title}</h2>
                                </div>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{section.content}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 no-print">
                <button
                    onClick={onNewQuery}
                    disabled={!!loadingAction}
                    className={secondaryButtonClasses}
                >
                    <NewQueryIcon className="w-5 h-5" />
                    {t.newQuery}
                </button>
                <button
                    onClick={handleSavePdf}
                    disabled={!!loadingAction}
                    className={secondaryButtonClasses}
                >
                    {loadingAction === 'pdf' ? <Loader /> : <PdfIcon className="w-5 h-5" />}
                    {t.savePdf}
                </button>
                <button
                    onClick={handleDownloadTxt}
                    disabled={!!loadingAction}
                    className={secondaryButtonClasses}
                >
                     {loadingAction === 'txt' ? <Loader /> : <DownloadIcon className="w-5 h-5" />}
                    {t.downloadTxt}
                </button>
                <div className="relative w-full sm:w-auto" ref={shareMenuRef}>
                    <button
                        onClick={handleShare}
                        disabled={!!loadingAction}
                        className={primaryButtonClasses}
                    >
                        {loadingAction === 'share' ? <Loader /> : <ShareIcon className="w-5 h-5" />}
                        {t.share}
                    </button>
                    
                    {isShareMenuOpen && (
                        <div className="absolute bottom-full mb-2 w-full origin-bottom sm:w-56 bg-slate-700 border border-slate-600 rounded-lg shadow-xl overflow-hidden animate-fade-in-up-sm z-20">
                            <ul className="divide-y divide-slate-600">
                                <li>
                                    <button onClick={() => handleSharePlatform('twitter')} disabled={!!loadingAction} className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loadingAction === 'twitter' ? <Loader /> : <TwitterIcon className="w-5 h-5" />}
                                        <span>{t.shareOnX}</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleSharePlatform('facebook')} disabled={!!loadingAction} className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loadingAction === 'facebook' ? <Loader /> : <FacebookIcon className="w-5 h-5" />}
                                        <span>{t.shareOnFacebook}</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleSharePlatform('whatsapp')} disabled={!!loadingAction} className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loadingAction === 'whatsapp' ? <Loader /> : <WhatsAppIcon className="w-5 h-5" />}
                                        <span>{t.shareOnWhatsApp}</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={handleCopyLink} disabled={!!loadingAction} className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loadingAction === 'copy' ? <Loader /> : <CopyLinkIcon className="w-5 h-5" />}
                                        <span>{copyLinkText}</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ResultDisplay;