import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const PriceTransparency = () => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b-3 border-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal uppercase tracking-tight">
            {t('pricing.title')}
          </h1>
          <p className="text-xs text-charcoal/80 font-medium mt-0.5">
            {t('pricing.subtitle')}
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-charcoal bg-gold border border-charcoal px-2.5 py-1 shadow-bauhaus-sm self-start sm:self-auto">
          {t('pricing.prototypeDisclaimer')}
        </span>
      </div>

      {/* Top 2 Core Economic Metrics: Large Typography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-charcoal/70 tracking-wider">
              {language === 'hi' ? 'किसान का सीधा लाभ' : 'Farmer Net Realization'}
            </span>
            <span className="w-3 h-3 rounded-full bg-forest border border-charcoal"></span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-forest font-mono tracking-tight">
            +46.6%
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-base font-mono font-black text-charcoal/60 line-through">₹15/kg</span>
            <span className="text-xs font-mono font-bold text-charcoal">→</span>
            <span className="text-lg font-mono font-black text-forest bg-gold px-1.5 border border-charcoal">₹22/kg</span>
          </div>
          <p className="text-xs text-charcoal/70 font-medium mt-1">
            {language === 'hi'
              ? 'किसान को ₹15/किग्रा के स्थान पर ₹22/किग्रा सीधा फार्मगेट भुगतान।'
              : 'Direct farmgate payout replacing opaque commission cuts.'}
          </p>
        </div>

        <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-charcoal/70 tracking-wider">
              {language === 'hi' ? 'खरीदार की खरीद बचत' : 'Buyer Landed Savings'}
            </span>
            <span className="w-3 h-3 bg-gold border border-charcoal"></span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-charcoal font-mono tracking-tight">
            -10.0%
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-base font-mono font-black text-charcoal/60 line-through">₹30/kg</span>
            <span className="text-xs font-mono font-bold text-charcoal">→</span>
            <span className="text-lg font-mono font-black text-charcoal bg-sage px-1.5 border border-charcoal">₹27/kg</span>
          </div>
          <p className="text-xs text-charcoal/70 font-medium mt-1">
            {language === 'hi'
              ? 'खरीदार को ₹30/किग्रा थोक मंडी दर के बजाय ₹27/किग्रा में उच्च कोटि उपज।'
              : 'Direct procurement lands Grade A produce 10% below mandi wholesale rate.'}
          </p>
        </div>
      </div>

      {/* Side-by-Side Model Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TRADITIONAL SUPPLY CHAIN (Muted Earth Tones) */}
        <div className="p-6 bg-white border-4 border-charcoal shadow-bauhaus-lg space-y-4">
          <div className="pb-3 border-b-2 border-charcoal flex items-baseline justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-earth">
                {t('pricing.traditionalTitle')}
              </span>
              <p className="text-xs font-bold text-charcoal/60 mt-0.5">
                Farmer → Intermediary → Logistics → Buyer
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-charcoal/60 uppercase block">{t('pricing.buyerPays')}</span>
              <span className="text-2xl font-black text-earth font-mono">₹30<span className="text-xs font-normal text-charcoal/60">/kg</span></span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-bold">
            <div className="p-3 bg-cream border-2 border-charcoal flex items-center justify-between">
              <span className="text-charcoal">{t('pricing.farmerReceives')}</span>
              <span className="font-mono text-charcoal">₹15.00/kg (50%)</span>
            </div>

            <div className="p-3 bg-earth/15 border-2 border-charcoal flex items-center justify-between text-earth">
              <div>
                <span className="block">{t('pricing.intermediaryMargins')}</span>
                <span className="text-[10px] text-earth/80">Commission arhtiyas & dalali</span>
              </div>
              <span className="font-mono">₹10.00/kg (33%)</span>
            </div>

            <div className="p-3 bg-cream border-2 border-charcoal flex items-center justify-between">
              <div>
                <span className="text-charcoal block">{t('pricing.logisticsCost')}</span>
                <span className="text-[10px] text-charcoal/60">Uncoordinated individual haul</span>
              </div>
              <span className="font-mono text-charcoal">₹5.00/kg (17%)</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] font-bold text-charcoal/60 text-center uppercase tracking-wide">
            {language === 'hi' ? 'किसान को उपभोक्ता रुपये का केवल 50% मिलता है।' : 'Farmer captures only 50% of terminal procurement spend.'}
          </div>
        </div>

        {/* KRISHIFLOW AI (Light Soft Sage Background) */}
        <div
          style={{ backgroundColor: '#DDE7D8', color: '#172016' }}
          className="p-6 bg-sage text-charcoal border-4 border-charcoal shadow-bauhaus-lg space-y-4"
        >
          <div className="pb-3 border-b-2 border-charcoal flex items-baseline justify-between">
            <div>
              <span style={{ color: '#14532D' }} className="text-xs font-black uppercase tracking-wider">
                {t('pricing.krishiflowTitle')}
              </span>
              <p style={{ color: 'rgba(23, 32, 22, 0.75)' }} className="text-xs font-bold mt-0.5">
                Farmer → KrishiFlow AI → Buyer
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-charcoal/70 uppercase block">{t('pricing.buyerPays')}</span>
              <span style={{ color: '#14532D' }} className="text-2xl font-black font-mono">₹27<span className="text-xs font-normal text-charcoal/70">/kg</span></span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-bold text-charcoal">
            <div
              style={{ backgroundColor: '#EAB308', color: '#172016' }}
              className="p-3 bg-gold border-2 border-charcoal shadow-bauhaus-sm flex items-center justify-between"
            >
              <div>
                <span className="block">{t('pricing.farmerReceives')}</span>
                <span className="text-[10px] text-charcoal/80">+46% direct farmgate payout</span>
              </div>
              <span className="font-mono font-black text-sm">₹22.00/kg (81.5%)</span>
            </div>

            <div className="p-3 bg-white border-2 border-charcoal flex items-center justify-between">
              <div>
                <span className="block">{t('pricing.logisticsCost')}</span>
                <span className="text-[10px] text-charcoal/60">Clustered multi-pickup routing</span>
              </div>
              <span className="font-mono">₹3.00/kg (11.1%)</span>
            </div>

            <div className="p-3 bg-white border-2 border-charcoal flex items-center justify-between">
              <div>
                <span className="block">{t('pricing.platformFee')}</span>
                <span className="text-[10px] text-charcoal/60">Testing, matching & escrow</span>
              </div>
              <span className="font-mono">₹2.00/kg (7.4%)</span>
            </div>
          </div>

          <div style={{ color: '#14532D' }} className="pt-2 text-[11px] font-black text-center uppercase tracking-wide">
            {language === 'hi' ? 'किसान को 81.5% मूल्य सीधा मिलता है।' : 'Farmer captures 81.5% of total procurement spend.'}
          </div>
        </div>
      </div>

      {/* Fair Trade Guarantees */}
      <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-charcoal">
          {t('pricing.transparencyFeaturesTitle')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-cream border-2 border-charcoal space-y-1">
            <span className="font-black uppercase text-charcoal block">
              {language === 'hi' ? 'UPI एस्क्रो सुरक्षित' : 'Escrow Settlement'}
            </span>
            <p className="text-charcoal/80 font-medium leading-relaxed">{t('pricing.feature1')}</p>
          </div>

          <div className="p-3.5 bg-cream border-2 border-charcoal space-y-1">
            <span className="font-black uppercase text-charcoal block">
              {language === 'hi' ? 'शून्य गुप्त कमीशन' : 'Zero Hidden Cuts'}
            </span>
            <p className="text-charcoal/80 font-medium leading-relaxed">{t('pricing.feature2')}</p>
          </div>

          <div className="p-3.5 bg-cream border-2 border-charcoal space-y-1">
            <span className="font-black uppercase text-charcoal block">
              {language === 'hi' ? 'कैलिब्रेटेड ग्रेडिंग' : 'Grade A Calibration'}
            </span>
            <p className="text-charcoal/80 font-medium leading-relaxed">{t('pricing.feature3')}</p>
          </div>
        </div>

        <div className="pt-3 border-t-2 border-charcoal flex items-center justify-between">
          <span className="text-[11px] font-mono text-charcoal/60">
            {t('common.prototypeLabel')}
          </span>
          <Link
            to="/impact"
            className="btn-bauhaus-primary px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>{t('nav.impact')}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PriceTransparency;
