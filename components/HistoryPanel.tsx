import React from 'react';
import { TrashIcon, HistoryIcon } from './icons';

interface AnalysisData {
    id: string;
    name: string;
    date: string;
    lifePathNumber: number;
    analysis: string;
    formData: any;
}

interface HistoryPanelProps {
    history: AnalysisData[];
    isOpen: boolean;
    onClose: () => void;
    onSelect: (analysis: AnalysisData) => void;
    onDelete: (id: string) => void;
    language: string;
    currentAnalysisId?: string;
}

const translations: { [key: string]: { [key: string]: string } } = {
    es: {
        historyTitle: "Historial de Consultas",
        noHistoryTitle: "Tu viaje comienza ahora",
        noHistoryMessage: "Aún no tienes consultas guardadas. ¡Genera tu primer análisis para verlo aquí!",
        delete: "Eliminar",
        close: "Cerrar panel",
    },
    en: {
        historyTitle: "Query History",
        noHistoryTitle: "Your journey starts now",
        noHistoryMessage: "You have no saved queries yet. Generate your first analysis to see it here!",
        delete: "Delete",
        close: "Close panel",
    },
    pt: {
        historyTitle: "Histórico de Consultas",
        noHistoryTitle: "Sua jornada começa agora",
        noHistoryMessage: "Você ainda não tem consultas salvas. Gere sua primeira análise para vê-la aqui!",
        delete: "Excluir",
        close: "Fechar painel",
    },
    fr: {
        historyTitle: "Historique des Consultations",
        noHistoryTitle: "Votre voyage commence maintenant",
        noHistoryMessage: "Vous n'avez aucune consultation enregistrée. Générez votre première analyse pour la voir ici !",
        delete: "Supprimer",
        close: "Fermer le panneau",
    },
    de: {
        historyTitle: "Abfrageverlauf",
        noHistoryTitle: "Deine Reise beginnt jetzt",
        noHistoryMessage: "Du hast noch keine gespeicherten Abfragen. Erstelle deine erste Analyse, um sie hier zu sehen!",
        delete: "Löschen",
        close: "Panel schließen",
    },
    it: {
        historyTitle: "Cronologia Consultazioni",
        noHistoryTitle: "Il tuo viaggio inizia ora",
        noHistoryMessage: "Non hai ancora consultazioni salvate. Genera la tua prima analisi per vederla qui!",
        delete: "Elimina",
        close: "Chiudi pannello",
    },
     ru: {
        historyTitle: "История запросов",
        noHistoryTitle: "Ваше путешествие начинается сейчас",
        noHistoryMessage: "У вас пока нет сохраненных запросов. Создайте свой первый анализ, чтобы увидеть его здесь!",
        delete: "Удалить",
        close: "Закрыть панель",
    },
    zh: {
        historyTitle: "查询历史",
        noHistoryTitle: "你的旅程现在开始",
        noHistoryMessage: "您还没有已保存的查询。生成您的第一个分析即可在此处查看！",
        delete: "删除",
        close: "关闭面板",
    },
    ja: {
        historyTitle: "クエリ履歴",
        noHistoryTitle: "あなたの旅は今始まります",
        noHistoryMessage: "まだ保存されたクエリはありません。最初の分析を生成して、ここに表示してください！",
        delete: "削除",
        close: "パネルを閉じる",
    },
    hi: {
        historyTitle: "क्वेरी इतिहास",
        noHistoryTitle: "आपकी यात्रा अब शुरू होती है",
        noHistoryMessage: "आपके पास अभी तक कोई सहेजी गई क्वेरी नहीं है। इसे यहाँ देखने के लिए अपना पहला विश्लेषण उत्पन्न करें!",
        delete: "हटाएं",
        close: "पैनल बंद करें",
    },
    ar: {
        historyTitle: "سجل الاستعلامات",
        noHistoryTitle: "رحلتك تبدأ الآن",
        noHistoryMessage: "ليس لديك استعلامات محفوظة بعد. قم بإنشاء تحليلك الأول لرؤيته هنا!",
        delete: "حذف",
        close: "إغلاق اللوحة",
    },
};

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, isOpen, onClose, onSelect, onDelete, language, currentAnalysisId }) => {
    const t = translations[language];
    const isRtl = language === 'ar';

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-20 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden={!isOpen}
            />
            <aside 
                className={`fixed top-0 h-full w-full max-w-sm bg-slate-900/[.95] backdrop-blur-sm shadow-2xl z-30 flex flex-col
                           transition-transform duration-500 ease-in-out
                           ${isRtl ? 'left-0' : 'right-0'}
                           ${isOpen ? 'translate-x-0' : (isRtl ? '-translate-x-full' : 'translate-x-full')}`}
                aria-hidden={!isOpen}
            >
                <header className={`flex-shrink-0 flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800/50 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <HistoryIcon className="w-6 h-6 text-indigo-400" />
                        <h2 className="text-xl font-bold text-slate-100">{t.historyTitle}</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors" aria-label={t.close}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <div className="flex-grow overflow-y-auto p-4 bg-slate-900/50 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-8">
                            <HistoryIcon className="w-16 h-16 mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold text-slate-400">{t.noHistoryTitle}</h3>
                            <p className="max-w-xs text-sm">{t.noHistoryMessage}</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {history.map((item, index) => (
                                <li 
                                    key={item.id} 
                                    className={`relative group rounded-lg transition-all duration-300 animate-fade-in-stagger ${item.id === currentAnalysisId ? 'ring-2 ring-indigo-500 bg-slate-800' : 'bg-slate-800/50 hover:bg-slate-800/80 hover:ring-1 hover:ring-indigo-500/50'}`}
                                    style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                                >
                                    <div 
                                        onClick={() => onSelect(item)} 
                                        className={`flex items-center gap-4 p-3 cursor-pointer w-full ${isRtl ? 'flex-row-reverse' : ''}`}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && onSelect(item)}
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 shadow-md group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-white font-bold text-xl">{item.lifePathNumber}</span>
                                        </div>
                                        <div className={`flex-grow overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}>
                                            <p className="font-semibold text-slate-100 truncate">{item.name}</p>
                                            <p className="text-xs text-slate-400">{new Date(item.date).toLocaleString(language)}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(item.id);
                                        }} 
                                        className={`absolute top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-red-400 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 ${isRtl ? 'left-3' : 'right-3'}`}
                                        aria-label={`${t.delete} ${item.name}`}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </aside>
        </>
    );
};

export default HistoryPanel;