import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const ImpactDashboard = () => {
  const { t, language } = useLanguage();

  const coreImpacts = [
    {
      title: t('impact.farmerPriceImprovement'),
      value: '+46.6%',
      shape: 'circle',
      subtext: language === 'hi'
        ? 'पारंपरिक कमीशन आढ़तिया मॉडल की तुलना में शुद्ध फार्म-गेट आय'
        : 'Compared with illustrative traditional commission intermediary net realization.',
    },
    {
      title: t('impact.buyerCostReduction'),
      value: '-10.0%',
      shape: 'square',
      subtext: language === 'hi'
        ? 'पारंपरिक थोक मंडी स्पॉट खरीद दरों की तुलना में बचत'
        : 'Compared with terminal wholesale mandi spot procurement expenditure.',
    },
    {
      title: t('impact.logisticsDistance'),
      value: '-31.2%',
      shape: 'triangle',
      subtext: language === 'hi'
        ? 'अलग-अलग फार्म यात्राओं के बजाय मल्टी-स्टॉप समूहन'
        : 'Clustered multi-pickup routing vs individual uncoordinated transit.',
    },
    {
      title: t('impact.supplyFulfillment'),
      value: '94.2%',
      shape: 'diamond',
      subtext: language === 'hi'
        ? 'अनुसूचित कोल्ड-चेन यात्राओं में समय पर डिलीवरी दर'
        : 'On-time delivery index across contracted procurement schedules.',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b-3 border-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal uppercase tracking-tight">
            {t('impact.title')}
          </h1>
          <p className="text-xs text-charcoal/80 font-medium mt-0.5">
            {t('impact.subtitle')}
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-charcoal bg-white border-2 border-charcoal px-2.5 py-1 shadow-bauhaus-sm self-start sm:self-auto">
          {t('common.prototypeLabel')}
        </span>
      </div>

      {/* SECTION 14: LIGHT SOFT SAGE MAIN COLOR BLOCK WITH GEOMETRIC SHAPES */}
      <div
        style={{ backgroundColor: '#DDE7D8', color: '#172016' }}
        className="bg-sage border-4 border-charcoal shadow-bauhaus-lg p-6 sm:p-8"
      >
        <div className="max-w-xl mb-6">
          <span
            style={{ backgroundColor: '#FFFFFF', color: '#172016' }}
            className="text-[10px] font-mono font-black uppercase tracking-wider text-charcoal bg-white border border-charcoal px-2.5 py-0.5 shadow-bauhaus-sm inline-block mb-2"
          >
            AUDITED INSTITUTIONAL IMPACT
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-charcoal tracking-tight">
            Corridor Economic Performance
          </h2>
          <p className="text-xs font-medium text-charcoal/80 mt-1">
            Audited supply-chain indicators across Dadri, Jewar, and Bulandshahr agro-clusters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coreImpacts.map((m, idx) => (
            <div
              key={idx}
              className="p-5 bg-white border-3 border-charcoal shadow-bauhaus relative overflow-hidden flex flex-col justify-between space-y-3"
            >
              {/* Geometric shapes behind numbers */}
              {m.shape === 'circle' && (
                <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-forest/20 border-2 border-charcoal pointer-events-none" />
              )}
              {m.shape === 'square' && (
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-gold/40 border-2 border-charcoal pointer-events-none" />
              )}
              {m.shape === 'triangle' && (
                <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-crop/20 border-2 border-charcoal rotate-45 pointer-events-none" />
              )}
              {m.shape === 'diamond' && (
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-earth/20 border-2 border-charcoal rotate-12 pointer-events-none" />
              )}

              <div className="relative z-10">
                <span className="text-xs font-black uppercase text-charcoal/70 tracking-wider block">
                  {m.title}
                </span>
                <div className="text-3xl sm:text-4xl font-black text-charcoal font-mono tracking-tight mt-1">
                  {m.value}
                </div>
              </div>

              <p className="text-[11px] font-medium text-charcoal/70 leading-relaxed relative z-10">
                {m.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental & Social Inclusion Indicators */}
      <div className="p-6 bg-white border-3 border-charcoal shadow-bauhaus space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-charcoal">
          {t('impact.sustainabilityTitle')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-cream border-2 border-charcoal shadow-bauhaus-sm">
            <span className="font-bold text-charcoal/70 block uppercase text-[11px]">{t('impact.foodWasteReduction')}</span>
            <span className="text-2xl font-black text-forest font-mono block mt-1">{t('impact.foodWasteVal')}</span>
            <span className="text-[11px] text-charcoal/70 mt-1 block font-medium">
              {language === 'hi' ? '3 घंटे के भीतर कोल्ड-चेन पिकअप' : 'Farmgate cold-dispatch in 3h'}
            </span>
          </div>

          <div className="p-4 bg-cream border-2 border-charcoal shadow-bauhaus-sm">
            <span className="font-bold text-charcoal/70 block uppercase text-[11px]">{t('impact.carbonEmissionsSaved')}</span>
            <span className="text-2xl font-black text-charcoal font-mono block mt-1">{t('impact.carbonVal')}</span>
            <span className="text-[11px] text-charcoal/70 mt-1 block font-medium">
              {language === 'hi' ? '31% कम सड़क किलोमीटर' : '31% reduction in road miles'}
            </span>
          </div>

          <div className="p-4 bg-cream border-2 border-charcoal shadow-bauhaus-sm">
            <span className="font-bold text-charcoal/70 block uppercase text-[11px]">{t('impact.farmersImpacted')}</span>
            <span className="text-2xl font-black text-charcoal font-mono block mt-1">{t('impact.farmersCount')}</span>
            <span className="text-[11px] text-charcoal/70 mt-1 block font-medium">
              {language === 'hi' ? 'दादरी, जेवर एवं बुलंदशहर क्लस्टर' : 'Dadri, Jewar & Bulandshahr nodes'}
            </span>
          </div>

          <div className="p-4 bg-cream border-2 border-charcoal shadow-bauhaus-sm">
            <span className="font-bold text-charcoal/70 block uppercase text-[11px]">{t('impact.womenParticipation')}</span>
            <span className="text-2xl font-black text-forest font-mono block mt-1">{t('impact.womenVal')}</span>
            <span className="text-[11px] text-charcoal/70 mt-1 block font-medium">
              {language === 'hi' ? 'FPO स्वयं सहायता समूहन' : 'FPO self-help aggregation nodes'}
            </span>
          </div>
        </div>
      </div>

      {/* Field Feedback Notes */}
      <div className="p-6 bg-white border-3 border-charcoal shadow-bauhaus space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-charcoal">
          {t('impact.socialProofTitle')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 border-2 border-charcoal bg-cream space-y-2">
            <p className="text-charcoal font-medium leading-relaxed">
              "{t('impact.testimonial1')}"
            </p>
            <p className="font-black text-forest text-xs uppercase">
              {t('impact.testimonial1Author')}
            </p>
          </div>

          <div className="p-4 border-2 border-charcoal bg-cream space-y-2">
            <p className="text-charcoal font-medium leading-relaxed">
              "{t('impact.testimonial2')}"
            </p>
            <p className="font-black text-forest text-xs uppercase">
              {t('impact.testimonial2Author')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboard;
