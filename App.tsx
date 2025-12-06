import React, { useState, useCallback, useEffect } from 'react';
import { calculateLifePathNumber } from './services/numerology';
import { getNumerologyAnalysis } from './services/geminiService';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { SparklesIcon, CalendarIcon, ErrorIcon, UserIcon, MapPinIcon, GlobeIcon, TimeIcon, IdCardIcon, TranslateIcon, HistoryIcon } from './components/icons';
import HistoryPanel from './components/HistoryPanel';

// Define the structure for a single analysis entry
interface AnalysisData {
    id: string;
    name: string;
    date: string;
    lifePathNumber: number;
    analysis: string;
    formData: {
        name: string;
        birthDate: string;
        birthTime: string;
        gender: string;
        city: string;
        country: string;
    };
}

const translations: { [key: string]: { [key: string]: string } } = {
    es: {
        title: "Numerología del Ser",
        subtitle: "Descubre los secretos de tu alma a través de tu fecha de nacimiento.",
        fullName: "Nombre Completo",
        fullNamePlaceholder: "Ej: Ana García",
        birthDate: "Fecha de Nacimiento",
        birthTime: "Hora de Nacimiento",
        gender: "Sexo",
        selectOption: "Selecciona una opción",
        male: "Masculino",
        female: "Femenino",
        noSay: "Prefiero no decirlo",
        birthCity: "Ciudad de Nacimiento",
        birthCityPlaceholder: "Ej: Madrid",
        birthCountry: "País de Nacimiento",
        birthCountryPlaceholder: "Ej: España",
        submitButton: "Revelar mi Destino",
        loadingButton: "Analizando...",
        fillAllFields: "Por favor, completa todos los campos.",
        invalidDate: "La fecha de nacimiento no es válida.",
        errorAnalysis: "Ocurrió un error al generar tu análisis. Por favor, inténtalo de nuevo.",
        history: "Historial",
    },
    en: {
        title: "Numerology of the Self",
        subtitle: "Discover the secrets of your soul through your date of birth.",
        fullName: "Full Name",
        fullNamePlaceholder: "E.g., John Doe",
        birthDate: "Date of Birth",
        birthTime: "Time of Birth",
        gender: "Gender",
        selectOption: "Select an option",
        male: "Male",
        female: "Female",
        noSay: "Prefer not to say",
        birthCity: "City of Birth",
        birthCityPlaceholder: "E.g., New York",
        birthCountry: "Country of Birth",
        birthCountryPlaceholder: "E.g., USA",
        submitButton: "Reveal my Destiny",
        loadingButton: "Analyzing...",
        fillAllFields: "Please fill in all fields.",
        invalidDate: "The date of birth is not valid.",
        errorAnalysis: "An error occurred while generating your analysis. Please try again.",
        history: "History",
    },
    pt: {
        title: "Numerologia do Ser",
        subtitle: "Descubra os segredos da sua alma através da sua data de nascimento.",
        fullName: "Nome Completo",
        fullNamePlaceholder: "Ex: Maria Silva",
        birthDate: "Data de Nascimento",
        birthTime: "Hora de Nascimento",
        gender: "Gênero",
        selectOption: "Selecione uma opção",
        male: "Masculino",
        female: "Feminino",
        noSay: "Prefiro não dizer",
        birthCity: "Cidade de Nascimento",
        birthCityPlaceholder: "Ex: Lisboa",
        birthCountry: "País de Nascimento",
        birthCountryPlaceholder: "Ex: Portugal",
        submitButton: "Revelar meu Destino",
        loadingButton: "Analisando...",
        fillAllFields: "Por favor, preencha todos os campos.",
        invalidDate: "A data de nascimento não é válida.",
        errorAnalysis: "Ocorreu um erro ao gerar sua análise. Por favor, tente novamente.",
        history: "Histórico",
    },
    fr: {
        title: "Numérologie de l'Être",
        subtitle: "Découvrez les secrets de votre âme à travers votre date de naissance.",
        fullName: "Nom Complet",
        fullNamePlaceholder: "Ex: Marie Dubois",
        birthDate: "Date de Naissance",
        birthTime: "Heure de Naissance",
        gender: "Sexe",
        selectOption: "Sélectionnez une option",
        male: "Masculin",
        female: "Féminin",
        noSay: "Je préfère ne pas le dire",
        birthCity: "Ville de Naissance",
        birthCityPlaceholder: "Ex: Paris",
        birthCountry: "Pays de Naissance",
        birthCountryPlaceholder: "Ex: France",
        submitButton: "Révéler ma Destinée",
        loadingButton: "Analyse en cours...",
        fillAllFields: "Veuillez remplir tous les champs.",
        invalidDate: "La date de naissance n'est pas valide.",
        errorAnalysis: "Une erreur est survenue lors de la génération de votre analyse. Veuillez réessayer.",
        history: "Historique",
    },
    de: {
        title: "Numerologie des Selbst",
        subtitle: "Entdecken Sie die Geheimnisse Ihrer Seele durch Ihr Geburtsdatum.",
        fullName: "Vollständiger Name",
        fullNamePlaceholder: "Z.B. Max Mustermann",
        birthDate: "Geburtsdatum",
        birthTime: "Geburtszeit",
        gender: "Geschlecht",
        selectOption: "Wählen Sie eine Option",
        male: "Männlich",
        female: "Weiblich",
        noSay: "Möchte ich nicht sagen",
        birthCity: "Geburtsstadt",
        birthCityPlaceholder: "Z.B. Berlin",
        birthCountry: "Geburtsland",
        birthCountryPlaceholder: "Z.B. Deutschland",
        submitButton: "Mein Schicksal enthüllen",
        loadingButton: "Analysiere...",
        fillAllFields: "Bitte füllen Sie alle Felder aus.",
        invalidDate: "Das Geburtsdatum ist ungültig.",
        errorAnalysis: "Bei der Erstellung Ihrer Analyse ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        history: "Verlauf",
    },
    it: {
        title: "Numerologia dell'Essere",
        subtitle: "Scopri i segreti della tua anima attraverso la tua data di nascita.",
        fullName: "Nome Completo",
        fullNamePlaceholder: "Es: Mario Rossi",
        birthDate: "Data di Nascita",
        birthTime: "Ora di Nascita",
        gender: "Sesso",
        selectOption: "Seleziona un'opzione",
        male: "Maschio",
        female: "Femmina",
        noSay: "Preferisco non dirlo",
        birthCity: "Città di Nascita",
        birthCityPlaceholder: "Es: Roma",
        birthCountry: "Paese di Nascita",
        birthCountryPlaceholder: "Es: Italia",
        submitButton: "Rivela il mio Destino",
        loadingButton: "Analizzando...",
        fillAllFields: "Per favore, compila tutti i campi.",
        invalidDate: "La data di nascita non è valida.",
        errorAnalysis: "Si è verificato un errore durante la generazione della tua analisi. Per favore, riprova.",
        history: "Cronologia",
    },
    ru: {
        title: "Нумерология Сущности",
        subtitle: "Откройте тайны своей души через дату рождения.",
        fullName: "Полное Имя",
        fullNamePlaceholder: "Напр: Иван Иванов",
        birthDate: "Дата Рождения",
        birthTime: "Время Рождения",
        gender: "Пол",
        selectOption: "Выберите вариант",
        male: "Мужской",
        female: "Женский",
        noSay: "Предпочитаю не говорить",
        birthCity: "Город Рождения",
        birthCityPlaceholder: "Напр: Москва",
        birthCountry: "Страна Рождения",
        birthCountryPlaceholder: "Напр: Россия",
        submitButton: "Раскрыть мою Судьбу",
        loadingButton: "Анализ...",
        fillAllFields: "Пожалуйста, заполните все поля.",
        invalidDate: "Неверная дата рождения.",
        errorAnalysis: "Произошла ошибка при создании вашего анализа. Пожалуйста, попробуйте снова.",
        history: "История",
    },
    zh: {
        title: "自我命理学",
        subtitle: "通过你的出生日期发现你灵魂的秘密。",
        fullName: "全名",
        fullNamePlaceholder: "例如：张三",
        birthDate: "出生日期",
        birthTime: "出生时间",
        gender: "性别",
        selectOption: "请选择",
        male: "男性",
        female: "女性",
        noSay: "不想说",
        birthCity: "出生城市",
        birthCityPlaceholder: "例如：北京",
        birthCountry: "出生国家",
        birthCountryPlaceholder: "例如：中国",
        submitButton: "揭示我的命运",
        loadingButton: "分析中...",
        fillAllFields: "请填写所有字段。",
        invalidDate: "出生日期无效。",
        errorAnalysis: "生成您的分析时出错。请再试一次。",
        history: "历史记录",
    },
    ja: {
        title: "自己の数秘術",
        subtitle: "生年月日を通してあなたの魂の秘密を発見してください。",
        fullName: "氏名",
        fullNamePlaceholder: "例：山田太郎",
        birthDate: "生年月日",
        birthTime: "出生時間",
        gender: "性別",
        selectOption: "選択してください",
        male: "男性",
        female: "女性",
        noSay: "言いたくない",
        birthCity: "出生都市",
        birthCityPlaceholder: "例：東京",
        birthCountry: "出生国",
        birthCountryPlaceholder: "例：日本",
        submitButton: "私の運命を明らかにする",
        loadingButton: "分析中...",
        fillAllFields: "すべてのフィールドを入力してください。",
        invalidDate: "生年月日が無効です。",
        errorAnalysis: "分析の生成中にエラーが発生しました。もう一度お試しください。",
        history: "履歴",
    },
    hi: {
        title: "आत्म अंकज्योतिष",
        subtitle: "अपनी जन्मतिथि के माध्यम से अपनी आत्मा के रहस्यों की खोज करें।",
        fullName: "पूरा नाम",
        fullNamePlaceholder: "उदा: रमेश कुमार",
        birthDate: "जन्म की तारीख",
        birthTime: "जन्म का समय",
        gender: "लिंग",
        selectOption: "एक विकल्प चुनें",
        male: "पुरुष",
        female: "महिला",
        noSay: "कहना पसंद नहीं",
        birthCity: "जन्म का शहर",
        birthCityPlaceholder: "उदा: दिल्ली",
        birthCountry: "जन्म का देश",
        birthCountryPlaceholder: "उदा: भारत",
        submitButton: "मेरा भाग्य प्रकट करें",
        loadingButton: "विश्लेषण हो रहा है...",
        fillAllFields: "कृपया सभी फ़ील्ड भरें।",
        invalidDate: "जन्म की तारीख मान्य नहीं है।",
        errorAnalysis: "आपके विश्लेषण को उत्पन्न करते समय एक त्रुटि हुई। कृपया पुन: प्रयास करें।",
        history: "इतिहास",
    },
    ar: {
        title: "علم أعداد الذات",
        subtitle: "اكتشف أسرار روحك من خلال تاريخ ميلادك.",
        fullName: "الاسم الكامل",
        fullNamePlaceholder: "مثال: خالد محمد",
        birthDate: "تاريخ الميلاد",
        birthTime: "وقت الميلاد",
        gender: "الجنس",
        selectOption: "اختر خيارًا",
        male: "ذكر",
        female: "أنثى",
        noSay: "أفضل عدم القول",
        birthCity: "مدينة الميلاد",
        birthCityPlaceholder: "مثال: القاهرة",
        birthCountry: "بلد الميلاد",
        birthCountryPlaceholder: "مثال: مصر",
        submitButton: "اكشف عن قدري",
        loadingButton: "جاري التحليل...",
        fillAllFields: "الرجاء تعبئة كافة الحقول.",
        invalidDate: "تاريخ الميلاد غير صالح.",
        errorAnalysis: "حدث خطأ أثناء إنشاء تحليلك. الرجاء معاودة المحاولة.",
        history: "السجل",
    }
};

const App: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        birthTime: '',
        gender: '',
        city: '',
        country: '',
    });
    const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [language, setLanguage] = useState<string>('es');
    const [history, setHistory] = useState<AnalysisData[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const runAnalysis = useCallback(async (data: typeof formData, lang: string) => {
        const { name, birthDate, birthTime, gender, city, country } = data;
        const currentTranslations = translations[lang];

        if (!name || !birthDate || !birthTime || !gender || !city || !country) {
            setError(currentTranslations.fillAllFields);
            return;
        }

        setIsLoading(true);
        setError(null);
        setCurrentAnalysis(null);

        try {
            const number = calculateLifePathNumber(birthDate);
            if (number === null) {
                setError(currentTranslations.invalidDate);
                setIsLoading(false);
                return;
            }

            const geminiAnalysis = await getNumerologyAnalysis(number, name, birthTime, gender, city, country, lang);
            
            const newAnalysis: AnalysisData = {
                id: new Date().toISOString(),
                name,
                date: new Date().toLocaleString(),
                lifePathNumber: number,
                analysis: geminiAnalysis,
                formData: { ...data }
            };

            setCurrentAnalysis(newAnalysis);
            
            setHistory(prevHistory => {
                const updatedHistory = [newAnalysis, ...prevHistory];
                localStorage.setItem('numerologyHistory', JSON.stringify(updatedHistory));
                return updatedHistory;
            });

        } catch (err) {
            console.error(err);
            setError(currentTranslations.errorAnalysis);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('numerologyHistory');
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        } catch (e) {
            console.error("Failed to load history from localStorage", e);
        }

        // Check for shared URL parameters on initial load
        const params = new URLSearchParams(window.location.search);
        const sharedName = params.get('name');
        const sharedBirthDate = params.get('birthDate');
        const sharedBirthTime = params.get('birthTime');
        const sharedGender = params.get('gender');
        const sharedCity = params.get('city');
        const sharedCountry = params.get('country');
        const sharedLang = params.get('lang');

        if (sharedName && sharedBirthDate && sharedBirthTime && sharedGender && sharedCity && sharedCountry && sharedLang) {
             const sharedFormData = {
                name: sharedName,
                birthDate: sharedBirthDate,
                birthTime: sharedBirthTime,
                gender: sharedGender,
                city: sharedCity,
                country: sharedCountry,
            };
            setFormData(sharedFormData);
            setLanguage(sharedLang);
            // Automatically run analysis with the data from URL
            runAnalysis(sharedFormData, sharedLang);
        }
    }, [runAnalysis]);

    const t = translations[language];

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value}));
    };
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        runAnalysis(formData, language);
    };

    const handleNewQuery = () => {
        setCurrentAnalysis(null);
        setFormData({ name: '', birthDate: '', birthTime: '', gender: '', city: '', country: '' });
        setError(null);
        // Clear URL parameters
        window.history.pushState({}, '', window.location.pathname);
    };

    const handleSelectFromHistory = (analysis: AnalysisData) => {
        setCurrentAnalysis(analysis);
        setIsHistoryOpen(false);
    };

    const handleDeleteFromHistory = (id: string) => {
        setHistory(prevHistory => {
            const updatedHistory = prevHistory.filter(item => item.id !== id);
            localStorage.setItem('numerologyHistory', JSON.stringify(updatedHistory));
             if (currentAnalysis?.id === id) {
                handleNewQuery();
            }
            return updatedHistory;
        });
    };
    
    const mainContentTransform = isHistoryOpen 
        ? (language === 'ar' ? 'translate-x-96' : '-translate-x-96')
        : 'translate-x-0';


    return (
        <div className="bg-slate-900 min-h-screen overflow-x-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
             <HistoryPanel 
                history={history}
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                onSelect={handleSelectFromHistory}
                onDelete={handleDeleteFromHistory}
                language={language}
                currentAnalysisId={currentAnalysis?.id}
            />

            <div className={`text-gray-200 font-sans w-full min-h-screen transition-transform duration-500 ease-in-out ${mainContentTransform}`}>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/30 via-slate-900 to-purple-900/30 -z-10" />

                 <main className="w-full max-w-3xl flex flex-col items-center mx-auto p-4 sm:p-6 lg:p-8 relative">
                    <header className="w-full grid grid-cols-3 items-center mb-8 sm:mb-12 animate-fade-in-down">
                        <div />
                        <div className="text-center col-span-1">
                            <div className="flex justify-center items-center gap-3">
                                <SparklesIcon className="w-8 h-8 text-purple-400" />
                                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                                    {t.title}
                                </h1>
                            </div>
                            <p className="mt-4 text-lg text-slate-400">
                                {t.subtitle}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 justify-end col-span-1">
                            <button onClick={() => setIsHistoryOpen(true)} title={t.history} className="p-2 bg-slate-800/60 border border-slate-700 rounded-md text-slate-200 hover:bg-slate-700 transition-colors">
                                <HistoryIcon className="w-5 h-5" />
                            </button>
                            <div className="relative">
                                <TranslateIcon className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none" style={{ left: language === 'ar' ? 'auto' : '0.75rem', right: language === 'ar' ? '0.75rem' : 'auto' }}/>
                                 <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-slate-800/60 border border-slate-700 rounded-md text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 appearance-none cursor-pointer"
                                    aria-label="Select language"
                                    style={{ paddingLeft: language === 'ar' ? '1rem' : '2.5rem', paddingRight: language === 'ar' ? '2.5rem' : '1rem' }}
                                >
                                    <option value="es">Español</option>
                                    <option value="en">English</option>
                                    <option value="pt">Português</option>
                                    <option value="fr">Français</option>
                                    <option value="de">Deutsch</option>
                                    <option value="it">Italiano</option>
                                    <option value="ru">Русский</option>
                                    <option value="zh">中文 (简体)</option>
                                    <option value="ja">日本語</option>
                                    <option value="hi">हिन्दी</option>
                                    <option value="ar">العربية</option>
                                </select>
                            </div>
                        </div>
                    </header>

                    {!currentAnalysis && !isLoading && (
                        <form onSubmit={handleSubmit} className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-2xl shadow-indigo-900/50 animate-fade-in-up">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                                        {t.fullName}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ left: language === 'ar' ? 'auto' : '0', right: language === 'ar' ? '0' : 'auto', paddingLeft: language === 'ar' ? '0.75rem' : '0', paddingRight: language === 'ar' ? '0' : '0.75rem' }}>
                                            <IdCardIcon className="w-5 h-5 text-slate-400" />
                                        </span>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleFormChange}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md placeholder-slate-500 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                                            required
                                            placeholder={t.fullNamePlaceholder}
                                            style={{ paddingLeft: language === 'ar' ? '1rem' : '2.5rem', paddingRight: language === 'ar' ? '2.5rem' : '1rem' }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="birthDate" className="block text-sm font-medium text-slate-300 mb-2">
                                            {t.birthDate}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ left: language === 'ar' ? 'auto' : '0', right: language === 'ar' ? '0' : 'auto' }}>
                                                <CalendarIcon className="w-5 h-5 text-slate-400" />
                                            </span>
                                            <input
                                                type="date"
                                                id="birthDate"
                                                value={formData.birthDate}
                                                onChange={handleFormChange}
                                                className="w-full pl-10 pr-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md placeholder-slate-500 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                                                required
                                                max={new Date().toISOString().split("T")[0]} 
                                                style={{ paddingLeft: language === 'ar' ? '1rem' : '2.5rem', paddingRight: language === 'ar' ? '2.5rem' : '1rem' }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="birthTime" className="block text-sm font-medium text-slate-300 mb-2">
                                            {t.birthTime}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ left: language === 'ar' ? 'auto' : '0', right: language === 'ar' ? '0' : 'auto' }}>
                                                <TimeIcon className="w-5 h-5 text-slate-400" />
                                            </span>
                                            <input
                                                type="time"
                                                id="birthTime"
                                                value={formData.birthTime}
                                                onChange={handleFormChange}
                                                className="w-full pl-10 pr-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md placeholder-slate-500 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                                                required
                                                style={{ paddingLeft: language === 'ar' ? '1rem' : '2.5rem', paddingRight: language === 'ar' ? '2.5rem' : '1rem' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                 <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-slate-300 mb-2">
                                        {t.gender}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ left: language === 'ar' ? 'auto' : '0', right: language === 'ar' ? '0' : 'auto' }}>
                                            <UserIcon className="w-5 h-5 text-slate-400" />
                                        </span>
                                        <select
                                            id="gender"
                                            value={formData.gender}
                                            onChange={handleFormChange}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md placeholder-slate-500 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 appearance-none"
                                            required
                                            style={{ paddingLeft: language === 'ar' ? '1rem' : '2.5rem', paddingRight: language === 'ar' ? '2.5rem' : '1rem' }}
                                        >
                                            <option value="" disabled>{t.selectOption}</option>
                                            <option value="male">{t.male}</option>
                                            <option value="female">{t.female}</option>
                                            <option value="prefer_not_to_say">{t.noSay}</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-slate-300 mb-2">
                                        {t.birthCity}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ left: language === 'ar' ? 'auto' : '0', right: language === 'ar' ? '0' : 'auto' }}>
                                            <MapPinIcon className="w-5 h-5 text-slate-400" />
                                        </span>
                                        <input
                                            type="text"
                                            id="city"
                                            value={formData.city}
                                            onChange={handleFormChange}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md placeholder-slate-500 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                                            required
                                            placeholder={t.birthCityPlaceholder}
                                            style={{ paddingLeft: language === 'ar' ? '1rem' : '2.5rem', paddingRight: language === 'ar' ? '2.5rem' : '1rem' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-slate-300 mb-2">
                                        {t.birthCountry}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ left: language === 'ar' ? 'auto' : '0', right: language === 'ar' ? '0' : 'auto' }}>
                                            <GlobeIcon className="w-5 h-5 text-slate-400" />
                                        </span>
                                        <input
                                            type="text"
                                            id="country"
                                            value={formData.country}
                                            onChange={handleFormChange}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md placeholder-slate-500 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                                            required
                                            placeholder={t.birthCountryPlaceholder}
                                            style={{ paddingLeft: language === 'ar' ? '1rem' : '2.5rem', paddingRight: language === 'ar' ? '2.5rem' : '1rem' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:bg-indigo-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader />
                                        {t.loadingButton}
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5" />
                                        {t.submitButton}
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                    
                    {isLoading && !currentAnalysis && (
                         <div className="mt-8 w-full max-w-md flex flex-col items-center justify-center text-center">
                            <Loader />
                            <p className="text-slate-300 mt-4">{t.loadingButton}</p>
                         </div>
                    )}


                    {error && !isLoading && (
                        <div className="mt-8 w-full max-w-md bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3 animate-fade-in-up" role="alert">
                            <ErrorIcon className="w-5 h-5"/>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    <div className="w-full mt-8 sm:mt-12 printable-section">
                         {currentAnalysis && !isLoading && (
                            <ResultDisplay analysisData={currentAnalysis} onNewQuery={handleNewQuery} language={language} />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;