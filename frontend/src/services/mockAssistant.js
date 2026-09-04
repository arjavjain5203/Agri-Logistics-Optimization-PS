// Mock AI Assistant Service for KrishiFlow AI
// Provides context-aware, bilingual, intelligent responses for Indian agricultural supply chain

export const getSuggestedQuestions = (pathname = '', role = 'buyer', language = 'en') => {
  const isHi = language === 'hi';

  if (pathname.includes('/ai')) {
    return isHi
      ? [
          "टमाटर की मांग क्यों बढ़ रही है?",
          "अनुमानित आपूर्ति की कमी कितनी है?",
          "मुझे क्या खरीदना चाहिए?",
          "बाज़ार संकेतक क्या दर्शा रहे हैं?"
        ]
      : [
          "Why is tomato demand increasing?",
          "What is the expected supply gap?",
          "What should I procure?",
          "What are the key market signals?"
        ];
  }

  if (pathname.includes('/logistics')) {
    return isHi
      ? [
          "यह रूट सबसे अच्छा क्यों है?",
          "कितनी दूरी बचाई गई है?",
          "क्या लॉजिस्टिक्स लागत कम की जा सकती है?",
          "वाहन का तापमान कितना है?"
        ]
      : [
          "Why is this route optimal?",
          "How much distance is saved?",
          "Can logistics cost be reduced?",
          "What is the reefer temperature?"
        ];
  }

  if (pathname.includes('/matching')) {
    return isHi
      ? [
          "इस किसान की सिफारिश क्यों की गई?",
          "मुझे सबसे अच्छा आपूर्तिकर्ता दिखाएँ।",
          "इन आपूर्तिकर्ताओं की तुलना करें।",
          "क्या 500 किग्रा पूरी हो गई है?"
        ]
      : [
          "Why was this farmer recommended?",
          "Show me the best supplier.",
          "Compare these suppliers.",
          "Is the 500 kg volume fulfilled?"
        ];
  }

  if (pathname.includes('/pricing')) {
    return isHi
      ? [
          "पारंपरिक बनाम KrishiFlow में क्या अंतर है?",
          "किसान को ₹22/किग्रा कैसे मिलता है?",
          "खरीदार की 10% बचत कैसे होती है?"
        ]
      : [
          "How does KrishiFlow improve farmer earnings?",
          "Where do the middleman savings go?",
          "How does the buyer save 10%?"
        ];
  }

  if (pathname.includes('/impact')) {
    return isHi
      ? [
          "फसल बर्बादी में कितनी कमी आई है?",
          "कितना कार्बन उत्सर्जन बचा?",
          "कितने छोटे किसान लाभान्वित हुए?"
        ]
      : [
          "How much food waste is reduced?",
          "How much carbon is saved?",
          "How many smallholders are empowered?"
        ];
  }

  if (pathname.includes('/farmer') || role === 'farmer') {
    return isHi
      ? [
          "किस फसल की मांग अधिक है?",
          "मुझे किस कीमत पर बेचने पर विचार करना चाहिए?",
          "पास के खरीदारों की मांग दिखाएँ।",
          "मेरी उपज का भुगतान कब होगा?"
        ]
      : [
          "Which crop has higher demand?",
          "What price should I consider?",
          "Show nearby buyer demand.",
          "When will my harvest payout arrive?"
        ];
  }

  // Default / Buyer Dashboard
  return isHi
    ? [
        "इस सप्ताह मांग कैसी है?",
        "मुझे किन फसलों की खरीद करनी चाहिए?",
        "रमेश कुमार की सिफारिश क्यों की गई?",
        "मेरे लंबित ऑर्डर दिखाएँ।"
      ]
    : [
        "How is demand looking this week?",
        "Which crops should I procure?",
        "Why is Ramesh Kumar a good supplier?",
        "Show me pending orders."
      ];
};

export const getQuickActions = (pathname = '', role = 'buyer', language = 'en') => {
  const isHi = language === 'hi';

  if (role === 'farmer' || pathname.includes('/farmer')) {
    return [
      { label: isHi ? 'मांग देखें' : 'View Demand', path: '/farmer/demand', query: 'Show nearby buyer demand' },
      { label: isHi ? 'अनुशंसित कीमत' : 'Recommended Price', path: '/pricing', query: 'What price should I consider?' },
      { label: isHi ? 'मेरे ऑर्डर' : 'My Orders', path: '/farmer/orders', query: 'Show my dispatches and orders' },
    ];
  }

  return [
    { label: isHi ? 'मांग जांचें' : 'Check Demand', path: '/ai', query: 'How is demand looking this week?' },
    { label: isHi ? 'आपूर्तिकर्ता खोजें' : 'Find Suppliers', path: '/buyer/matching', query: 'Show me the best supplier' },
    { label: isHi ? 'खरीद अनुरोध' : 'Create Demand', path: '/buyer/demand', query: 'How do I create a procurement request?' },
  ];
};

export const getAssistantResponse = async (userMessage, context = {}, language = 'en') => {
  // Simulate natural AI thinking delay (500-750ms)
  await new Promise((resolve) => setTimeout(resolve, 600));

  const msg = (userMessage || '').toLowerCase().trim();
  const isHi = language === 'hi';
  const pathname = context.pathname || '';
  const role = context.role || 'buyer';

  // 1. Demand & Which crops to procure
  if (
    msg.includes('highest demand') ||
    msg.includes('which crop') ||
    msg.includes('demand looking') ||
    msg.includes('what should i procure') ||
    msg.includes('kin faslon') ||
    msg.includes('maang') ||
    msg.includes('मांग') ||
    msg.includes('फसल') ||
    msg.includes('खरीद')
  ) {
    return {
      text: isHi
        ? "वर्तमान लाइव डेटा के अनुसार, दिल्ली NCR में **टमाटर (Tomato)** की मांग में सबसे तीव्र वृद्धि देखी जा रही है।\n\n- **वर्तमान मांग:** 2,100 किग्रा\n- **अनुमानित मांग:** 2,500 किग्रा (+19% वृद्धि)\n- **अनुमानित कमी:** 320 किग्रा\n\nकीमतें बढ़ने से पहले निकटतम FPO से 300-320 किग्रा अतिरिक्त आपूर्ति सुरक्षित करने की सलाह दी जाती है।"
        : "Based on current market intelligence, **Tomato** has the strongest projected demand surge in Delhi NCR.\n\n- **Current Demand:** 2,100 kg\n- **Predicted Demand:** 2,500 kg (+19% surge)\n- **Anticipated Supply Gap:** 320 kg\n\nIt is recommended to secure an additional 300–320 kg buffer from local FPOs before wholesale mandi rates rise.",
      card: {
        title: isHi ? "AI मांग पूर्वानुमान अलर्ट" : "AI Demand Forecast Alert",
        crop: isHi ? "टमाटर (Tomato Grade A)" : "Tomato (Grade A)",
        metric: "+19%",
        metricLabel: isHi ? "मांग वृद्धि (अगले सप्ताह)" : "Demand Surge (Next 7 Days)",
        value: "2,500 kg",
        actionText: isHi ? "मांग पूर्वानुमान खोलें" : "Open Demand Forecast",
        actionPath: "/ai"
      }
    };
  }

  // 2. Ramesh Kumar / Supplier questions
  if (
    msg.includes('ramesh') ||
    msg.includes('supplier') ||
    msg.includes('recommend') ||
    msg.includes('best supplier') ||
    msg.includes('sita') ||
    msg.includes('fpo') ||
    msg.includes('रमेश') ||
    msg.includes('आपूर्तिकर्ता') ||
    msg.includes('सिफारिश')
  ) {
    return {
      text: isHi
        ? "**रमेश कुमार** आपके 500 किग्रा खरीद अनुरोध के लिए 94% मैच स्कोर के साथ सबसे उपयुक्त आपूर्तिकर्ता हैं:\n\n✓ **मात्रा:** 250 किग्रा तुरंत उपलब्ध\n✓ **गुणवत्ता:** प्रमाणित ग्रेड A (होटल/रेस्तरां मानक)\n✓ **दूरी:** केवल 8 किमी (दादरी फार्म गेट #1)\n✓ **कीमत:** ₹22/किग्रा (आपके ₹30 बजट के पूर्णतः अनुकूल)\n✓ **डिलीवरी:** आज सुबह 09:25 बजे फार्म-गेट पिकअप तैयार\n\nसाथ ही सीता देवी (150 किग्रा) और ग्रीन वैली FPO (100 किग्रा) को मिलाकर कुल 500 किग्रा का 100% समूहन पूरा होता है।"
        : "**Ramesh Kumar** is the optimal match with a **94% Match Score** for your procurement requirement:\n\n✓ **Available Volume:** 250 kg ready for harvest\n✓ **Quality Grade:** Certified Grade A (Institutional standard)\n✓ **Proximity:** Just 8 km away (Dadri Farm Gate #1)\n✓ **Price:** ₹22/kg (Well within your ₹30/kg budget ceiling)\n✓ **Fulfillment:** Gate pickup scheduled at 09:25 AM today\n\nCombined with Sita Devi (150 kg) and Green Valley FPO (100 kg), your 500 kg requirement is 100% fulfilled without any supply deficit.",
      card: {
        title: isHi ? "सर्वश्रेष्ठ आपूर्तिकर्ता मिलान" : "Best Recommended Supplier",
        crop: isHi ? "रमेश कुमार (दादरी)" : "Ramesh Kumar (Dadri Belt)",
        metric: "94%",
        metricLabel: isHi ? "स्मार्ट मैच स्कोर" : "Smart Match Score",
        value: "250 kg @ ₹22/kg",
        actionText: isHi ? "स्मार्ट मिलान देखें" : "View Smart Matching",
        actionPath: "/buyer/matching"
      }
    };
  }

  // 3. Logistics & Route optimization
  if (
    msg.includes('logistics') ||
    msg.includes('route') ||
    msg.includes('distance') ||
    msg.includes('cost') ||
    msg.includes('saved') ||
    msg.includes('temperature') ||
    msg.includes('reefer') ||
    msg.includes('रूट') ||
    msg.includes('दूरी') ||
    msg.includes('लॉजिस्टिक्स') ||
    msg.includes('गाड़ी')
  ) {
    return {
      text: isHi
        ? "कृषिFlow AI मल्टी-स्टॉप क्लस्टर एल्गोरिथम का उपयोग करता है, जो कई छोटे किसानों से एक ही वाहन में उपज एकत्र करता है:\n\n- **अनुकूलित मार्ग दूरी:** 42 किमी (पारंपरिक 61 किमी की तुलना में)\n- **बचाई गई दूरी:** 19 किमी (-31% बचत)\n- **अनुमानित परिवहन समय:** 1 घंटा 35 मिनट\n- **कुल मालभाड़ा लागत:** ₹850 (केवल ₹1.70/किग्रा)\n- **कोल्ड-चेन सुरक्षा:** टाटा ऐस EV रेफ़र (सक्रिय 11°C तापमान नियंत्रण)\n- **CO₂ बचत:** 4.2 किग्रा कार्बन उत्सर्जन की रोकथाम।"
        : "KrishiFlow AI deploys dynamic multi-stop aggregation algorithms, bundling smallholder harvests into a unified refrigerated run:\n\n- **Optimized Total Distance:** 42 km (vs. 61 km for separate dispatches)\n- **Distance Saved:** 19 km (-31% road mileage reduction)\n- **Estimated Transit Time:** 1h 35m\n- **Total Freight Cost:** ₹850 (Just ₹1.70/kg landed freight)\n- **Cold-Chain Assurance:** Tata Ace EV Reefer active at 11°C\n- **Environmental Gain:** 4.2 kg CO₂ tailpipe emissions prevented.",
      card: {
        title: isHi ? "अनुकूलित मार्ग स्थिति" : "Optimized Route Status",
        crop: isHi ? "दादरी → बुलंदशहर → सेक्टर 62 नोएडा" : "Dadri → Bulandshahr → Noida Hub",
        metric: "19 km",
        metricLabel: isHi ? "सड़क दूरी की सीधी बचत" : "Road Distance Saved (-31%)",
        value: "42 km • ₹850 Freight",
        actionText: isHi ? "रूट देखें" : "View Route",
        actionPath: "/logistics"
      }
    };
  }

  // 4. Pricing / Economics / Farmer earnings
  if (
    msg.includes('price') ||
    msg.includes('earning') ||
    msg.includes('margin') ||
    msg.includes('middleman') ||
    msg.includes('rupee') ||
    msg.includes('कीमत') ||
    msg.includes('कमाई') ||
    msg.includes('रुपये') ||
    msg.includes('बचत') ||
    msg.includes('आढ़तिया')
  ) {
    return {
      text: isHi
        ? "कृषिFlow पारदर्शी एल्गोरिथम के माध्यम से बिचौलियों के भारी कमीशन को समाप्त करता है:\n\n**पारंपरिक मंडी प्रणाली (₹30/किग्रा):**\n- किसान को मिलता है: ₹15/किग्रा (मात्र 50%)\n- बिचौलिया आढ़तिया कमीशन: ₹10/किग्रा\n- अनियंत्रित लॉजिस्टिक्स: ₹5/किग्रा\n\n**कृषिFlow AI प्रणाली (₹27/किग्रा):**\n- किसान को सीधा भुगतान: ₹22/किग्रा (+46.6% की सीधी वृद्धि)\n- कुशल समूहित लॉजिस्टिक्स: ₹3/किग्रा\n- प्लेटफ़ॉर्म एवं गुणवत्ता शुल्क: ₹2/किग्रा\n- खरीदार को बचत: ₹3/किग्रा (-10% सीधी बचत)\n\nभुगतान डिजिटल गुणवत्ता जांच के बाद तुरंत UPI एस्क्रो द्वारा सुरक्षित होता है।"
        : "KrishiFlow replaces opaque multi-tier commission agent cuts with transparent, automated matching:\n\n**Traditional Mandi System (Buyer pays ₹30/kg):**\n- Farmer receives: ₹15/kg (only 50% of value)\n- Intermediary margins: ₹10/kg (Kacha & Pakka Arhtiya cuts)\n- Fragmented logistics: ₹5/kg\n\n**KrishiFlow AI System (Buyer pays ₹27/kg):**\n- Farmer receives: ₹22/kg (+46.6% higher direct farmgate payout)\n- Clustered multi-pickup logistics: ₹3/kg\n- Platform & QA verification fee: ₹2/kg\n- Buyer cost savings: 10.0% direct reduction\n\nSettlement is executed directly into farmer accounts via instant UPI escrow.",
      card: {
        title: isHi ? "आर्थिक मूल्य तुलना" : "Fair Economic Breakdown",
        crop: isHi ? "टमाटर (प्रति किलोग्राम)" : "Tomato (Per kg landed)",
        metric: "+46.6%",
        metricLabel: isHi ? "किसान की अतिरिक्त आय" : "Farmer Income Gain (₹22 vs ₹15)",
        value: "₹27 Buyer Landed (Save 10%)",
        actionText: isHi ? "मूल्य विवरण देखें" : "View Price Breakdown",
        actionPath: "/pricing"
      }
    };
  }

  // 5. Orders / Pending orders / Dispatch
  if (
    msg.includes('order') ||
    msg.includes('pending') ||
    msg.includes('dispatch') ||
    msg.includes('track') ||
    msg.includes('status') ||
    msg.includes('ऑर्डर') ||
    msg.includes('लंबित') ||
    msg.includes('ट्रैक') ||
    msg.includes('स्थिति')
  ) {
    return {
      text: isHi
        ? "वर्तमान में सक्रिय खरीद बैच **#KF-2026-0903** की स्थिति:\n\n- **मात्रा:** 500 किग्रा टमाटर (ग्रेड A)\n- **वर्तमान चरण:** रास्ते में (In Transit)\n- **पिकअप प्रगति:** रमेश कुमार, सीता देवी और ग्रीन वैली FPO से पिकअप पूर्ण\n- **अनुमानित डिलीवरी:** आज सुबह 11:30 बजे (फ्रेशबाइट सेंट्रल किचन, नोएडा सेक्टर 62)\n- **सुरक्षा:** डिजिटल वजन और गुणवत्ता जांच (कठोरता 8.4/10) सत्यापित।"
        : "Status for active procurement batch **#KF-2026-0903**:\n\n- **Volume:** 500 kg Grade A Tomato\n- **Current Milestone:** In Transit to Hub\n- **Pickup Status:** Completed at Ramesh Kumar, Sita Devi & Green Valley FPO\n- **Estimated Delivery:** Today at 11:30 AM (FreshBite Central Kitchen, Sec 62)\n- **Quality Verification:** Firmness 8.4/10, Grade A calibrated.",
      card: {
        title: isHi ? "लाइव ऑर्डर ट्रैकिंग" : "Live Order Dispatch",
        crop: isHi ? "बैच #KF-2026-0903" : "Batch #KF-2026-0903",
        metric: isHi ? "रास्ते में" : "In Transit",
        metricLabel: isHi ? "आगमन समय: आज 11:30 AM" : "ETA: Today 11:30 AM",
        value: "500 kg Tomato",
        actionText: isHi ? "ऑर्डर देखें" : "View Orders",
        actionPath: "/orders"
      }
    };
  }

  // 6. Impact / Sustainability / Carbon
  if (
    msg.includes('impact') ||
    msg.includes('waste') ||
    msg.includes('carbon') ||
    msg.includes('sustainab') ||
    msg.includes('महिला') ||
    msg.includes('प्रभाव') ||
    msg.includes('बर्बादी')
  ) {
    return {
      text: isHi
        ? "कृषिFlow आपूर्ति श्रृंखला प्रभाव सारांश:\n\n- **फसल बर्बादी में कमी:** कटाई के बाद उपज बर्बादी 28% से घटकर मात्र 6.2% रह गई है।\n- **कार्बन उत्सर्जन:** 38.5 मीट्रिक टन CO₂eq की रोकथाम हुई है।\n- **किसान सशक्तिकरण:** 1,240+ छोटे किसान सीधे जुड़े हैं।\n- **महिला सहभागिता:** 41% महिला किसान FPO समूहों में सक्रिय रूप से जुड़ी हैं।"
        : "KrishiFlow verifiable supply-chain impact metrics:\n\n- **Post-Harvest Spoilage:** Cut from 28% down to just 6.2% with 3-hour cold farmgate collection.\n- **Carbon Reduction:** 38.5 MT CO₂eq avoided via route clustering.\n- **Smallholder Empowerment:** 1,240+ small & marginal farmers.\n- **Inclusivity:** 41% women farmers represented across FPO cohorts.",
      card: {
        title: isHi ? "पर्यावरण एवं सामाजिक प्रभाव" : "Supply Chain Impact",
        crop: isHi ? "खाद्य बर्बादी में कमी" : "Food Spoilage Reduction",
        metric: "6.2%",
        metricLabel: isHi ? "28% से घटकर 6.2% पर" : "Down from 28% to 6.2%",
        value: "1,240+ Farmers Empowered",
        actionText: isHi ? "प्रभाव डैशबोर्ड देखें" : "View Impact",
        actionPath: "/impact"
      }
    };
  }

  // 7. Context fallback based on page
  if (pathname.includes('/ai')) {
    return {
      text: isHi
        ? "आप वर्तमान में **मांग पूर्वानुमान (Demand Intelligence)** पृष्ठ पर हैं। हमारा AI मॉडल दिल्ली NCR के रेस्तराओं, शादियों और आगामी त्योहारों के डेटा का विश्लेषण कर 3 सप्ताह पहले मांग की भविष्यवाणी करता है। टमाटर में 19% की संभावित वृद्धि दर्ज हुई है।"
        : "You are currently on the **Demand Intelligence** analytics page. Our ensemble predictive model aggregates mandi arrivals and buyer schedules to forecast peak deficits. We anticipate a 320 kg tomato shortage next week in Delhi NCR.",
      card: {
        title: isHi ? "AI विश्लेषण" : "AI Forecast Overview",
        crop: "Tomato (Delhi NCR)",
        metric: "+19%",
        metricLabel: isHi ? "अनुमानित मांग वृद्धि" : "Projected Demand Growth",
        value: "2,500 kg Forecast",
        actionText: isHi ? "खरीद अनुरोध बनाएं" : "Create Procurement Request",
        actionPath: "/buyer/demand"
      }
    };
  }

  // 8. General fallback
  return {
    text: isHi
      ? "मुझे आपका प्रश्न पूरी तरह समझ नहीं आया। मैं मांग, आपूर्तिकर्ता, कीमत, लॉजिस्टिक्स, ऑर्डर या कृषिFlow के उपयोग में आपकी मदद कर सकता हूँ।"
      : "I'm not sure I understood that. I can help with demand, suppliers, prices, logistics, orders, or using KrishiFlow.",
    card: {
      title: isHi ? "सहायता विकल्प" : "Suggested Assistance",
      crop: isHi ? "कृषिFlow AI सहायक" : "KrishiFlow AI Engine",
      metric: "94.8%",
      metricLabel: isHi ? "सिस्टम तत्परता" : "System Readiness",
      value: isHi ? "मांग • मिलान • लॉजिस्टिक्स" : "Demand • Matching • Fleet",
      actionText: isHi ? "डैशबोर्ड पर जाएँ" : "Go to Dashboard",
      actionPath: role === 'farmer' ? "/farmer" : "/buyer"
    }
  };
};

export default {
  getSuggestedQuestions,
  getQuickActions,
  getAssistantResponse,
};
