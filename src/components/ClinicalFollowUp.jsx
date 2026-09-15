import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Check, ChevronRight, Mic, MicOff, Volume2, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { speakTextWithBhashini, stopCurrentSpeech, isSpeechPlaying } from '../services/bhashiniTtsService.js';
import './ClinicalFollowUp.css';

const QUESTIONS = [
  {
    id: 'onset',
    title: {
      en: 'When did this problem begin?',
      hi: 'यह समस्या कब शुरू हुई?',
      kn: 'ಈ ಸಮಸ್ಯೆ ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು?',
      ta: 'இந்தப் பிரச்சனை எப்போது தொடங்கியது?',
      te: 'ఈ సమస్య ఎప్పుడు ప్రారంభమైంది?',
      ml: 'ഈ പ്രശ്നം എപ്പോൾ ആരംഭിച്ചു?',
      mr: 'ही समस्या कधी सुरू झाली?',
      bn: 'এই সমস্যাটি কখন শুরু হয়েছিল?',
      gu: 'આ સમસ્યા ક્યારે શરૂ થઈ?',
      pa: 'ਇਹ ਸਮੱਸਿਆ ਕਦੋਂ ਸ਼ੁਰੂ ਹੋਈ ਸੀ?',
      sa: 'इयं समस्या कदा प्रारब्धा?'
    },
    prompt: {
      en: 'When exactly did this problem begin? Did it start suddenly or gradually?',
      hi: 'यह समस्या ठीक कब शुरू हुई? क्या यह अचानक शुरू हुई या धीरे-धीरे?',
      kn: 'ಈ ಸಮಸ್ಯೆ ನಿಖರವಾಗಿ ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು? ಇದು ಹಠಾತ್ತಾಗಿ ಅಥವಾ ನಿಧಾನವಾಗಿ ಪ್ರಾರಂಭವಾಯಿತೇ?',
      ta: 'இந்தப் பிரச்சனை சரியாக எப்போது தொடங்கியது? திடீரெனவா அல்லது படிப்படியாகவா?',
      te: 'ఈ సమస్య సరిగ్గా ఎప్పుడు ప్రారంభమైంది? అకస్మాత్తుగా లేదా క్రమంగా ప్రారంభమైందా?',
      ml: 'ഈ പ്രശ്നം കൃത്യമായി എപ്പോൾ ആരംഭിച്ചു? പെട്ടെന്നാണോ ക്രമേണയാണോ?',
      mr: 'ही समस्या नक्की कधी सुरू झाली? ती अचानक सुरू झाली की हळूहळू?',
      bn: 'এই সমস্যাটি ঠিক কখন শুরু হয়েছিল? এটি কি হঠাৎ নাকি ধীরে ধীরে শুরু হয়েছিল?',
      gu: 'આ સમસ્યા ક્યારે શરૂ થઈ? અચાનક કે ધીમે ધીમે?',
      pa: 'ਇਹ ਸਮੱਸਿਆ ਕਦੋਂ ਸ਼ੁਰੂ ਹੋਈ ਸੀ? ਅਚਾਨਕ ਜਾਂ ਹੌਲੀ-ਹੌਲੀ?',
      sa: 'इयं समस्या कदा प्रारब्धा? अकस्मात् उत शनैः शनैः?'
    },
    options: {
      en: ['Today', 'Within the last week', 'More than a week ago', 'It started gradually'],
      hi: ['आज ही', 'पिछले एक सप्ताह में', 'एक सप्ताह से अधिक पहले', 'धीरे-धीरे शुरू हुई'],
      kn: ['ಇಂದೇ', 'ಕಳೆದ ಒಂದು ವಾರದೊಳಗೆ', 'ಒಂದು ವಾರಕ್ಕಿಂತ ಹೆಚ್ಚು ಸಮಯದ ಹಿಂದೆ', 'ನಿಧಾನವಾಗಿ ಪ್ರಾರಂಭವಾಯಿತು'],
      ta: ['இன்றே', 'கடந்த ஒரு வாரத்திற்குள்', 'ஒரு வாரத்திற்கு முன்பு', 'படிப்படியாக தொடங்கியது'],
      te: ['ఈ రోజే', 'గత వారంలో', 'వారం కంటే ఎక్కువ రోజుల క్రితం', 'క్రమంగా ప్రారంభమైంది'],
      ml: ['ഇന്ന്', 'കഴിഞ്ഞ ഒരാഴ്ചയ്ക്കുള്ളിൽ', 'ഒരാഴ്ചയിലധികം മുൻപ്', 'ക്രമേണ തുടങ്ങി'],
      mr: ['आजच', 'गेल्या आठवड्यात', 'एका आठवड्यापेक्षा जास्त आधी', 'हळूहळू सुरू झाली'],
      bn: ['আজকেই', 'গত এক সপ্তাহের মধ্যে', 'এক সপ্তাহের বেশি আগে', 'ধীরে ধীরে শুরু হয়েছে'],
      gu: ['આજે જ', 'છેલ્લા એક અઠવાડિયામાં', 'એક અઠવાડિયા કરતાં વધુ સમય પહેલાં', 'ધીમે ધીમે શરૂ થઈ'],
      pa: ['ਅੱਜ ਹੀ', 'ਪਿਛਲੇ ਹਫ਼ਤੇ ਵਿੱਚ', 'ਇੱਕ ਹਫ਼ਤੇ ਤੋਂ ਵੱਧ ਪਹਿਲਾਂ', 'ਹੌਲੀ-ਹੌਲੀ ਸ਼ੁਰੂ ਹੋਈ'],
      sa: ['अद्यैव', 'विगतसप्ताहे', 'सप्ताहादधिकपूर्वं', 'शनैः प्रारब्धा']
    }
  },
  {
    id: 'severity',
    title: {
      en: 'How severe is your discomfort?',
      hi: 'तकलीफ कितनी गंभीर है?',
      kn: 'ನಿಮ್ಮ ಅಸ್ವಸ್ಥತೆ ಎಷ್ಟು ತೀವ್ರವಾಗಿದೆ?',
      ta: 'அசௌகரியம் எவ்வளவு தீவிரமானது?',
      te: 'మీ అసౌకర్యం ఎంత తీవ్రంగా ఉంది?',
      ml: 'വേദന എത്രത്തോളം കഠിനമാണ്?',
      mr: 'त्रास किती तीव्र आहे?',
      bn: 'কষ্ট কতটা তীব্র?',
      gu: 'તકલીફ કેટલી ગંભીર છે?',
      pa: 'ਤਕਲੀਫ ਕਿੰਨੀ ਗੰਭੀਰ ਹੈ?',
      sa: 'पीडा कियान् तीव्रा?'
    },
    prompt: {
      en: 'On a scale from 1 to 10, how severe is your discomfort or pain right now?',
      hi: '1 से 10 के पैमाने पर, अभी आपकी तकलीफ या दर्द कितना गंभीर है?',
      kn: '1 ರಿಂದ 10 ರ ಪ್ರಮಾಣದಲ್ಲಿ, ನಿಮ್ಮ ಅಸ್ವಸ್ಥತೆ ಅಥವಾ ನೋವು ಎಷ್ಟು ತೀವ್ರವಾಗಿದೆ?',
      ta: '1 முதல் 10 வரையிலான அளவில், உங்கள் வலி அல்லது அசௌகரியம் எவ்வளவு தீவிரமானது?',
      te: '1 నుండి 10 స్కేలులో, మీ అసౌకర్యం లేదా నొప్పి ఎంత తీవ్రంగా ఉంది?',
      ml: '1 മുതൽ 10 വരെയുള്ള സ്കെയിലിൽ, നിങ്ങളുടെ വേദന എത്രത്തോളം കഠിനമാണ്?',
      mr: '1 ते 10 च्या स्केलवर, तुमचा त्रास किंवा वेदना किती तीव्र आहे?',
      bn: '১ থেকে ১০ এর স্কেলে, আপনার কষ্ট বা ব্যথা কতটা তীব্র?',
      gu: '૧ થી ૧૦ ના સ્કેલ પર, તમારી તકલીફ કેટલી ગંભીર છે?',
      pa: '1 ਤੋਂ 10 ਦੇ ਪੈਮਾਨੇ ਤੇ, ਤੁਹਾਡੀ ਤਕਲੀਫ ਕਿੰਨੀ ਗੰਭੀਰ ਹੈ?',
      sa: 'एकतः दशपर्यन्तं परिमाणे भवतः पीडा कियान् तीव्रा अस्ति?'
    },
    options: {
      en: ['Mild (1-3)', 'Moderate (4-6)', 'Severe (7-8)', 'Very Severe (9-10)'],
      hi: ['हल्का (1-3)', 'मध्यम (4-6)', 'गंभीर (7-8)', 'अति गंभीर (9-10)'],
      kn: ['ಸೌಮ್ಯ (1-3)', 'ಮಧ್ಯಮ (4-6)', 'ತೀವ್ರ (7-8)', 'ಅತ್ಯಂತ ತೀವ್ರ (9-10)'],
      ta: ['லேசானது (1-3)', 'மிதமானது (4-6)', 'கடுமையானது (7-8)', 'மிகக் கடுமையானது (9-10)'],
      te: ['తేలికపాటి (1-3)', 'మధ్యస్థం (4-6)', 'తీవ్రమైనది (7-8)', 'చాలా తీవ్రమైనది (9-10)'],
      ml: ['നേരിയത് (1-3)', 'മിതമായത് (4-6)', 'കഠിനമായത് (7-8)', 'വളരെ കഠിനമായത് (9-10)'],
      mr: ['सौम्य (1-3)', 'मध्यम (4-6)', 'तीव्र (7-8)', 'अति तीव्र (9-10)'],
      bn: ['হালকা (1-3)', 'মাঝারি (4-6)', 'তীব্র (7-8)', 'অত্যন্ত তীব্র (9-10)'],
      gu: ['હળવી (1-3)', 'મધ્યમ (4-6)', 'ગંભીર (7-8)', 'અતિ ગંભીર (9-10)'],
      pa: ['ਹਲਕੀ (1-3)', 'ਦਰਮਿਆਨੀ (4-6)', 'ਗੰਭੀਰ (7-8)', 'ਬਹੁਤ ਗੰਭੀਰ (9-10)'],
      sa: ['मन्दम् (1-3)', 'मध्यमम् (4-6)', 'तीव्रम् (7-8)', 'अतितीव्रम् (9-10)']
    }
  },
  {
    id: 'location',
    title: {
      en: 'Where do you feel it?',
      hi: 'लक्षण कहाँ महसूस होता है?',
      kn: 'ಲಕ್ಷಣವು ಎಲ್ಲಿ ಅನುಭವವಾಗುತ್ತಿದೆ?',
      ta: 'அறிகுறி எங்கே உணரப்படுகிறது?',
      te: 'లక్షణం ఎక్కడ అనిపిస్తుంది?',
      ml: 'ലക്ഷണം എവിടെയാണ് അനുഭവപ്പെടുന്നത്?',
      mr: 'त्रास कुठे जाणवतो?',
      bn: 'লক্ষণটি কোথায় অনুভব করছেন?',
      gu: 'લક્ષણ ક્યાં અનુભવાય છે?',
      pa: 'ਲੱਛਣ ਕਿੱਥੇ ਮਹਿਸੂਸ ਹੁੰਦਾ ਹੈ?',
      sa: 'लक्षणं कुत्र अनुभूयते?'
    },
    prompt: {
      en: 'Where exactly do you feel the symptom? Does it spread to another part of the body?',
      hi: 'लक्षण आपको ठीक कहाँ महसूस होता है? क्या यह शरीर के किसी दूसरे हिस्से तक फैलता है?',
      kn: 'ಲಕ್ಷಣವು ನಿಮಗೆ ನಿಖರವಾಗಿ ಎಲ್ಲಿದೆ? ಅದು ದೇಹದ ಬೇರೆ ಭಾಗಕ್ಕೆ ಹರಡುತ್ತದೆಯೇ?',
      ta: 'அறிகுறி சரியாக எங்கே உணரப்படுகிறது? அது உடலின் வேறு பகுதிக்கு பரவுகிறதா?',
      te: 'లక్షణం మీకు సరిగ్గా ఎక్కడ అనిపిస్తుంది? ఇది శరీరంలోని మరొక భాగానికి వ్యాపిస్తుందా?',
      ml: 'ലക്ഷണം കൃത്യമായി എവിടെയാണ് അനുഭവപ്പെടുന്നത്? ഇത് ശരീരത്തിന്റെ മറ്റൊരു ഭാഗത്തേക്ക് പടരുന്നുണ്ടോ?',
      mr: 'लक्षण नक्की कुठे जाणवते? ते शरीराच्या इतर भागांत पसरते का?',
      bn: 'লক্ষণটি ঠিক কোথায় অনুভব করছেন? এটি কি শরীরের অন্য কোথাও ছড়িয়ে পড়ছে?',
      gu: 'લક્ષણ ક્યાં અનુભવાય છે? શું તે અન્ય ભાગોમાં ફેલાય છે?',
      pa: 'ਲੱਛਣ ਠੀਕ ਕਿੱਥੇ ਮਹਿਸੂਸ ਹੁੰਦਾ ਹੈ?',
      sa: 'लक्षणं कुत्र अनुभूयते? किं शरीरस्य अन्यभागे प्रसरति?'
    },
    options: {
      en: ['Chest / Epigastric', 'Abdomen / Stomach', 'Joints / Back', 'Head / Neck', 'Generalized / Whole Body'],
      hi: ['छाती / सीना', 'पेट / उदर', 'जोड़ / पीठ', 'सिर / गर्दन', 'पूरे शरीर में'],
      kn: ['ಎದೆ / ಜಠರ', 'ಹೊಟ್ಟೆ', 'ಕೀಲುಗಳು / ಬೆನ್ನು', 'ತಲೆ / ಕುತ್ತಿಗೆ', 'ಇಡೀ ದೇಹ'],
      ta: ['நெஞ்சு / மார்பு', 'வயிறு', 'மூட்டுகள் / முதுகு', 'தலை / கழுத்து', 'முழு உடல்'],
      te: ['ఛాతీ', 'కడుపు', 'కీళ్ళు / వీపు', 'తల / మెడ', 'మొత్తం శరీరం'],
      ml: ['നെഞ്ച്', 'വയറ്', 'സന്ധികൾ / പുറം', 'തല / കഴുത്ത്', 'മുഴുവൻ ശരീരം'],
      mr: ['छाती', 'पोट', 'सांधे / पाठ', 'डोके / मान', 'पूर्ण शरीर'],
      bn: ['বুক', 'পেট', 'গাঁট / পিঠ', 'মাথা / ঘাড়', 'সারা শরীর'],
      gu: ['છાતી', 'પેટ', 'સાંધા / પીઠ', 'માથું / ગરદન', 'આખું શરીર'],
      pa: ['ਛਾਤੀ', 'ਪੇਟ', 'ਜੋੜ / ਪਿੱਠ', 'ਸਿਰ / ਗਰਦਨ', 'ਪੂਰਾ ਸਰੀਰ'],
      sa: ['वक्षःस्थलम्', 'उदरम्', 'सन्धयः / पृष्ठम्', 'शिरः / ग्रीवा', 'सर्वशरीरम्']
    }
  },
  {
    id: 'history',
    title: {
      en: 'Tell us about your medical history',
      hi: 'चिकित्सा इतिहास बताएं',
      kn: 'ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ ತಿಳಿಸಿ',
      ta: 'மருத்துவ வரலாறு கூறுங்கள்',
      te: 'వైద్య చరిత్రను తెలపండి',
      ml: 'ചികിത്സാ ചരിത്രം പറയുക',
      mr: 'वैद्यकीय इतिहास सांगा',
      bn: 'চিকিৎসা ইতিহাস জানান',
      gu: 'તબીબી ઇતિહાસ જણાવો',
      pa: 'ਡਾਕਟਰੀ ਇਤਿਹਾਸ ਦੱਸੋ',
      sa: 'पूर्वचिकित्साविवरणं वदतु'
    },
    prompt: {
      en: 'Have you had any major illnesses, operations, diabetes, high blood pressure, or heart problems before?',
      hi: 'क्या आपको पहले कोई गंभीर बीमारी, ऑपरेशन, मधुमेह, उच्च रक्तचाप या दिल की समस्या रही है?',
      kn: 'ಹಿಂದೆ ಯಾವುದೇ ಪ್ರಮುಖ ಕಾಯಿಲೆಗಳು, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಗಳು, ಮಧುಮೇಹ, ಅಧಿಕ ರಕ್ತದೊತ್ತಡ ಅಥವಾ ಹೃದಯ ಸಮಸ್ಯೆಗಳಿದ್ದವೆಯೇ?',
      ta: 'முன்பு பெரிய நோய்கள், அறுவை சிகிச்சைகள், சர்க்கரை நோய், உயர் இரத்த அழுத்தம் அல்லது இதயப் பிரச்சனைகள் இருந்தனவா?',
      te: 'గతంలో పెద్ద అనారోగ్యాలు, శస్త్రచికిత్సలు, మధుమేహం, అధిక రక్తపోటు లేదా గుండె సమస్యలు ఉన్నాయా?',
      ml: 'മുമ്പ് വലിയ രോഗങ്ങൾ, ശസ്ത്രക്രിയകൾ, പ്രമേഹം, ഉയർന്ന രക്തസമ്മർദ്ദം അല്ലെങ്കിൽ ഹൃദയപ്രശ്നങ്ങൾ ഉണ്ടായിട്ടുണ്ടോ?',
      mr: 'पूर्वी काही मोठे आजार, शस्त्रक्रिया, मधुमेह, उच्च रक्तदाब किंवा हृदयाचा त्रास होता का?',
      bn: 'আগে কি কোন বড় রোগ, অপারেশন, ডায়াবেটিস, উচ্চ রক্তচাপ বা হার্টের সমস্যা ছিল?',
      gu: 'પહેલા કોઈ મોટી બીમારી, ઓપરેશન, ડાયાબિટીસ કે બ્લડ પ્રેશર હતું?',
      pa: 'ਪਹਿਲਾਂ ਕੋਈ ਵੱਡੀ ਬਿਮਾਰੀ ਜਾਂ ਆਪ੍ਰੇਸ਼ਨ ਹੋਇਆ ਹੈ?',
      sa: 'पूर्वम् किमपि गंभीररोगः, शल्यक्रिया, प्रमेहः उत उच्चरक्तचापः आसीत् वा?'
    },
    options: {
      en: ['No previous medical conditions', 'Hypertension / High BP', 'Diabetes Mellitus', 'Cardiac / Heart History', 'Thyroid / Other'],
      hi: ['कोई पूर्व बीमारी नहीं', 'उच्च रक्तचाप (High BP)', 'मधुमेह (Sugar)', 'हृदय रोग का इतिहास', 'थायराइड / अन्य'],
      kn: ['ಯಾವುದೇ ಹಿಂದಿನ ಕಾಯಿಲೆಗಳಿಲ್ಲ', 'ಅಧಿಕ ರಕ್ತದೊತ್ತಡ (BP)', 'ಮಧುಮೇಹ (Sugar)', 'ಹೃದಯ ಸಂಬಂಧಿ ಇತಿಹಾಸ', 'ಥೈರಾಯ್ಡ್ / ಇತರೆ'],
      ta: ['முந்தைய நோய்கள் எதுவும் இல்லை', 'உயர் இரத்த அழுத்தம் (BP)', 'சர்க்கரை நோய் (Diabetes)', 'இதய நோய் வரலாறு', 'தைராய்டு / பிற'],
      te: ['మునుపటి అనారోగ్యాలు లేవు', 'అధిక రక్తపోటు (BP)', 'మధుమేహం (Sugar)', 'గుండె జబ్బుల చరిత్ర', 'థైరాయిడ్ / ఇతర'],
      ml: ['മുൻകാല രോഗങ്ങളൊന്നുമില്ല', 'ഉയർന്ന രക്തസമ്മർദ്ദം (BP)', 'പ്രമേഹം (Diabetes)', 'ഹൃദ്രോഗ ചരിത്രം', 'തൈറോയ്ഡ് / മറ്റുള്ളവ'],
      mr: ['कोणताही जुना आजार नाही', 'उच्च रक्तदाब (High BP)', 'मधुमेह (Sugar)', 'हृदयरोग इतिहास', 'थायरॉईड / इतर'],
      bn: ['আগের কোনো রোগ নেই', 'উচ্চ রক্তচাপ (High BP)', 'ডায়াবেটিস', 'হৃদরোগের ইতিহাস', 'থাইরয়েড / অন্যান্য'],
      gu: ['પહેલાંની કોઈ બીમારી નથી', 'હાઈ બીપી (Hypertension)', 'ડાયાબિટીસ', 'હૃદયરોગનો ઇતિહાસ', 'થાઈરોઈડ / અન્ય'],
      pa: ['ਕੋਈ ਪੁਰਾਣੀ ਬਿਮਾਰੀ ਨਹੀਂ', 'ਹਾਈ ਬੀਪੀ', 'ਸ਼ੂਗਰ (Diabetes)', 'ਦਿਲ ਦੀ ਬਿਮਾਰੀ ਦਾ ਇਤਿਹਾਸ', 'ਥਾਈਰਾਇਡ / ਹੋਰ'],
      sa: ['कोऽपि पूर्वरोगः नास्ति', 'उच्चरक्तचापः', 'मधुमेहः', 'हृद्रोगवृत्तान्तः', 'थायराइड् / अन्यम्']
    }
  },
  {
    id: 'medications',
    title: {
      en: 'Current medicines and allergies',
      hi: 'वर्तमान दवाएं और एलर्जी',
      kn: 'ಪ್ರಸ್ತುತ ಔಷಧಿಗಳು ಮತ್ತು ಅಲರ್ಜಿಗಳು',
      ta: 'தற்போதைய மருந்துகள் மற்றும் ஒவ்வாமை',
      te: 'ప్రస్తుత మందులు మరియు అలెర్జీలు',
      ml: 'നിലവിലെ മരുന്നുകളും അലർജികളും',
      mr: 'सध्याची औषधे आणि ॲलर्जी',
      bn: 'বর্তমান ওষুধ এবং অ্যালার্জি',
      gu: 'હાલની દવાઓ અને એલર્જી',
      pa: 'ਮੌਜੂਦਾ ਦਵਾਈਆਂ ਅਤੇ ਐਲਰਜੀ',
      sa: 'वर्तमानौषधानि एलर्जी च'
    },
    prompt: {
      en: 'What medicines or Ayurvedic formulations are you taking now, and do you have any medicine allergies?',
      hi: 'अभी आप कौन सी दवाएं या आयुर्वेदिक औषधियां ले रहे हैं, और क्या आपको किसी दवा से एलर्जी है?',
      kn: 'ನೀವು ಈಗ ಯಾವ ಔಷಧಿಗಳು ಅಥವಾ ಆಯುರ್ವೇದ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಿ? ಯಾವುದೇ ಔಷಧಿ ಅಲರ್ಜಿ ಇದೆಯೇ?',
      ta: 'நீங்கள் தற்போது எந்த மருந்துகள் அல்லது ஆயுர்வேத மருந்துகள் எடுத்துக்கொள்கிறீர்கள்? மருந்து ஒவ்வாமை உள்ளதா?',
      te: 'మీరు ప్రస్తుతం ఏ మందులు లేదా ఆಯುర్వేద మందులు తీసుకుంటున్నారు? మందుల అలర్జీ ఉందా?',
      ml: 'നിങ്ങൾ ഇപ്പോൾ ഏത് മരുന്നുകളോ ആയുർവേദ മരുന്നുകളോ കഴിക്കുന്നു? മരുന്നിനോട് അലർജിയുണ്ടോ?',
      mr: 'सध्या आपण कोणती औषधे किंवा आयुर्वेदिक औषधे घेत आहात? काही औषधांची ॲलर्जी आहे का?',
      bn: 'এখন কি ওষুধ বা আয়ুর্বেদিক ঔষধ নিচ্ছেন? কোনো অ্যালার্জি আছে কি?',
      gu: 'હાલમાં કઈ દવાઓ લઈ રહ્યા છો? કોઈ એલર્જી છે?',
      pa: 'ਕਿਹੜੀਆਂ ਦਵਾਈਆਂ ਲੈ ਰਹੇ ਹੋ? ਕੋਈ ਐਲਰਜੀ ਹੈ?',
      sa: 'सम्प्रति कानि औषधानि सेवन्ते? किमपि एलर्जी अस्ति वा?'
    },
    options: {
      en: ['No regular medicines or known allergies', 'Metformin / Diabetes meds', 'Antihypertensives / BP meds', 'Triphala / Ayurvedic formulations', 'Known medicine allergy'],
      hi: ['कोई नियमित दवा या एलर्जी नहीं', 'मेटफॉर्मिन / शुगर की दवाएं', 'बीपी की दवाएं', 'त्रिफला / आयुर्वेदिक योग', 'दवा से ज्ञात एलर्जी'],
      kn: ['ಯಾವುದೇ ನಿಯಮಿತ ಔಷಧಿ ಅಥವಾ ಅಲರ್ಜಿ ಇಲ್ಲ', 'ಮೆಟ್‌ಫಾರ್ಮಿನ್ / ಮಧುಮೇಹ ಔಷಧಿ', 'ಬಿಪಿ ಔಷಧಿಗಳು', 'ತ್ರಿಫಲಾ / ಆಯುರ್ವೇದ ಔಷಧಿಗಳು', 'ಔಷಧಿ ಅಲರ್ಜಿ ಇದೆ'],
      ta: ['வழக்கமான மருந்துகள் அல்லது ஒவ்வாமை இல்லை', 'மெட்ஃபோர்மின் / சர்க்கரை மருந்துகள்', 'இரத்த அழுத்த மருந்துகள்', 'திரிபலா / ஆயுர்வேத மருந்துகள்', 'மருந்து ஒவ்வாமை உள்ளது'],
      te: ['రెగ్యులర్ మందులు లేదా అలెర్జీలు లేవు', 'మెట్‌ఫార్మిన్ / షుగర్ మందులు', 'బీపీ మందులు', 'త్రిఫల / ఆయుర్వేద మందులు', 'తెలిసిన ఔషధ అలెర్జీ'],
      ml: ['പതിവ് മരുന്നുകളോ അലർജിയോ ഇല്ല', 'മെറ്റ്ഫോർമിൻ / പ്രമേഹ മരുന്നുകൾ', 'രക്തസമ്മർദ്ദ മരുന്നുകൾ', 'ത്രിഫല / ആയുർവേദ മരുന്നുകൾ', 'മരുന്ന് അലർജിയുണ്ട്'],
      mr: ['कोणतीही नियमित औषधे किंवा ॲलर्जी नाही', 'मेटफॉर्मिन / मधुमेहाची औषधे', 'बीपीची औषधे', 'त्रिफळा / आयुर्वेदिक औषधे', 'औषधाची ॲलर्जी आहे'],
      bn: ['কোনো নিয়মিত ওষুধ বা অ্যালার্জি নেই', 'মেটফর্মিন / ডায়াবেটিসের ওষুধ', 'রক্তচাপের ওষুধ', 'ত্রিফলা / আয়ুর্বেদিক ওষুধ', 'ওষুধের অ্যালার্জি আছে'],
      gu: ['કોઈ નિયમિત દવા કે એલર્જી નથી', 'મેટફોર્મિન / ડાયાબિટીસની દવાઓ', 'બીપીની દવાઓ', 'ત્રિફળા / આયુર્વેદિક દવાઓ', 'દવાની એલર્જી છે'],
      pa: ['ਕੋਈ ਨਿਯਮਿਤ ਦਵਾਈ ਜਾਂ ਐਲਰਜੀ ਨਹੀਂ', 'ਸ਼ੂਗਰ ਦੀਆਂ ਦਵਾਈਆਂ', 'ਬੀਪੀ ਦੀਆਂ ਦਵਾਈਆਂ', 'ਤ੍ਰਿਫਲਾ / ਆਯੁਰਵੈਦਿਕ ਦਵਾਈਆਂ', 'ਜਾਣੀ-ਪਛਾਣੀ ਦਵਾਈ ਐਲਰਜੀ'],
      sa: ['नियमितौषधं वा एलर्जी नास्ति', 'मधुमेहास्यौषधम्', 'उच्चरक्तचापस्यौषधम्', 'त्रिफला / आयुर्वेदीययोगः', 'औषधैलर्जी वर्तते']
    }
  }
];

const SPEECH_LANG_MAP = {
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  ml: 'ml-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  sa: 'hi-IN',
  en: 'en-IN'
};

const LANG_DISPLAY_NAMES = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  kn: 'ಕನ್ನಡ (Kannada)',
  ta: 'தமிழ் (Tamil)',
  te: 'తెలుగు (Telugu)',
  ml: 'മലയാളം (Malayalam)',
  mr: 'मराठी (Marathi)',
  bn: 'বাংলা (Bengali)',
  gu: 'ગુજરાતી (Gujarati)',
  pa: 'ਪੰਜਾਬੀ (Punjabi)',
  sa: 'संस्कृतम् (Sanskrit)'
};

const getLocalized = (copy, language) => {
  if (!copy) return '';
  if (typeof copy === 'string') return copy;
  if (Array.isArray(copy)) return copy;
  const langKey = (language || 'en').toLowerCase();
  return copy[langKey] || copy.en || copy.hi || Object.values(copy)[0] || '';
};

export default function ClinicalFollowUp({ clinicalData, userLanguage = 'en', onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [detectedVoiceLang, setDetectedVoiceLang] = useState(null);
  const [micLanguage, setMicLanguage] = useState(userLanguage || 'en');

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const lastSpokenStepRef = useRef(-1);
  const liveAccumulatorRef = useRef('');
  const silenceTimerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);

  // Sync mic language when userLanguage prop changes
  useEffect(() => {
    if (userLanguage) {
      setMicLanguage(userLanguage);
    }
  }, [userLanguage]);

  const question = QUESTIONS[step];
  const questionTitle = question ? getLocalized(question.title, userLanguage) : '';
  const questionPrompt = question ? getLocalized(question.prompt, userLanguage) : '';
  const localizedOptions = question ? getLocalized(question.options, userLanguage) : [];

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    setIsLiveStreamActive(false);

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    // 1. Stop Web Speech Recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }

    // 2. Stop MediaRecorder (only if fallback recorder was active)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (_) {}
    }

    // 3. Stop Audio Hardware Tracks
    if (audioStreamRef.current) {
      try {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (_) {}
      audioStreamRef.current = null;
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCurrentSpeech();
      stopListening();
    };
  }, [stopListening]);

  const speakQuestion = useCallback((targetStep = step) => {
    const q = QUESTIONS[targetStep];
    if (!q) return;
    const prompt = getLocalized(q.prompt, userLanguage);
    if (!prompt) return;

    // Stop listening before speaking to prevent feedback
    stopListening();

    setIsSpeaking(true);
    speakTextWithBhashini({
      text: prompt,
      language: userLanguage,
      gender: 'female',
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  }, [userLanguage, step, stopListening]);

  // Read aloud automatically when user begins or when question changes (never twice)
  useEffect(() => {
    if (hasStarted && question && lastSpokenStepRef.current !== step) {
      lastSpokenStepRef.current = step;
      speakQuestion(step);
    }
  }, [step, hasStarted, speakQuestion, question]);

  const startVoiceInterview = () => {
    setHasStarted(true);
  };

  /**
   * Fallback for browsers lacking Web Speech API (Firefox desktop):
   * Send captured voice audio buffer to backend ASR cascade (Bhashini Flex -> Groq Whisper -> Gemini)
   */
  const processRecordedAudio = async (chunks) => {
    if (!chunks || chunks.length === 0) return;
    setIsTranscribing(true);

    try {
      const audioBlob = new Blob(chunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.wav');
      formData.append('language', 'auto');
      formData.append('targetLanguage', userLanguage || 'auto');

      const response = await fetch('/api/voice-intake', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const resData = await response.json();
        const serverTranscript = resData?.data?.target_transcript || resData?.data?.original_transcript || resData?.data?.transcript || '';
        if (serverTranscript && serverTranscript.trim()) {
          setTypedAnswer(serverTranscript.trim());
        }
        if (resData?.data?.detected_language) {
          setDetectedVoiceLang(resData.data.detected_language);
        }
      }
    } catch (err) {
      console.warn('[ClinicalFollowUp] Fallback audio transcription failed:', err);
    } finally {
      setIsTranscribing(false);
      audioChunksRef.current = [];
    }
  };

  /**
   * Live Voice Detection:
   * Provides 0ms latency real-time speech streaming directly into typedAnswer.
   * Words appear on screen in real time as the patient speaks.
   * Resilient to silence pauses with zero post-recording waiting time!
   */
  const startListening = async () => {
    if (isListening || isListeningRef.current) {
      stopListening();
      return;
    }

    // 1. Stop any playing TTS speech before opening the mic
    stopCurrentSpeech();
    setIsSpeaking(false);

    // 2. Request microphone stream to ensure permissions and active hardware mic
    let stream = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        audioStreamRef.current = stream;
      }
    } catch (permErr) {
      console.warn('[Microphone Permission Error]:', permErr);
      alert('Microphone access was denied. Please allow microphone permissions in your browser address bar.');
      return;
    }

    if (!stream) {
      alert('Unable to access microphone on this device.');
      return;
    }

    // Set listening state active
    isListeningRef.current = true;
    setIsListening(true);
    setIsLiveStreamActive(true);
    audioChunksRef.current = [];

    // Pre-populate accumulator with whatever is already typed
    liveAccumulatorRef.current = typedAnswer ? typedAnswer.trim() + ' ' : '';

    // 3. Setup Browser Speech Recognition for instant live streaming
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        const activeLangCode = micLanguage || userLanguage || 'en';
        const targetLocale = SPEECH_LANG_MAP[activeLangCode] || 'en-IN';

        recognition.lang = targetLocale;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          let interim = '';
          let currentFinal = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const piece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              currentFinal += piece + ' ';
            } else {
              interim += piece;
            }
          }

          if (currentFinal) {
            liveAccumulatorRef.current = (liveAccumulatorRef.current + currentFinal);
          }

          const liveStream = (liveAccumulatorRef.current + interim).trim();
          if (liveStream) {
            setTypedAnswer(liveStream);
          }
        };

        recognition.onerror = (event) => {
          console.warn('[ClinicalFollowUp Live Speech notice]:', event.error);
          if (event.error === 'no-speech') {
            // Normal speech boundary pause — keep listening!
            return;
          }
          if (event.error === 'not-allowed') {
            alert('Microphone access was denied. Please allow microphone permissions in your browser address bar.');
            stopListening();
          }
        };

        // Resilient restart: Do NOT cancel listening on brief silence
        recognition.onend = () => {
          if (isListeningRef.current) {
            try {
              recognition.start();
            } catch (_) {}
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (recErr) {
        console.warn('[SpeechRecognition Setup Error]:', recErr);
      }
    }

    // 4. Setup MediaRecorder as background safety net
    try {
      let mimeType = '';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) mimeType = 'audio/webm;codecs=opus';
        else if (MediaRecorder.isTypeSupported('audio/webm')) mimeType = 'audio/webm';
        else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
      }

      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // If live speech recognition already captured text, skip server wait entirely!
        const capturedChunks = [...audioChunksRef.current];
        if (!liveAccumulatorRef.current.trim() && capturedChunks.length > 0) {
          await processRecordedAudio(capturedChunks);
        }
      };

      mediaRecorder.start(250);
      mediaRecorderRef.current = mediaRecorder;
    } catch (mrErr) {
      console.warn('[MediaRecorder notice]:', mrErr);
    }
  };

  /**
   * Fast, non-blocking translation of the typed/spoken answer into the user's consultation language
   */
  const handleTranslateAnswer = async () => {
    if (!typedAnswer.trim() || isTranslating) return;
    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: typedAnswer.trim(),
          targetLanguage: userLanguage || 'en'
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.translatedText) {
          setTypedAnswer(data.translatedText);
        }
      }
    } catch (err) {
      console.warn('Quick translate failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const submitAnswer = (answer) => {
    const value = (answer || '').trim();
    if (!value) return;

    stopListening();
    stopCurrentSpeech();
    setIsSpeaking(false);
    setDetectedVoiceLang(null);

    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);
    setTypedAnswer('');

    if (step < QUESTIONS.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      onComplete?.(nextAnswers);
    }
  };

  if (!question) {
    return null;
  }

  return (
    <div className="follow-up-card">
      <div className="follow-up-header">
        <div className="follow-up-badge">
          <Sparkles size={14} />
          <span>AI Clinical Follow-up Consultation</span>
        </div>
        <div className="follow-up-progress-text">
          Question {step + 1} of {QUESTIONS.length}
        </div>
      </div>

      <div className="follow-up-progress-bar">
        <div
          className="follow-up-progress-fill"
          style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      {!hasStarted ? (
        <div className="follow-up-start-pane">
          <p className="follow-up-start-desc">
            AYUSETU AI needs a few brief follow-up details to complete your clinical assessment.
            You can answer by speaking in your selected language ({userLanguage.toUpperCase()}) or clicking the options.
          </p>
          <button
            type="button"
            className="follow-up-start-btn"
            onClick={startVoiceInterview}
          >
            <Volume2 size={18} />
            <span>Start Spoken Follow-up Questions (Bhashini TTS)</span>
          </button>
        </div>
      ) : (
        <div className="follow-up-body">
          <div className="follow-up-question-top">
            <span className="question-step-label">Question {step + 1}</span>
            <button
              type="button"
              className={`follow-up-speak-btn ${isSpeaking ? 'is-speaking' : ''}`}
              onClick={() => {
                if (isSpeaking) {
                  stopCurrentSpeech();
                  setIsSpeaking(false);
                } else {
                  speakQuestion();
                }
              }}
              title="Read question aloud via Bhashini TTS"
            >
              <Volume2 size={16} />
              <span>{isSpeaking ? 'Speaking Bhashini TTS…' : 'Read Aloud'}</span>
            </button>
          </div>

          <h4 className="follow-up-question-title">{questionTitle}</h4>
          <p className="follow-up-question-prompt">{questionPrompt}</p>

          <div className="follow-up-options-grid">
            {Array.isArray(localizedOptions) && localizedOptions.map((option) => (
              <button
                type="button"
                key={option}
                className="follow-up-option-pill"
                onClick={() => submitAnswer(option)}
              >
                <Check size={14} />
                <span>{option}</span>
              </button>
            ))}
          </div>

          {isListening && (
            <div className="follow-up-live-indicator">
              <span className="live-dot" />
              <span>
                Live Voice Detection ({LANG_DISPLAY_NAMES[micLanguage] || micLanguage}) — Words appear in real-time as you speak...
              </span>
            </div>
          )}

          <div className="follow-up-free-answer">
            <input
              type="text"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              placeholder={
                isListening
                  ? `🎙️ Listening live in ${LANG_DISPLAY_NAMES[micLanguage]?.split(' ')[0] || micLanguage}... speak now`
                  : isTranscribing
                  ? "⏳ Transcribing audio..."
                  : "Or speak / type your own detailed answer…"
              }
              className={isListening ? "is-listening-input" : isTranscribing ? "is-transcribing-input" : ""}
              disabled={isTranscribing}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && typedAnswer.trim()) {
                  submitAnswer(typedAnswer);
                }
              }}
            />
            <button
              type="button"
              className={`follow-up-mic ${isListening ? 'is-listening' : ''} ${isTranscribing ? 'is-transcribing' : ''}`}
              onClick={startListening}
              disabled={isTranscribing}
              aria-label={isListening ? 'Stop live microphone' : 'Speak answer with live microphone'}
              title={
                isTranscribing
                  ? 'Transcribing audio...'
                  : isListening
                  ? 'Live speech detection active. Tap to stop.'
                  : 'Tap to speak live in real time'
              }
            >
              {isTranscribing ? (
                <Loader2 size={18} className="follow-up-spin" />
              ) : isListening ? (
                <MicOff size={18} />
              ) : (
                <Mic size={18} />
              )}
            </button>
            <button
              type="button"
              className="follow-up-next"
              onClick={() => submitAnswer(typedAnswer)}
              disabled={!typedAnswer.trim() || isTranscribing}
              title="Submit answer and proceed"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {userLanguage && userLanguage !== 'en' && (
            <div className="follow-up-lang-bar">
              <span className="follow-up-lang-label">Voice Mic:</span>
              <button
                type="button"
                className={`follow-up-lang-chip ${micLanguage === userLanguage ? 'active' : ''}`}
                onClick={() => {
                  setMicLanguage(userLanguage);
                  if (isListening) stopListening();
                }}
                title={`Listen in ${LANG_DISPLAY_NAMES[userLanguage] || userLanguage}`}
              >
                {LANG_DISPLAY_NAMES[userLanguage] || userLanguage}
              </button>
              <button
                type="button"
                className={`follow-up-lang-chip ${micLanguage === 'en' ? 'active' : ''}`}
                onClick={() => {
                  setMicLanguage('en');
                  if (isListening) stopListening();
                }}
                title="Listen in English"
              >
                English
              </button>

              {typedAnswer && (
                <button
                  type="button"
                  className="follow-up-translate-btn"
                  onClick={handleTranslateAnswer}
                  disabled={isTranslating}
                  title={`Translate into ${LANG_DISPLAY_NAMES[userLanguage] || userLanguage}`}
                >
                  <Sparkles size={13} />
                  <span>
                    {isTranslating
                      ? 'Translating…'
                      : `Translate to ${LANG_DISPLAY_NAMES[userLanguage]?.split(' ')[0] || userLanguage}`}
                  </span>
                </button>
              )}
            </div>
          )}

          {detectedVoiceLang && (
            <div className="follow-up-detected-badge">
              <span>🌐 Voice Detected: <strong>{detectedVoiceLang}</strong> • Converted into: <strong>{(userLanguage || 'en').toUpperCase()}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
