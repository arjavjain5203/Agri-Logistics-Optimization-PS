import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { HeroCarousel } from '../components/HeroCarousel';
import {
  Sprout,
  ArrowRight,
  BrainCircuit,
  Layers,
  Truck,
  Receipt,
  Check,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

export const LandingPage = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLangToggle = (lang) => {
    setLanguage(lang);
  };

  const narrativeSteps = [
    {
      step: '01',
      shape: 'circle',
      title: language === 'hi' ? 'मांग पूर्वानुमान' : 'Demand Intelligence',
      desc: language === 'hi'
        ? 'मंडी मांग और संस्थागत आवश्यकताओं का 3 सप्ताह पहले सटीक पूर्वानुमान।'
        : 'Predict regional mandi demand and institutional purchase requirements up to 3 weeks ahead.',
      icon: BrainCircuit,
    },
    {
      step: '02',
      shape: 'square',
      title: language === 'hi' ? 'स्मार्ट समूहन' : 'Supply Aggregation',
      desc: language === 'hi'
        ? 'छोटे किसानों की बिखरी उपज को जोड़कर बड़े खरीदारों के लिए पूर्ण लॉट तैयार करना।'
        : 'Automatically cluster fragmented smallholder harvests into standard enterprise bulk batches.',
      icon: Layers,
    },
    {
      step: '03',
      shape: 'triangle',
      title: language === 'hi' ? 'गतिशील रूटिंग' : 'Dynamic Logistics',
      desc: language === 'hi'
        ? 'मल्टी-स्टॉप फार्म पिकअप और कोल्ड-चेन समन्वय से परिवहन दूरी में 31% कमी।'
        : 'Reduce transit distances by 31% with multi-stop farm pickup and cold-chain coordination.',
      icon: Truck,
    },
    {
      step: '04',
      shape: 'diamond',
      title: language === 'hi' ? 'पारदर्शी अर्थशास्त्र' : 'Fair Economics',
      desc: language === 'hi'
        ? 'बिचौलियों की मध्यस्थता समाप्त। किसानों को 46% अधिक आय और खरीदार को 10% बचत।'
        : 'Disintermediate opaque middlemen. Farmers earn 46% more while buyers save 10% on procurement.',
      icon: Receipt,
    },
  ];

  return (
    <div className="min-h-screen bg-cream text-charcoal font-sans antialiased selection:bg-gold selection:text-charcoal">
      {/* ========================================================
          1. NAVIGATION: BAUHAUS GEOMETRIC HEADER
          ======================================================== */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-charcoal px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-bauhaus-sm">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: '#14532D', color: '#FFFFFF' }}
            className="w-9 h-9 bg-forest border-2 border-charcoal text-white flex items-center justify-center shadow-bauhaus-sm"
          >
            <Sprout className="w-5 h-5 text-gold" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-black text-lg sm:text-xl tracking-tighter text-charcoal uppercase">
              {t('brand.name')}
            </span>
            <span
              style={{ backgroundColor: '#EAB308', color: '#172016' }}
              className="hidden sm:inline-block text-[10px] font-mono font-bold px-1.5 py-0.2 bg-gold border border-charcoal text-charcoal"
            >
              AGRITECH 2026
            </span>
          </div>
        </div>

        {/* Language switcher & Live Demo CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Segmented Bauhaus Language Toggle with bulletproof contrast */}
          <div className="flex border-2 border-charcoal bg-white shadow-bauhaus-sm">
            <button
              onClick={() => handleLangToggle('en')}
              style={
                language === 'en'
                  ? { backgroundColor: '#14532D', color: '#FFFFFF' }
                  : { backgroundColor: '#FFFFFF', color: '#172016' }
              }
              className={`px-3 py-1 text-xs font-black transition-colors ${
                language === 'en'
                  ? 'bg-forest text-white'
                  : 'text-charcoal hover:bg-gold/30'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLangToggle('hi')}
              style={
                language === 'hi'
                  ? { backgroundColor: '#14532D', color: '#FFFFFF' }
                  : { backgroundColor: '#FFFFFF', color: '#172016' }
              }
              className={`px-3 py-1 text-xs font-black transition-colors border-l-2 border-charcoal ${
                language === 'hi'
                  ? 'bg-forest text-white'
                  : 'text-charcoal hover:bg-gold/30'
              }`}
            >
              हिन्दी
            </button>
          </div>

          <Link
            to="/login"
            className="text-xs font-bold uppercase tracking-wider text-charcoal hover:text-forest px-2 py-1 transition-colors hidden sm:block"
          >
            {t('nav.profile')}
          </Link>

          <Link
            to="/buyer"
            className="btn-bauhaus-primary px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>{t('landing.viewLiveDemo')}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </Link>
        </div>
      </header>

      {/* ========================================================
          2. HERO SECTION: WARM CREAM + BOLD BAUHAUS TYPOGRAPHY
          ======================================================== */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Bold Typography & Slogan */}
          <div className="lg:col-span-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-charcoal text-charcoal text-xs font-bold uppercase tracking-wider mb-5 shadow-bauhaus-sm">
              <span
                style={{ backgroundColor: '#14532D' }}
                className="w-2.5 h-2.5 rounded-full bg-forest border border-charcoal"
              ></span>
              <span>{t('landing.heroBadge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-charcoal tracking-tight leading-[1.05] uppercase">
              {language === 'hi' ? (
                <>
                  खेत से मांग तक,<br />
                  <span
                    style={{ backgroundColor: '#14532D', color: '#EAB308' }}
                    className="bg-forest text-gold px-2 inline-block mt-1 border-2 border-charcoal shadow-bauhaus-sm"
                  >
                    बुद्धिमानी के साथ।
                  </span>
                </>
              ) : (
                <>
                  FROM FARM<br />
                  <span
                    style={{ backgroundColor: '#14532D', color: '#EAB308' }}
                    className="bg-forest text-gold px-2.5 py-0.5 inline-block mt-1 border-2 border-charcoal shadow-bauhaus-sm"
                  >
                    TO DEMAND.
                  </span>
                </>
              )}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-charcoal font-medium leading-relaxed max-w-xl">
              {language === 'hi'
                ? 'AI आधारित मांग पूर्वानुमान, स्मार्ट समूहन और अनुकूलित मल्टी-पिकअप लॉजिस्टिक्स के साथ भारतीय किसानों को वास्तविक खरीदार मांग से जोड़ें।'
                : 'AI-powered agricultural sourcing that connects farmers with real demand using predictive forecasting, smallholder aggregation, and optimized logistics.'}
            </p>

            {/* Bauhaus Physical Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/buyer/demand"
                className="btn-bauhaus-primary px-6 py-3.5 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2"
              >
                <span>{t('landing.startProcuring')}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>

              <Link
                to="/buyer/marketplace"
                className="btn-bauhaus-gold px-6 py-3.5 text-xs sm:text-sm uppercase tracking-wider"
              >
                <span>{t('landing.exploreMarketplace')}</span>
              </Link>

              <Link
                to="/farmer"
                className="px-4 py-3 bg-white hover:bg-cream border-2 border-charcoal shadow-bauhaus-sm text-charcoal font-bold text-xs uppercase tracking-wider transition-transform active:translate-x-[2px] active:translate-y-[2px]"
              >
                {t('landing.farmerLogin')} →
              </Link>
            </div>

            {/* Geometric Credibility Strip */}
            <div className="mt-10 pt-6 border-t-3 border-charcoal flex flex-wrap items-center gap-6 text-xs font-bold uppercase text-charcoal">
              <div className="flex items-center gap-2">
                <span style={{ backgroundColor: '#4D7C0F' }} className="w-3 h-3 bg-crop border border-charcoal"></span>
                <span>{language === 'hi' ? '1,200+ सत्यापित किसान' : '1,200+ Verified Farmers'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ backgroundColor: '#EAB308' }} className="w-3 h-3 rounded-full bg-gold border border-charcoal"></span>
                <span>{language === 'hi' ? 'शून्य आढ़तिया कटौती' : 'Zero Middleman Markups'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ backgroundColor: '#92400E' }} className="w-3 h-3 bg-earth border border-charcoal rotate-45"></span>
                <span>{language === 'hi' ? 'UPI एस्क्रो सुरक्षा' : '100% Escrow Settlement'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Bauhaus Styled Agricultural Carousel */}
          <div className="lg:col-span-6 w-full">
            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* ========================================================
          3. STATISTICS BAR: HARVEST GOLD FULL-WIDTH PANEL
          ======================================================== */}
      <section
        style={{ backgroundColor: '#EAB308' }}
        className="border-y-4 border-charcoal bg-gold py-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus">
              <span style={{ backgroundColor: '#14532D' }} className="w-3 h-3 rounded-full bg-forest inline-block mb-2 border border-charcoal"></span>
              <p className="text-3xl sm:text-4xl font-black text-charcoal font-mono tracking-tight">+46%</p>
              <p className="text-xs font-black uppercase text-charcoal mt-1">
                {t('impact.farmerPriceImprovement')}
              </p>
              <p className="text-[11px] font-medium text-charcoal/80 mt-1">
                {language === 'hi' ? 'बिचौलियों के बिना सीधी फार्मगेट आय' : 'Direct farmgate net payout'}
              </p>
            </div>

            <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus">
              <span style={{ backgroundColor: '#4D7C0F' }} className="w-3 h-3 bg-crop inline-block mb-2 border border-charcoal"></span>
              <p className="text-3xl sm:text-4xl font-black text-charcoal font-mono tracking-tight">-10%</p>
              <p className="text-xs font-black uppercase text-charcoal mt-1">
                {t('impact.buyerCostReduction')}
              </p>
              <p className="text-[11px] font-medium text-charcoal/80 mt-1">
                {language === 'hi' ? 'थोक खरीद पर संस्थागत बचत' : 'Institutional volume savings'}
              </p>
            </div>

            <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus">
              <span style={{ backgroundColor: '#92400E' }} className="w-3 h-3 bg-earth inline-block mb-2 border border-charcoal rotate-45"></span>
              <p className="text-3xl sm:text-4xl font-black text-charcoal font-mono tracking-tight">-31%</p>
              <p className="text-xs font-black uppercase text-charcoal mt-1">
                {t('impact.logisticsDistance')}
              </p>
              <p className="text-[11px] font-medium text-charcoal/80 mt-1">
                {language === 'hi' ? 'मल्टी-स्टॉप क्लस्टर रूटिंग' : 'Clustered pickup distance reduction'}
              </p>
            </div>

            <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus">
              <span style={{ backgroundColor: '#14532D' }} className="w-3 h-3 rounded-full bg-forest inline-block mb-2 border border-charcoal"></span>
              <p className="text-3xl sm:text-4xl font-black text-charcoal font-mono tracking-tight">94%</p>
              <p className="text-xs font-black uppercase text-charcoal mt-1">
                {t('impact.supplyFulfillment')}
              </p>
              <p className="text-[11px] font-medium text-charcoal/80 mt-1">
                {language === 'hi' ? 'सटीक ऑन-टाइम मांग पूर्ति' : 'On-time contract fulfillment index'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. HOW IT WORKS: SOFT SAGE COLOR BLOCK
          ======================================================== */}
      <section
        style={{ backgroundColor: '#DDE7D8', color: '#172016' }}
        className="bg-sage text-charcoal py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-charcoal"
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span
              style={{ backgroundColor: '#14532D', color: '#FFFFFF' }}
              className="inline-block px-2.5 py-1 bg-forest text-white text-xs font-black uppercase tracking-wider border-2 border-charcoal shadow-bauhaus-sm mb-3"
            >
              {language === 'hi' ? 'कार्यप्रणाली' : 'SYSTEM ARCHITECTURE'}
            </span>
            <h2
              style={{ color: '#172016' }}
              className="text-3xl sm:text-4xl font-black text-charcoal tracking-tight uppercase"
            >
              {t('landing.keyMetricsHeading')}
            </h2>
            <p
              style={{ color: 'rgba(23, 32, 22, 0.85)' }}
              className="text-sm text-charcoal/80 mt-2 font-medium"
            >
              {language === 'hi'
                ? 'मांग पूर्वानुमान से लेकर अंतिम किसान भुगतान तक का व्यवस्थित एवं कुशल तंत्र।'
                : 'An end-to-end network connecting fragmented Indian agriculture with institutional procurement.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {narrativeSteps.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="p-6 bg-white text-charcoal border-3 border-charcoal shadow-bauhaus-lg flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b-2 border-charcoal">
                      <div
                        style={{ backgroundColor: '#EAB308', color: '#172016' }}
                        className="w-10 h-10 bg-gold border-2 border-charcoal flex items-center justify-center text-charcoal shadow-bauhaus-sm"
                      >
                        <Icon className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span
                        style={{ color: '#14532D' }}
                        className="font-mono font-black text-sm text-forest"
                      >
                        {item.step}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-charcoal uppercase tracking-tight mt-4">
                      {item.title}
                    </h3>
                    <p className="text-xs text-charcoal/80 mt-2 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-charcoal/20 flex items-center gap-1.5 text-[11px] font-bold text-forest">
                    <span>STAGE {item.step} COMPLETE</span>
                    <span style={{ color: '#4D7C0F' }}>■</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. LOGISTICS & DISPATCH: WARM CREAM COLOR BLOCK
          ======================================================== */}
      <section
        style={{ backgroundColor: '#F7F4EA' }}
        className="bg-cream py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-charcoal"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4 text-left">
              <span
                style={{ backgroundColor: '#14532D', color: '#FFFFFF' }}
                className="inline-block px-2.5 py-1 bg-forest text-white text-xs font-black uppercase tracking-wider border-2 border-charcoal shadow-bauhaus-sm"
              >
                DYNAMIC ROUTING
              </span>
              <h2 className="text-3xl font-black text-charcoal uppercase tracking-tight">
                {language === 'hi' ? 'मल्टी-स्टॉप क्लस्टर पिकअप' : 'Clustered Farmgate Logistics'}
              </h2>
              <p className="text-xs sm:text-sm text-charcoal/90 font-medium leading-relaxed">
                {language === 'hi'
                  ? 'व्यक्तिगत रूप से छोटी उपज लाने के बजाय, कृषि-फ़्लो का डायनामिक रूटिंग इंजन एक ही इलेक्ट्रिक रेफ़र वाहन में आसपास के 3-4 खेतों से संकलन करता है।'
                  : 'Instead of uncoordinated individual trips, KrishiFlow coordinates a single multi-stop run across adjacent smallholders with active cold-chain monitoring.'}
              </p>

              <div className="pt-2">
                <Link
                  to="/logistics"
                  className="btn-bauhaus-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase"
                >
                  <span>{t('nav.logistics')}</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </Link>
              </div>
            </div>

            {/* Abstract Bauhaus Route Diagram */}
            <div className="lg:col-span-7 bg-white p-6 border-4 border-charcoal shadow-bauhaus-lg">
              <div className="flex items-center justify-between pb-3 border-b-2 border-charcoal text-xs font-mono font-bold">
                <span>ROUTE #KF-DADRI-903</span>
                <span
                  style={{ backgroundColor: '#EAB308', color: '#172016' }}
                  className="bg-gold px-2 py-0.5 border border-charcoal"
                >
                  42 KM TOTAL (-31%)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4 text-xs font-bold">
                <div className="p-3 bg-cream border-2 border-charcoal text-center">
                  <div
                    style={{ backgroundColor: '#14532D', color: '#FFFFFF' }}
                    className="w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center mx-auto mb-1 text-[11px] font-mono border border-charcoal"
                  >
                    1
                  </div>
                  <p className="text-charcoal uppercase text-[11px]">Ramesh Kumar</p>
                  <p style={{ color: '#14532D' }} className="text-[10px] font-mono">250 kg • Dadri</p>
                </div>

                <div className="p-3 bg-cream border-2 border-charcoal text-center">
                  <div
                    style={{ backgroundColor: '#14532D', color: '#FFFFFF' }}
                    className="w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center mx-auto mb-1 text-[11px] font-mono border border-charcoal"
                  >
                    2
                  </div>
                  <p className="text-charcoal uppercase text-[11px]">Sita Devi</p>
                  <p style={{ color: '#14532D' }} className="text-[10px] font-mono">150 kg • Rural Hub</p>
                </div>

                <div className="p-3 bg-cream border-2 border-charcoal text-center">
                  <div
                    style={{ backgroundColor: '#92400E', color: '#FFFFFF' }}
                    className="w-6 h-6 bg-earth text-white flex items-center justify-center mx-auto mb-1 text-[11px] font-mono border border-charcoal"
                  >
                    3
                  </div>
                  <p className="text-charcoal uppercase text-[11px]">Green Valley FPO</p>
                  <p style={{ color: '#14532D' }} className="text-[10px] font-mono">100 kg • Gate Node</p>
                </div>

                <div
                  style={{ backgroundColor: '#EAB308', color: '#172016' }}
                  className="p-3 bg-gold border-2 border-charcoal text-center shadow-bauhaus-sm"
                >
                  <div
                    style={{ backgroundColor: '#172016', color: '#FFFFFF' }}
                    className="w-6 h-6 bg-charcoal text-white flex items-center justify-center mx-auto mb-1 text-[11px] font-mono border border-charcoal"
                  >
                    ✓
                  </div>
                  <p className="text-charcoal uppercase text-[11px]">FreshBite Hub</p>
                  <p className="text-[10px] text-charcoal font-mono">500 kg Landed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. PRICE TRANSPARENCY: WARM CREAM + FOREST GREEN
          ======================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <span
            style={{ backgroundColor: '#4D7C0F', color: '#FFFFFF' }}
            className="inline-block px-2.5 py-1 bg-crop text-white text-xs font-black uppercase tracking-wider border-2 border-charcoal shadow-bauhaus-sm mb-3"
          >
            FAIR ECONOMICS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-charcoal uppercase tracking-tight">
            {t('pricing.title')}
          </h2>
          <p className="text-sm text-charcoal/80 mt-2 font-medium">
            {language === 'hi'
              ? 'बिचौलियों की 33% मार्जिन हटाकर किसानों को उचित मूल्य और खरीदारों को बचत।'
              : 'Direct disintermediation: removing opaque arhtiya commissions to uplift farmgate realization.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Supply Chain Box */}
          <div className="p-6 bg-white border-4 border-charcoal shadow-bauhaus-lg space-y-4">
            <div className="pb-4 border-b-3 border-charcoal flex items-baseline justify-between">
              <div>
                <span style={{ color: '#92400E' }} className="text-xs font-black uppercase tracking-wider">
                  {t('pricing.traditionalTitle')}
                </span>
                <p className="text-xs font-bold text-charcoal/60 mt-0.5">Farmer → Dalali → Intermediary → Buyer</p>
              </div>
              <span style={{ color: '#92400E' }} className="text-2xl font-black font-mono">₹30/kg</span>
            </div>

            <div className="space-y-2 text-xs font-bold">
              <div className="p-3 bg-cream border-2 border-charcoal flex justify-between">
                <span>{t('pricing.farmerReceives')}</span>
                <span className="font-mono">₹15.00/kg (50%)</span>
              </div>
              <div
                style={{ backgroundColor: 'rgba(146, 64, 14, 0.15)', color: '#92400E' }}
                className="p-3 border-2 border-charcoal flex justify-between"
              >
                <span>{t('pricing.intermediaryMargins')}</span>
                <span className="font-mono">₹10.00/kg (33%)</span>
              </div>
              <div className="p-3 bg-cream border-2 border-charcoal flex justify-between">
                <span>{t('pricing.logisticsCost')}</span>
                <span className="font-mono">₹5.00/kg (17%)</span>
              </div>
            </div>

            <p className="text-[11px] font-bold text-charcoal/60 text-center pt-2">
              {language === 'hi' ? 'किसान को केवल 50% मूल्य मिलता है।' : 'Farmer captures only 50% of the procurement rupee.'}
            </p>
          </div>

          {/* KrishiFlow AI Box (Light Soft Sage Background) */}
          <div
            style={{ backgroundColor: '#DDE7D8', color: '#172016' }}
            className="p-6 bg-sage text-charcoal border-4 border-charcoal shadow-bauhaus-lg space-y-4 relative"
          >
            <div className="pb-4 border-b-3 border-charcoal flex items-baseline justify-between">
              <div>
                <span style={{ color: '#14532D' }} className="text-xs font-black uppercase tracking-wider">
                  {t('pricing.krishiflowTitle')}
                </span>
                <p style={{ color: 'rgba(23, 32, 22, 0.75)' }} className="text-xs font-bold mt-0.5">
                  Farmer → KrishiFlow AI → Buyer
                </p>
              </div>
              <span style={{ color: '#14532D' }} className="text-2xl font-black font-mono">₹27/kg</span>
            </div>

            <div className="space-y-2 text-xs font-bold text-charcoal">
              <div
                style={{ backgroundColor: '#EAB308', color: '#172016' }}
                className="p-3 bg-gold border-2 border-charcoal flex justify-between shadow-bauhaus-sm"
              >
                <span>{t('pricing.farmerReceives')} (+46.6%)</span>
                <span className="font-mono font-black">₹22.00/kg (81.5%)</span>
              </div>
              <div className="p-3 bg-white border-2 border-charcoal flex justify-between">
                <span>{t('pricing.logisticsCost')}</span>
                <span className="font-mono">₹3.00/kg (11.1%)</span>
              </div>
              <div className="p-3 bg-white border-2 border-charcoal flex justify-between">
                <span>{t('pricing.platformFee')}</span>
                <span className="font-mono">₹2.00/kg (7.4%)</span>
              </div>
            </div>

            <p style={{ color: '#14532D' }} className="text-[11px] font-black text-center pt-2 uppercase tracking-wide">
              {language === 'hi' ? 'किसान को 81.5% मूल्य सीधा मिलता है!' : 'Farmer captures 81.5% of total procurement spend!'}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. FINAL CTA: LIGHT SOFT SAGE FULL WIDTH BLOCK
          ======================================================== */}
      <section
        style={{ backgroundColor: '#DDE7D8', color: '#172016' }}
        className="bg-sage border-y-4 border-charcoal py-14 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span
              style={{ backgroundColor: '#FFFFFF', color: '#172016' }}
              className="text-xs font-mono font-black uppercase tracking-wider text-charcoal bg-white border-2 border-charcoal px-2.5 py-0.5 shadow-bauhaus-sm inline-block mb-2"
            >
              {t('landing.interactiveFlowTitle')}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-charcoal uppercase">
              {language === 'hi' 
                ? '5 मिनट का संपूर्ण हैकथॉन लाइव वॉकथ्रू' 
                : 'Experience the 5-Minute Live Procurement Journey'}
            </h3>
            <p className="text-xs sm:text-sm text-charcoal/80 font-medium mt-1 max-w-xl">
              {t('landing.interactiveFlowDesc')}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/buyer')}
              className="btn-bauhaus-primary px-5 py-3 text-xs uppercase tracking-wider"
            >
              {language === 'hi' ? 'डेमो शुरू करें (प्रिया - खरीदार)' : 'Launch Demo (Buyer View)'}
            </button>
            <button
              onClick={() => navigate('/farmer')}
              className="btn-bauhaus-white px-4 py-3 text-xs uppercase tracking-wider"
            >
              {language === 'hi' ? 'किसान पोर्टल (रमेश)' : 'Farmer Portal (Ramesh)'}
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. FOOTER: DEEP CHARCOAL
          ======================================================== */}
      <footer
        style={{ backgroundColor: '#172016', color: '#F7F4EA' }}
        className="bg-charcoal text-cream py-10 px-4 sm:px-8 text-xs"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-black uppercase text-sm tracking-wider">
            <div
              style={{ backgroundColor: '#14532D', color: '#EAB308' }}
              className="w-6 h-6 border border-gold flex items-center justify-center"
            >
              <Sprout className="w-4 h-4 text-gold" />
            </div>
            <span>{t('brand.name')}</span>
          </div>
          <p style={{ color: 'rgba(247, 244, 234, 0.7)' }} className="text-[11px] font-mono">
            {language === 'hi' 
              ? 'राष्ट्रीय स्तर का कृषि आपूर्ति श्रृंखला प्रोटोटाइप • स्मार्ट इंडिया हैकथॉन 2026'
              : 'National Agricultural Supply Chain Prototype • Smart India Hackathon 2026'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
