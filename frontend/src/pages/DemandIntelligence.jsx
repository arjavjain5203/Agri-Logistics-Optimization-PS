import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MOCK_DEMAND_FORECAST_SERIES } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export const DemandIntelligence = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState('Tomato');

  const metrics = [
    {
      title: t('aiIntelligence.predictedDemand'),
      value: '2,500 kg',
      subtext: t('aiIntelligence.demandTrend'),
      accent: 'bg-forest',
      accentStyle: { backgroundColor: '#14532D' },
      isWarning: false,
    },
    {
      title: t('aiIntelligence.currentSupply'),
      value: '2,180 kg',
      subtext: language === 'hi' ? 'नोएडा-बुलंदशहर क्लस्टर' : 'Regional smallholder output',
      accent: 'bg-crop',
      accentStyle: { backgroundColor: '#4D7C0F' },
      isWarning: false,
    },
    {
      title: t('aiIntelligence.supplyGap'),
      value: '320 kg',
      subtext: t('aiIntelligence.gapAlert'),
      accent: 'bg-earth',
      accentStyle: { backgroundColor: '#92400E' },
      isWarning: true,
    },
    {
      title: t('aiIntelligence.forecastConfidence'),
      value: '94.8%',
      subtext: language === 'hi' ? 'मल्टी-मंडी मॉडल' : 'Multi-mandi ensemble model',
      accent: 'bg-gold',
      accentStyle: { backgroundColor: '#EAB308' },
      isWarning: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b-3 border-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal uppercase tracking-tight">
            {t('aiIntelligence.title')}
          </h1>
          <p className="text-xs text-charcoal/80 font-medium mt-0.5">
            {t('aiIntelligence.subtitle')}
          </p>
        </div>

        <div>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-1.5 bg-cream border-2 border-charcoal text-xs font-bold text-charcoal shadow-bauhaus-sm focus:bg-white"
          >
            <option value="Tomato">{language === 'hi' ? 'टमाटर (Tomato)' : 'Tomato'}</option>
            <option value="Potato">{language === 'hi' ? 'आलू (Potato)' : 'Potato'}</option>
            <option value="Onion">{language === 'hi' ? 'प्याज़ (Onion)' : 'Onion'}</option>
          </select>
        </div>
      </div>

      {/* 4 Analytics Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-4 bg-white border-3 border-charcoal shadow-bauhaus space-y-1 relative"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black uppercase text-charcoal/70 tracking-wider">
                {m.title}
              </span>
              {m.isWarning ? (
                <span
                  style={{ backgroundColor: '#92400E', color: '#FFFFFF' }}
                  className="text-[10px] font-mono font-bold text-white bg-earth px-1.5 py-0.2 border border-charcoal"
                >
                  DEFICIT
                </span>
              ) : (
                <span style={m.accentStyle} className={`w-2.5 h-2.5 ${m.accent} border border-charcoal`}></span>
              )}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-charcoal font-mono tracking-tight">
              {m.value}
            </div>
            <p className="text-xs text-charcoal/70 font-medium">{m.subtext}</p>
          </div>
        ))}
      </div>

      {/* Bauhaus AI Recommendation Alert Box */}
      <div
        style={{ backgroundColor: '#DDE7D8', color: '#172016' }}
        className="p-5 bg-sage border-4 border-charcoal shadow-bauhaus-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="space-y-1.5 max-w-2xl">
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
            "{t('aiIntelligence.alertTitle')}"
          </h2>
          <p style={{ color: 'rgba(23, 32, 22, 0.85)' }} className="text-xs font-medium leading-relaxed">
            {t('aiIntelligence.alertDesc')}
          </p>
        </div>

        <button
          onClick={() => navigate('/buyer/demand')}
          className="btn-bauhaus-primary px-5 py-2.5 text-xs uppercase tracking-wider shrink-0 flex items-center gap-2"
        >
          <span>{t('aiIntelligence.triggerProcurementBtn')}</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* Bauhaus Predictive Demand Chart */}
      <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-charcoal">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-charcoal">
              {t('aiIntelligence.chartHeading')}
            </h2>
            <p className="text-xs text-charcoal/70 font-medium">
              3-week horizon forecasting based on Delhi-NCR hotel indices & mandi volumes
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <div className="flex items-center gap-1.5">
              <span style={{ backgroundColor: '#14532D' }} className="w-3 h-3 bg-forest border border-charcoal"></span>
              <span className="text-charcoal uppercase">Historical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ backgroundColor: '#EAB308' }} className="w-3 h-3 bg-gold border border-charcoal"></span>
              <span className="text-charcoal uppercase">AI Forecast</span>
            </div>
          </div>
        </div>

        {/* Clean Bauhaus Recharts with Forest Green & Harvest Gold */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={MOCK_DEMAND_FORECAST_SERIES}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14532D" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#14532D" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EAB308" stopOpacity={0.7}/>
                  <stop offset="95%" stopColor="#EAB308" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#172016" strokeDasharray="3 3" strokeOpacity={0.15} vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#172016"
                fontSize={11}
                tickLine={true}
                axisLine={{ stroke: '#172016', strokeWidth: 2 }}
                tickFormatter={(val) => language === 'hi' ? val.replace('Sep', 'सितंबर') : val}
              />
              <YAxis
                stroke="#172016"
                fontSize={11}
                tickLine={true}
                axisLine={{ stroke: '#172016', strokeWidth: 2 }}
                unit="kg"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#172016',
                  borderWidth: '2px',
                  boxShadow: '4px 4px 0px #172016',
                  color: '#172016',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                }}
              />
              <Area
                type="monotone"
                dataKey="historicalDemand"
                name="Historical Demand"
                stroke="#14532D"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorHistorical)"
              />
              <Area
                type="monotone"
                dataKey="predictedDemand"
                name="AI Predicted Demand"
                stroke="#EAB308"
                strokeWidth={3}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorForecast)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contributing Market Signals */}
      <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-charcoal">
          {language === 'hi' ? 'पूर्वानुमान कारक एवं बाज़ार चालक' : 'Contributing Market Drivers'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-cream border-2 border-charcoal space-y-1">
            <span className="font-bold text-charcoal block uppercase">
              {language === 'hi' ? 'आगामी मांग उछाल' : 'Hospitality Demand Spike'}
            </span>
            <p className="text-charcoal/70 font-medium">
              Festival weddings & institutional catering schedules in NCR cluster.
            </p>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal space-y-1">
            <span className="font-bold text-charcoal block uppercase">
              {language === 'hi' ? 'स्थानीय आवक में गिरावट' : 'Dadri Harvest Curve'}
            </span>
            <p className="text-charcoal/70 font-medium">
              Early harvest batch tapering off prior to second sowing cycle.
            </p>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal space-y-1">
            <span className="font-bold text-charcoal block uppercase">
              {language === 'hi' ? 'थोक मंडी दर विचलन' : 'Wholesale Mandi Volatility'}
            </span>
            <p className="text-charcoal/70 font-medium">
              Azadpur Mandi spot rate trending up +14% due to fuel surcharge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandIntelligence;
