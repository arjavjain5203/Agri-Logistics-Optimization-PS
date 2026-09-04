import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
  Plus,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { MOCK_ORDERS } from '../data/mockData';

export const BuyerDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const metrics = [
    {
      title: t('buyerDashboard.activeProcurement'),
      value: '500 kg',
      subtext: language === 'hi' ? 'टमाटर (ग्रेड A)' : 'Tomato (Grade A)',
      change: '+18%',
      shape: 'circle',
      accent: 'bg-forest',
      accentStyle: { backgroundColor: '#14532D' },
    },
    {
      title: t('buyerDashboard.pendingOrders'),
      value: '3',
      subtext: language === 'hi' ? '2 आज पहुंच रहे हैं' : '2 arriving today',
      change: 'ACTIVE',
      shape: 'square',
      accent: 'bg-gold',
      accentStyle: { backgroundColor: '#EAB308' },
    },
    {
      title: t('buyerDashboard.totalSpend'),
      value: '₹1,42,800',
      subtext: language === 'hi' ? '₹42,000 की कुल बचत' : '₹42,000 saved vs mandi',
      change: '-10%',
      shape: 'triangle',
      accent: 'bg-crop',
      accentStyle: { backgroundColor: '#4D7C0F' },
    },
    {
      title: t('buyerDashboard.suppliers'),
      value: '18',
      subtext: language === 'hi' ? 'सत्यापित किसान एवं 2 FPO' : 'Verified Farmers & 2 FPOs',
      change: '+4',
      shape: 'square',
      accent: 'bg-earth',
      accentStyle: { backgroundColor: '#92400E' },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header: Bauhaus Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-3 border-charcoal">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-charcoal/70 mb-1 uppercase tracking-wider">
            <span>FreshBite Restaurants</span>
            <span>■</span>
            <span>Sector 62 Hub, Noida</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal uppercase tracking-tight">
            {t('buyerDashboard.greeting')}
          </h1>
          <p className="text-xs text-charcoal/80 font-medium mt-0.5">
            {t('buyerDashboard.subGreeting')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/buyer/demand')}
            className="btn-bauhaus-primary px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('buyerDashboard.createNewDemand')}</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Operational Metric Blocks */}
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
                style={{ backgroundColor: '#EAB308', color: '#172016' }}
                className="text-[10px] font-mono font-bold text-charcoal bg-gold border border-charcoal px-1.5 py-0.2 shadow-bauhaus-sm"
              >
                {m.change}
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-charcoal font-mono tracking-tight">
                {m.value}
              </div>
              <p className="text-xs font-medium text-charcoal/70 mt-0.5">{m.subtext}</p>
            </div>
            <div
              style={m.accentStyle}
              className={`w-3 h-3 ${m.accent} border border-charcoal self-end mt-1 ${m.shape === 'circle' ? 'rounded-full' : ''}`}
            />
          </div>
        ))}
      </div>

      {/* Bauhaus AI Demand Signal Banner */}
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
              AI DEMAND SIGNAL
            </span>
            <span style={{ color: '#14532D' }} className="font-mono text-xs font-black">TOMATO • 2,500 KG • +19%</span>
          </div>
          <h2 style={{ color: '#172016' }} className="text-base sm:text-lg font-black uppercase tracking-tight">
            {t('buyerDashboard.forecastTitle')}
          </h2>
          <p style={{ color: 'rgba(23, 32, 22, 0.85)' }} className="text-xs font-medium leading-relaxed">
            {t('buyerDashboard.forecastBody')}
          </p>
        </div>

        <button
          onClick={() => navigate('/ai')}
          className="btn-bauhaus-primary px-4 py-2 text-xs uppercase tracking-wider shrink-0 flex items-center gap-1.5"
        >
          <span>{t('buyerDashboard.viewAiDetails')}</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* Procurement Pipeline & Quick Tracking */}
      <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-charcoal">
          <div className="flex items-center gap-2">
            <span style={{ backgroundColor: '#4D7C0F' }} className="w-3 h-3 bg-crop border border-charcoal"></span>
            <h2 className="text-xs font-black uppercase tracking-wider text-charcoal">
              {t('buyerDashboard.pipelineTitle')}
            </h2>
          </div>
          <span style={{ color: '#14532D' }} className="text-xs font-mono font-bold text-forest">BATCH #KF-2026-0903</span>
        </div>

        {/* 4 Pipeline Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-cream border-2 border-charcoal">
            <span className="font-mono text-[10px] text-charcoal/60 block uppercase">Step 01</span>
            <span className="text-xs font-black uppercase text-charcoal block mt-0.5">
              {t('buyerDashboard.step1')}
            </span>
            <span style={{ color: '#14532D' }} className="text-[11px] font-bold mt-0.5 block">500 kg Tomato</span>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal">
            <span className="font-mono text-[10px] text-charcoal/60 block uppercase">Step 02</span>
            <span className="text-xs font-black uppercase text-charcoal block mt-0.5">
              {t('buyerDashboard.step2')}
            </span>
            <span style={{ color: '#14532D' }} className="text-[11px] font-bold mt-0.5 block">3 Farmers Matched</span>
          </div>

          <div
            style={{ backgroundColor: '#EAB308' }}
            className="p-3 bg-gold border-2 border-charcoal shadow-bauhaus-sm"
          >
            <span className="font-mono text-[10px] text-charcoal block uppercase font-bold">Step 03 (Current)</span>
            <span className="text-xs font-black uppercase text-charcoal block mt-0.5">
              {t('buyerDashboard.step3')}
            </span>
            <span className="text-[11px] font-bold text-charcoal mt-0.5 block">ETA 11:30 AM (Dadri)</span>
          </div>

          <div className="p-3 bg-white border-2 border-charcoal/40 opacity-70">
            <span className="font-mono text-[10px] text-charcoal/40 block uppercase">Step 04</span>
            <span className="text-xs font-black uppercase text-charcoal/60 block mt-0.5">
              {t('buyerDashboard.step4')}
            </span>
            <span className="text-[11px] text-charcoal/50 mt-0.5 block">UPI Escrow Release</span>
          </div>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-charcoal">
          <h2 className="text-xs font-black uppercase tracking-wider text-charcoal">
            {t('buyerDashboard.recentProcurements')}
          </h2>
          <Link
            to="/orders"
            style={{ color: '#14532D' }}
            className="text-xs font-bold uppercase text-forest hover:text-charcoal flex items-center gap-1"
          >
            <span>{t('common.viewAll')}</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream border-b-2 border-charcoal text-charcoal font-black uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">{t('orders.orderId')}</th>
                <th className="py-2.5 px-3">{t('common.crop')}</th>
                <th className="py-2.5 px-3">{t('common.quantity')}</th>
                <th className="py-2.5 px-3">{t('common.grade')}</th>
                <th className="py-2.5 px-3">{t('common.price')}</th>
                <th className="py-2.5 px-3">{t('common.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-charcoal/10 font-mono">
              {MOCK_ORDERS.map((ord) => (
                <tr key={ord.id} className="hover:bg-cream/50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-charcoal">{ord.id}</td>
                  <td className="py-2.5 px-3 font-sans font-bold text-charcoal">
                    {language === 'hi' ? ord.cropHi : ord.crop}
                  </td>
                  <td className="py-2.5 px-3 text-charcoal">{ord.quantity}</td>
                  <td className="py-2.5 px-3 font-sans text-charcoal">{ord.grade}</td>
                  <td style={{ color: '#14532D' }} className="py-2.5 px-3 font-bold text-forest">{ord.totalAmount}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span
                      style={{
                        backgroundColor: ord.status === 'inTransit' ? '#EAB308' : '#4D7C0F',
                        color: ord.status === 'inTransit' ? '#172016' : '#FFFFFF',
                      }}
                      className={`px-2 py-0.5 text-[10px] font-black uppercase border border-charcoal shadow-bauhaus-sm ${
                        ord.status === 'inTransit'
                          ? 'bg-gold text-charcoal'
                          : 'bg-crop text-white'
                      }`}
                    >
                      {ord.status === 'inTransit' ? t('common.inTransit') : t('common.delivered')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
