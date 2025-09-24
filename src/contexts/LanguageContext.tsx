'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'gu' | 'mr' | 'pa' | 'te' | 'ta' | 'bn';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const languageOptions: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  languageOptions: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('agri-chain-language') as Language;
    if (savedLanguage && languageOptions.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('agri-chain-language', language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, languageOptions }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translations object
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'app.title': 'Agri-Chain',
    'header.connectWallet': 'Connect Wallet',
    
    // Hero Section
    'hero.title.main': 'Farmer\'s Digital Treasury',
    'hero.title.hindi': 'किसान कोश',
    'hero.subtitle': 'Transform your crop receipts into digital assets',
    'hero.getStarted': 'Get Started',
    'hero.learnMore': 'Learn More',
    
    // Features
    'features.title': 'How It Works',
    'features.deposit.title': 'Deposit Receipt',
    'features.deposit.description': 'Convert your crop storage receipt into an NFT on Aptos blockchain',
    'features.loan.title': 'Instant Loan',
    'features.loan.description': 'Get instant loans by using your NFT receipt as collateral',
    'features.secure.title': 'Secure & Transparent',
    'features.secure.description': 'Blockchain-powered security ensures your assets are always protected',
    
    // Call to Action
    'cta.title': 'Ready to modernize your farming?',
    'cta.subtitle': 'Join thousands of farmers already using Agri-Chain',
    'cta.button': 'Start Now',
    
    // Footer
    'footer.tagline': 'Empowering farmers through blockchain technology',
    
    // Language Selector
    'language.select': 'Select Language',
    
    // Theme Toggle
    'theme.switchToDark': 'Switch to dark mode',
    'theme.switchToLight': 'Switch to light mode',
  },
  hi: {
    // Header
    'app.title': 'एग्री-चेन',
    'header.connectWallet': 'वॉलेट कनेक्ट करें',
    
    // Hero Section
    'hero.title.main': 'किसान का डिजिटल खजाना',
    'hero.title.hindi': 'किसान कोश',
    'hero.subtitle': 'अपनी फसल रसीदों को डिजिटल संपत्ति में बदलें',
    'hero.getStarted': 'शुरू करें',
    'hero.learnMore': 'और जानें',
    
    // Features
    'features.title': 'यह कैसे काम करता है',
    'features.deposit.title': 'जमा रसीद',
    'features.deposit.description': 'अपनी फसल भंडारण रसीद को Aptos ब्लॉकचेन पर NFT में बदलें',
    'features.loan.title': 'तत्काल ऋण',
    'features.loan.description': 'अपनी NFT रसीद को गारंटी के रूप में उपयोग करके तत्काल ऋण प्राप्त करें',
    'features.secure.title': 'सुरक्षित और पारदर्शी',
    'features.secure.description': 'ब्लॉकचेन-संचालित सुरक्षा सुनिश्चित करती है कि आपकी संपत्ति हमेशा सुरक्षित है',
    
    // Call to Action
    'cta.title': 'अपनी खेती को आधुनिक बनाने के लिए तैयार हैं?',
    'cta.subtitle': 'हजारों किसान पहले से ही एग्री-चेन का उपयोग कर रहे हैं',
    'cta.button': 'अभी शुरू करें',
    
    // Footer
    'footer.tagline': 'ब्लॉकचेन प्रौद्योगिकी के माध्यम से किसानों को सशक्त बनाना',
    
    // Language Selector
    'language.select': 'भाषा चुनें',
    
    // Theme Toggle
    'theme.switchToDark': 'डार्क मोड पर स्विच करें',
    'theme.switchToLight': 'लाइट मोड पर स्विच करें',
  },
  gu: {
    // Header
    'app.title': 'એગ્રી-ચેઇન',
    'header.connectWallet': 'વૉલેટ કનેક્ટ કરો',
    
    // Hero Section
    'hero.title.main': 'ખેડૂતનો ડિજિટલ ખજાનો',
    'hero.title.hindi': 'કિસાન કોશ',
    'hero.subtitle': 'તમારી પાક રસીદોને ડિજિટલ સંપત્તિમાં રૂપાંતરિત કરો',
    'hero.getStarted': 'શરૂ કરો',
    'hero.learnMore': 'વધુ જાણો',
    
    // Features
    'features.title': 'તે કેવી રીતે કાર્ય કરે છે',
    'features.deposit.title': 'જમા રસીદ',
    'features.deposit.description': 'તમારી પાક સ્ટોરેજ રસીદને Aptos બ્લોકચેઇન પર NFT માં કન્વર્ટ કરો',
    'features.loan.title': 'તાત્કાલિક લોન',
    'features.loan.description': 'તમારી NFT રસીદને કોલેટરલ તરીકે ઉપયોગ કરીને તાત્કાલિક લોન મેળવો',
    'features.secure.title': 'સુરક્ષિત અને પારદર્શક',
    'features.secure.description': 'બ્લોકચેઇન-સંચાલિત સુરક્ષા સુનિશ્ચિત કરે છે કે તમારી સંપત્તિ હંમેશા સુરક્ષિત છે',
    
    // Call to Action
    'cta.title': 'તમારી ખેતીને આધુનિક બનાવવા માટે તૈયાર છો?',
    'cta.subtitle': 'હજારો ખેડૂતો પહેલેથી એગ્રી-ચેઇનનો ઉપયોગ કરી રહ્યા છે',
    'cta.button': 'હમણાં જ શરૂ કરો',
    
    // Footer
    'footer.tagline': 'બ્લોકચેઇન ટેક્નોલોજી દ્વારા ખેડૂતોને સશક્ત બનાવવું',
    
    // Language Selector
    'language.select': 'ભાષા પસંદ કરો',
    
    // Theme Toggle
    'theme.switchToDark': 'ડાર્ક મોડ પર સ્વિચ કરો',
    'theme.switchToLight': 'લાઇટ મોડ પર સ્વિચ કરો',
  },
  mr: {
    // Header
    'app.title': 'अॅग्री-चेन',
    'header.connectWallet': 'वॉलेट कनेक्ट करा',
    
    // Hero Section
    'hero.title.main': 'शेतकऱ्यांचा डिजिटल खजिना',
    'hero.title.hindi': 'किसान कोश',
    'hero.subtitle': 'तुमच्या पीक पावत्या डिजिटल मालमत्तेत रूपांतरित करा',
    'hero.getStarted': 'सुरुवात करा',
    'hero.learnMore': 'अधिक जाणा',
    
    // Features
    'features.title': 'हे कसे कार्य करते',
    'features.deposit.title': 'ठेव पावती',
    'features.deposit.description': 'तुमची पीक स्टोरेज पावती Aptos ब्लॉकचेनवर NFT मध्ये रूपांतरित करा',
    'features.loan.title': 'तत्काळ कर्ज',
    'features.loan.description': 'तुमची NFT पावती गहाण म्हणून वापरून तत्काळ कर्ज मिळवा',
    'features.secure.title': 'सुरक्षित आणि पारदर्शक',
    'features.secure.description': 'ब्लॉकचेन-चालित सुरक्षा तुमची मालमत्ता नेहमी सुरक्षित असल्याची खात्री देते',
    
    // Call to Action
    'cta.title': 'तुमची शेती आधुनिक करण्यास तयार आहात?',
    'cta.subtitle': 'हजारो शेतकरी आधीच अॅग्री-चेन वापरत आहेत',
    'cta.button': 'आता सुरुवात करा',
    
    // Footer
    'footer.tagline': 'ब्लॉकचेन तंत्रज्ञानाद्वारे शेतकऱ्यांना सक्षम करणे',
    
    // Language Selector
    'language.select': 'भाषा निवडा',
  },
  pa: {
    // Header
    'app.title': 'ਐਗਰੀ-ਚੇਨ',
    'header.connectWallet': 'ਵਾਲਿਟ ਕਨੈਕਟ ਕਰੋ',
    
    // Hero Section
    'hero.title.main': 'ਕਿਸਾਨ ਦਾ ਡਿਜਿਟਲ ਖਜ਼ਾਨਾ',
    'hero.title.hindi': 'ਕਿਸਾਨ ਕੋਸ਼',
    'hero.subtitle': 'ਆਪਣੀਆਂ ਫਸਲਾਂ ਦੀਆਂ ਰਸੀਦਾਂ ਨੂੰ ਡਿਜਿਟਲ ਸੰਪਤੀਆਂ ਵਿੱਚ ਬਦਲੋ',
    'hero.getStarted': 'ਸ਼ੁਰੂ ਕਰੋ',
    'hero.learnMore': 'ਹੋਰ ਜਾਣੋ',
    
    // Features
    'features.title': 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ',
    'features.deposit.title': 'ਜਮ੍ਹਾ ਰਸੀਦ',
    'features.deposit.description': 'ਆਪਣੀ ਫਸਲ ਸਟੋਰੇਜ ਰਸੀਦ ਨੂੰ Aptos ਬਲਾਕਚੇਨ ਤੇ NFT ਵਿੱਚ ਬਦਲੋ',
    'features.loan.title': 'ਤੁਰੰਤ ਕਰਜ਼ਾ',
    'features.loan.description': 'ਆਪਣੀ NFT ਰਸੀਦ ਨੂੰ ਜਮਾਨਤ ਵਜੋਂ ਵਰਤ ਕੇ ਤੁਰੰਤ ਕਰਜ਼ਾ ਪ੍ਰਾਪਤ ਕਰੋ',
    'features.secure.title': 'ਸੁਰੱਖਿਅਤ ਅਤੇ ਪਾਰਦਰਸ਼ੀ',
    'features.secure.description': 'ਬਲਾਕਚੇਨ-ਸੰਚਾਲਿਤ ਸੁਰੱਖਿਆ ਯਕੀਨੀ ਬਣਾਉਂਦੀ ਹੈ ਕਿ ਤੁਹਾਡੀ ਸੰਪਤੀ ਹਮੇਸ਼ਾ ਸੁਰੱਖਿਅਤ ਹੈ',
    
    // Call to Action
    'cta.title': 'ਆਪਣੀ ਖੇਤੀ ਨੂੰ ਆਧੁਨਿਕ ਬਣਾਉਣ ਲਈ ਤਿਆਰ ਹੋ?',
    'cta.subtitle': 'ਹਜ਼ਾਰਾਂ ਕਿਸਾਨ ਪਹਿਲਾਂ ਤੋਂ ਹੀ ਐਗਰੀ-ਚੇਨ ਦੀ ਵਰਤੋਂ ਕਰ ਰਹੇ ਹਨ',
    'cta.button': 'ਹੁਣੇ ਸ਼ੁਰੂ ਕਰੋ',
    
    // Footer
    'footer.tagline': 'ਬਲਾਕਚੇਨ ਤਕਨਾਲੋਜੀ ਰਾਹੀਂ ਕਿਸਾਨਾਂ ਨੂੰ ਸਸ਼ਕਤ ਬਣਾਉਣਾ',
    
    // Language Selector
    'language.select': 'ਭਾਸ਼ਾ ਚੁਣੋ',
  },
  te: {
    // Header
    'app.title': 'అగ్రి-చైన్',
    'header.connectWallet': 'వాలెట్ కనెక్ట్ చేయండి',
    
    // Hero Section
    'hero.title.main': 'రైతుల డిజిటల్ ట్రెజరీ',
    'hero.title.hindi': 'కిసాన్ కోష్',
    'hero.subtitle': 'మీ పంట రసీదులను డిజిటల్ ఆస్తులుగా మార్చండి',
    'hero.getStarted': 'ప్రారంభించండి',
    'hero.learnMore': 'మరింత తెలుసుకోండి',
    
    // Features
    'features.title': 'ఇది ఎలా పని చేస్తుంది',
    'features.deposit.title': 'డిపాజిట్ రసీదు',
    'features.deposit.description': 'మీ పంట నిల్వ రసీదును Aptos బ్లాక్‌చైన్‌లో NFTగా మార్చండి',
    'features.loan.title': 'తక్షణ రుణం',
    'features.loan.description': 'మీ NFT రసీదును జామీనుగా ఉపయోగించి తక్షణ రుణాలు పొందండి',
    'features.secure.title': 'సురక్షితం & పారదర్శకం',
    'features.secure.description': 'బ్లాక్‌చైన్-శక్తితో కూడిన భద్రత మీ ఆస్తులు ఎల్లప్పుడూ రక్షించబడుతుందని నిర్ధారిస్తుంది',
    
    // Call to Action
    'cta.title': 'మీ వ్యవసాయాన్ని ఆధునీకరించడానికి సిద్ధంగా ఉన్నారా?',
    'cta.subtitle': 'వేలాది రైతులు ఇప్పటికే అగ్రి-చైన్‌ని ఉపయోగిస్తున్నారు',
    'cta.button': 'ఇప్పుడే ప్రారంభించండి',
    
    // Footer
    'footer.tagline': 'బ్లాక్‌చైన్ టెక్నాలజీ ద్వారా రైతులను శక్తివంతం చేయడం',
    
    // Language Selector
    'language.select': 'భాషను ఎంచుకోండి',
  },
  ta: {
    // Header
    'app.title': 'அக்ரி-சேன்',
    'header.connectWallet': 'வாலட் இணைக்கவும்',
    
    // Hero Section
    'hero.title.main': 'விவசாயிகளின் டிஜிட்டல் கருவூலம்',
    'hero.title.hindi': 'கிசான் கோஷ்',
    'hero.subtitle': 'உங்கள் பயிர் ரசீதுகளை டிஜிட்டல் சொத்துக்களாக மாற்றவும்',
    'hero.getStarted': 'தொடங்கவும்',
    'hero.learnMore': 'மேலும் அறிக',
    
    // Features
    'features.title': 'இது எவ்வாறு செயல்படுகிறது',
    'features.deposit.title': 'வைப்பு ரசீது',
    'features.deposit.description': 'உங்கள் பயிர் சேமிப்பு ரசீதை Aptos பிளாக்செயினில் NFT ஆக மாற்றவும்',
    'features.loan.title': 'உடனடி கடன்',
    'features.loan.description': 'உங்கள் NFT ரசீதை பிணையமாக பயன்படுத்தி உடனடி கடன்களைப் பெறுங்கள்',
    'features.secure.title': 'பாதுகாப்பான & வெளிப்படையான',
    'features.secure.description': 'பிளாக்செயின்-இயக்கப்படும் பாதுகாப்பு உங்கள் சொத்துக்கள் எப்போதும் பாதுகாக்கப்படுவதை உறுதி செய்கிறது',
    
    // Call to Action
    'cta.title': 'உங்கள் விவசாயத்தை நவீனப்படுத்த தயாரா?',
    'cta.subtitle': 'ஆயிரக்கணக்கான விவசாயிகள் ஏற்கனவே அக்ரி-சேனைப் பயன்படுத்துகின்றனர்',
    'cta.button': 'இப்போதே தொடங்கவும்',
    
    // Footer
    'footer.tagline': 'பிளாக்செயின் தொழில்நுட்பத்தின் மூலம் விவசாயிகளை வலுப்படுத்துதல்',
    
    // Language Selector
    'language.select': 'மொழியைத் தேர்ந்தெடுக்கவும்',
  },
  bn: {
    // Header
    'app.title': 'অ্যাগ্রি-চেইন',
    'header.connectWallet': 'ওয়ালেট সংযুক্ত করুন',
    
    // Hero Section
    'hero.title.main': 'কৃষকদের ডিজিটাল ভান্ডার',
    'hero.title.hindi': 'কিষান কোষ',
    'hero.subtitle': 'আপনার ফসলের রশিদগুলিকে ডিজিটাল সম্পদে রূপান্তরিত করুন',
    'hero.getStarted': 'শুরু করুন',
    'hero.learnMore': 'আরও জানুন',
    
    // Features
    'features.title': 'এটি কীভাবে কাজ করে',
    'features.deposit.title': 'জমার রশিদ',
    'features.deposit.description': 'আপনার ফসল সংরক্ষণের রশিদকে Aptos ব্লকচেইনে NFT তে রূপান্তর করুন',
    'features.loan.title': 'তাৎক্ষণিক ঋণ',
    'features.loan.description': 'আপনার NFT রশিদকে জামানত হিসেবে ব্যবহার করে তাৎক্ষণিক ঋণ পান',
    'features.secure.title': 'নিরাপদ ও স্বচ্ছ',
    'features.secure.description': 'ব্লকচেইন-চালিত নিরাপত্তা নিশ্চিত করে যে আপনার সম্পদ সর্বদা সুরক্ষিত',
    
    // Call to Action
    'cta.title': 'আপনার কৃষিকাজ আধুনিকীকরণ করতে প্রস্তুত?',
    'cta.subtitle': 'হাজার হাজার কৃষক ইতিমধ্যে অ্যাগ্রি-চেইন ব্যবহার করছেন',
    'cta.button': 'এখনই শুরু করুন',
    
    // Footer
    'footer.tagline': 'ব্লকচেইন প্রযুক্তির মাধ্যমে কৃষকদের ক্ষমতায়ন',
    
    // Language Selector
    'language.select': 'ভাষা নির্বাচন করুন',
  },
};