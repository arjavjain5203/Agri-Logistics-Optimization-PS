import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Plus,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

export const FarmerDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const metrics = [
    {
      title: t('farmerDashboard.availableProduce'),
      value: '250 kg',
      subtext: language === 'hi' ? 'टमाटर (ग्रेड A) • दादरी' : 'Tomato (Grade A) • Dadri Gate 1',
      accent: 'bg-crop',
      accentStyle: { backgroundColor: '#4D7C0F' },
      shape: 'square',
    },
    {
      title: t('farmerDashboard.activeOrders'),
      value: '1',
      subtext: language === 'hi' ? 'पिकअप आज सुबह 09:25' : 'Reefer pickup today 09:25 AM',
      accent: 'bg-gold',
      accentStyle: { backgroundColor: '#EAB308' },
      shape: 'triangle',
    },
    {
      title: t('farmerDashboard.expectedEarnings'),
      value: '₹5,500',
      subtext: language === 'hi' ? '₹22/किग्रा • 0% कमीशन' : '₹22/kg rate • 0% Middleman cut',
      accent: 'bg-forest',
      accentStyle: { backgroundColor: '#14532D' },
      shape: 'circle',
    },
    {
      title: t('farmerDashboard.nearbyDemand'),
      value: '500 kg',
      subtext: language === 'hi' ? 'फ्रेशबाइट रेस्टोरेंट, नोएडा' : 'FreshBite Hub, Noida',
      accent: 'bg-earth',
      accentStyle: { backgroundColor: '#92400E' },
      shape: 'square',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome Header */}
      <div className="pb-4 border-b-3 border-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-charcoal/70 mb-1 uppercase tracking-wider">
            <span>{language === 'hi' ? 'रमेश कुमार' : 'Ramesh Kumar'}</span>
            <span>■</span>
            <span>{language === 'hi' ? 'दादरी कृषि क्लस्टर' : 'Dadri Smallholder Cluster'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal uppercase tracking-tight">
            {t('farmerDashboard.greeting')}
          </h1>
          <p className="text-xs text-charcoal/80 font-medium mt-0.5">
            {t('farmerDashboard.subGreeting')}
          </p>
        </div>

        <button
          onClick={() => navigate('/farmer/produce')}
          className="btn-bauhaus-primary px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('farmerDashboard.listProduceBtn')}</span>
        </button>
      </div>

      {/* 4 Metrics with Section 9 Agricultural Palette */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-5 bg-white border-3 border-charcoal shadow-bauhaus flex flex-col justify-between space-y-2 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-charcoal/70 tracking-wider">
                {m.title}
              </span>
              <span
                style={m.accentStyle}
                className={`w-3 h-3 ${m.accent} border border-charcoal ${m.shape === 'circle' ? 'rounded-full' : ''}`}
              ></span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-charcoal font-mono tracking-tight">
                {m.value}
              </div>
              <p className="text-xs font-medium text-charcoal/70 mt-0.5 leading-tight">{m.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bauhaus Demand Recommendation Box */}
      <div
        style={{ backgroundColor: '#DDE7D8', color: '#172016' }}
        className="p-5 bg-sage border-4 border-charcoal shadow-bauhaus-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span
              style={{ backgroundColor: '#EAB308', color: '#172016' }}
              className="px-2 py-0.5 bg-gold text-charcoal text-[10px] font-mono font-black uppercase border border-charcoal shadow-bauhaus-sm"
            >
              {t('farmerDashboard.aiInsightTitle')}
            </span>
            <span style={{ color: '#14532D' }} className="font-mono text-xs font-black">REGIONAL MANDI FORECAST</span>
          </div>
          <p style={{ color: '#172016' }} className="text-sm sm:text-base font-black uppercase leading-snug">
            "{t('farmerDashboard.aiInsightHeadline')}"
          </p>
          <p style={{ color: 'rgba(23, 32, 22, 0.85)' }} className="text-xs font-medium">
            {t('farmerDashboard.aiInsightRecommendation')}
          </p>
        </div>

        <button
          onClick={() => navigate('/farmer/produce')}
          className="btn-bauhaus-primary px-5 py-2.5 text-xs uppercase tracking-wider shrink-0 flex items-center gap-1.5"
        >
          <span>{language === 'hi' ? '100 किग्रा और जोड़ें' : 'List 100 kg Extra'}</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* Active Listings & Escrow Settlement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listings (Left 2 Columns) */}
        <div className="lg:col-span-2 p-5 bg-white border-3 border-charcoal shadow-bauhaus space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-charcoal">
            <h2 className="text-xs font-black uppercase tracking-wider text-charcoal">
              {t('farmerDashboard.currentListings')}
            </h2>
            <Link
              to="/farmer/produce"
              style={{ color: '#14532D' }}
              className="text-xs font-bold uppercase text-forest hover:text-charcoal flex items-center gap-1"
            >
              <span>{t('common.viewAll')}</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-cream border-2 border-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-black text-charcoal text-sm uppercase">
                  {language === 'hi' ? 'टमाटर (हाइब्रिड लाल)' : 'Tomato (Hybrid Red)'}
                </span>
                <p className="text-charcoal/70 font-medium mt-0.5">
                  {language === 'hi' ? 'ग्रेड A • 250 किग्रा • कटाई: 2 सितम्बर' : 'Grade A • 250 kg • Harvest: Sep 02'}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center font-mono">
                <span style={{ color: '#14532D' }} className="font-black text-forest text-sm">₹22/kg</span>
                <span
                  style={{ backgroundColor: '#EAB308', color: '#172016' }}
                  className="px-2 py-0.5 text-[10px] font-black uppercase bg-gold text-charcoal border border-charcoal shadow-bauhaus-sm"
                >
                  {language === 'hi' ? 'ऑर्डर पुष्ट' : 'CONFIRMED'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-cream border-2 border-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-black text-charcoal text-sm uppercase">
                  {language === 'hi' ? 'आलू (पुखराज)' : 'Potato (Pukhraj)'}
                </span>
                <p className="text-charcoal/70 font-medium mt-0.5">
                  {language === 'hi' ? 'ग्रेड A • 400 किग्रा • कटाई: 5 सितम्बर' : 'Grade A • 400 kg • Harvest: Sep 05'}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center font-mono">
                <span className="font-black text-charcoal text-sm">₹18/kg</span>
                <span
                  style={{ backgroundColor: '#FFFFFF', color: '#172016' }}
                  className="px-2 py-0.5 text-[10px] font-black uppercase bg-white text-charcoal border border-charcoal shadow-bauhaus-sm"
                >
                  {language === 'hi' ? 'सक्रिय सूची' : 'LISTED'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Settlement & Escrow column (Right 1 Column) */}
        <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-charcoal pb-2 border-b-2 border-charcoal">
              {language === 'hi' ? 'एस्क्रो स्थिति' : 'UPI Escrow Settlement'}
            </h2>

            <div className="p-3.5 bg-sage border-2 border-charcoal space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-charcoal/70 uppercase">{language === 'hi' ? 'आज का भुगतान मूल्य:' : 'Today Payout:'}</span>
                <span className="font-black text-charcoal text-sm">₹5,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/70 uppercase">{language === 'hi' ? 'आढ़तिया कटौती:' : 'Mandi Commission:'}</span>
                <span style={{ color: '#14532D' }} className="font-black text-forest">₹0 (0%)</span>
              </div>
              <div className="pt-2 border-t border-charcoal/20 text-[11px] font-sans font-medium text-charcoal leading-relaxed">
                {t('farmerDashboard.earningsBreakdown')}
              </div>
            </div>
          </div>

          <Link
            to="/farmer/orders"
            className="btn-bauhaus-white w-full py-2.5 text-center text-xs uppercase tracking-wider block"
          >
            {t('farmerDashboard.viewOrdersBtn')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
