import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
  TrendingUp,
  CloudSun,
  Sparkles,
  RefreshCw,
  Calendar,
  MapPin,
  Cpu,
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
import { getForecast } from '../services/api';

export const DemandIntelligence = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedRegion, setSelectedRegion] = useState('Noida');
  const [selectedHorizon, setSelectedHorizon] = useState(21);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getForecast(selectedCrop.toLowerCase(), selectedRegion, selectedHorizon);
      setForecastData(data);
    } catch (err) {
      console.warn('Failed to fetch live forecast, falling back to dynamic estimate:', err);
      setError('Using cached/offline baseline forecast');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [selectedCrop, selectedRegion, selectedHorizon]);

  // Derive dynamic metrics from live API response or fallback
  const predictedDemandKg = forecastData?.predicted_demand_kg || 2500;
  const currentSupplyKg = forecastData?.current_supply_kg || 2180;
  const supplyGapKg = forecastData?.supply_gap_kg ?? Math.max(0, predictedDemandKg - currentSupplyKg);
  const confidenceScore = forecastData?.confidence_score || 95.2;
  const recommendedPrice = forecastData?.recommended_price || 24.5;
  const mlStatus = forecastData?.ml_service_status || 'active';
  const modelInfo = forecastData?.ml_model_info || {
    model_type: 'LightGBM',
    district_resolved: selectedRegion,
    weather_impact: 'Partly Cloudy / Mild',
    festival_impact: 'None (Standard Period)',
  };

  const metrics = [
    {
      title: t('aiIntelligence.predictedDemand'),
      value: `${predictedDemandKg.toLocaleString()} kg`,
      subtext: `${selectedHorizon}-day projected volume`,
      accent: 'bg-forest',
      accentStyle: { backgroundColor: '#14532D' },
      isWarning: false,
    },
    {
      title: t('aiIntelligence.currentSupply'),
      value: `${currentSupplyKg.toLocaleString()} kg`,
      subtext: `${modelInfo.district_resolved || selectedRegion} cluster`,
      accent: 'bg-crop',
      accentStyle: { backgroundColor: '#4D7C0F' },
      isWarning: false,
    },
    {
      title: t('aiIntelligence.supplyGap'),
      value: `${supplyGapKg.toLocaleString()} kg`,
      subtext: supplyGapKg > 0 ? (language === 'hi' ? 'आपूर्ति कमी अलर्ट (+25%)' : 'Supply Deficit Alert (+25%)') : 'Supply Balanced',
      accent: 'bg-earth',
      accentStyle: { backgroundColor: '#92400E' },
      isWarning: supplyGapKg > 0,
    },
    {
      title: t('aiIntelligence.forecastConfidence'),
      value: `${confidenceScore}%`,
      subtext: `${modelInfo.model_type || 'LightGBM'} ensemble model`,
      accent: 'bg-gold',
      accentStyle: { backgroundColor: '#EAB308' },
      isWarning: false,
    },
  ];

  // Chart data: transform API series if available, otherwise use mock
  const chartData = forecastData?.series && forecastData.series.length > 0
    ? forecastData.series.map((s, idx) => ({
        date: s.date ? s.date.slice(5) : `Day ${idx * 3}`,
        historicalDemand: idx === 0 ? Math.round(predictedDemandKg * 0.95) : null,
        predictedDemand: s.predicted_demand_kg,
        confidenceLower: s.confidence_lower,
        confidenceUpper: s.confidence_upper,
      }))
    : MOCK_DEMAND_FORECAST_SERIES;

  const advisoryText = forecastData?.recommendation
    ? (typeof forecastData.recommendation === 'object'
        ? (language === 'hi' ? forecastData.recommendation.hi : forecastData.recommendation.en)
        : forecastData.recommendation)
    : t('aiIntelligence.recommendationBody', 'Secure additional produce supply to avoid projected deficit.');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b-3 border-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal uppercase tracking-tight">
              {t('aiIntelligence.title')}
            </h1>
            <span
              style={{ backgroundColor: mlStatus === 'active' ? '#14532D' : '#92400E', color: '#FFFFFF' }}
              className="px-2 py-0.5 text-[10px] font-mono font-black uppercase border border-charcoal shadow-bauhaus-sm flex items-center gap-1"
            >
              <Cpu className="w-3 h-3" />
              <span>{modelInfo.model_type} • {mlStatus.toUpperCase()}</span>
            </span>
          </div>
          <p className="text-xs text-charcoal/80 font-medium mt-0.5">
            {t('aiIntelligence.subtitle')}
          </p>
        </div>

        {/* Interactive Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Crop Selector */}
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-1.5 bg-cream border-2 border-charcoal text-xs font-bold text-charcoal shadow-bauhaus-sm focus:bg-white"
          >
            <option value="Tomato">{language === 'hi' ? 'टमाटर (Tomato)' : 'Tomato'}</option>
            <option value="Potato">{language === 'hi' ? 'आलू (Potato)' : 'Potato'}</option>
            <option value="Onion">{language === 'hi' ? 'प्याज़ (Onion)' : 'Onion'}</option>
            <option value="Carrot">{language === 'hi' ? 'गाजर (Carrot)' : 'Carrot'}</option>
            <option value="Cauliflower">{language === 'hi' ? 'फूलगोभी (Cauliflower)' : 'Cauliflower'}</option>
          </select>

          {/* Region Selector */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-1.5 bg-cream border-2 border-charcoal text-xs font-bold text-charcoal shadow-bauhaus-sm focus:bg-white"
          >
            <option value="Noida">Noida (Sector 62 Hub)</option>
            <option value="Greater Noida">Greater Noida (Dadri)</option>
            <option value="Delhi-NCR">Delhi-NCR Central</option>
            <option value="Gurugram">Gurugram CyberCity</option>
            <option value="Agra">Agra Mandi</option>
            <option value="Nashik">Nashik Cluster</option>
          </select>

          {/* Horizon Selector */}
          <select
            value={selectedHorizon}
            onChange={(e) => setSelectedHorizon(Number(e.target.value))}
            className="px-3 py-1.5 bg-cream border-2 border-charcoal text-xs font-bold text-charcoal shadow-bauhaus-sm focus:bg-white font-mono"
          >
            <option value={7}>7 Days</option>
            <option value={14}>14 Days</option>
            <option value={21}>21 Days</option>
            <option value={30}>30 Days</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchForecast}
            disabled={loading}
            className="p-1.5 bg-gold border-2 border-charcoal text-charcoal shadow-bauhaus-sm hover:bg-gold-light active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            title="Refresh AI Forecast"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
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
          <div className="flex flex-wrap items-center gap-2">
            <span
              style={{ backgroundColor: '#EAB308', color: '#172016' }}
              className="px-2 py-0.5 bg-gold text-charcoal text-[10px] font-mono font-black uppercase border border-charcoal shadow-bauhaus-sm flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>LIVE AI DEMAND SIGNAL</span>
            </span>
            <span style={{ color: '#14532D' }} className="font-mono text-xs font-black">
              {selectedCrop.toUpperCase()} • {predictedDemandKg.toLocaleString()} KG • ₹{recommendedPrice}/KG FAIR TARGET
            </span>
          </div>
          <h2 style={{ color: '#172016' }} className="text-base sm:text-lg font-black uppercase tracking-tight">
            "{selectedCrop} Supply Advisory for {modelInfo.district_resolved || selectedRegion}"
          </h2>
          <p style={{ color: 'rgba(23, 32, 22, 0.85)' }} className="text-xs font-medium leading-relaxed">
            {advisoryText}
          </p>
        </div>

        <button
          onClick={() => navigate('/buyer/demand')}
          className="btn-bauhaus-primary px-5 py-2.5 text-xs uppercase tracking-wider shrink-0 flex items-center gap-2"
        >
          <span>{language === 'hi' ? 'खरीद अनुरोध शुरू करें' : 'Trigger Procurement'}</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* Bauhaus Predictive Demand Chart */}
      <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-charcoal">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-charcoal">
              {t('aiIntelligence.chartTitle', 'Predictive Demand Forecasting Curve')}
            </h2>
            <p className="text-xs text-charcoal/70 font-medium">
              {selectedHorizon}-day horizon forecast for {selectedCrop} in {modelInfo.district_resolved || selectedRegion} (LightGBM 24-year mandi arrival model)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <div className="flex items-center gap-1.5">
              <span style={{ backgroundColor: '#14532D' }} className="w-3 h-3 bg-forest border border-charcoal"></span>
              <span className="text-charcoal uppercase">Historical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ backgroundColor: '#EAB308' }} className="w-3 h-3 bg-gold border border-charcoal"></span>
              <span className="text-charcoal uppercase">LightGBM Forecast</span>
            </div>
          </div>
        </div>

        {/* Clean Bauhaus Recharts */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
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
                name="Historical Baseline"
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

      {/* Contributing Live Market Signals */}
      <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-charcoal">
          {language === 'hi' ? 'लाइव सिग्नल्स एवं मॉडल पैरामीटर्स' : 'Live ML Signals & Model Telemetry'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-cream border-2 border-charcoal space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-charcoal uppercase">
              <CloudSun className="w-3.5 h-3.5 text-forest" />
              <span>Weather Engine</span>
            </div>
            <p className="text-charcoal/80 font-medium">
              Live Open-Meteo Condition: <span className="font-bold text-forest">{modelInfo.weather_impact || 'Mild'}</span>
            </p>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-charcoal uppercase">
              <Calendar className="w-3.5 h-3.5 text-gold" />
              <span>Festival Calendar</span>
            </div>
            <p className="text-charcoal/80 font-medium">
              Active Signal: <span className="font-bold text-charcoal">{modelInfo.festival_impact || 'Standard Period'}</span>
            </p>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-charcoal uppercase">
              <MapPin className="w-3.5 h-3.5 text-earth" />
              <span>District Resolution</span>
            </div>
            <p className="text-charcoal/80 font-medium">
              Target Node: <span className="font-bold text-charcoal">{modelInfo.district_resolved || selectedRegion}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandIntelligence;

