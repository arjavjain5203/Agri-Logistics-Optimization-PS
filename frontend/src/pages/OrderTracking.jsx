import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { MOCK_ORDERS } from '../data/mockData';

export const OrderTracking = () => {
  const { t, language } = useLanguage();

  const timelineSteps = [
    {
      id: 1,
      title: t('orders.steps.step1'),
      desc: t('orders.stepTimes.time1'),
      status: 'completed',
    },
    {
      id: 2,
      title: t('orders.steps.step2'),
      desc: t('orders.stepTimes.time2'),
      status: 'completed',
    },
    {
      id: 3,
      title: t('orders.steps.step3'),
      desc: t('orders.stepTimes.time3'),
      status: 'completed',
    },
    {
      id: 4,
      title: t('orders.steps.step4'),
      desc: t('orders.stepTimes.time4'),
      status: 'completed',
    },
    {
      id: 5,
      title: t('orders.steps.step5'),
      desc: t('orders.stepTimes.time5'),
      status: 'current',
    },
    {
      id: 6,
      title: t('orders.steps.step6'),
      desc: t('orders.stepTimes.time6'),
      status: 'upcoming',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b-3 border-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal uppercase tracking-tight">
            {t('orders.title')}
          </h1>
          <p className="text-xs text-charcoal/80 font-medium mt-0.5">
            {t('orders.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/pricing"
            className="btn-bauhaus-white px-3.5 py-1.5 text-xs uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>{t('pricing.title')}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </Link>
        </div>
      </div>

      {/* Active Order Card */}
      <div className="p-6 bg-white border-4 border-charcoal shadow-bauhaus-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-4 border-b-2 border-charcoal">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-charcoal">
                #KF-2026-0903
              </span>
              <span
                style={{ backgroundColor: '#EAB308', color: '#172016' }}
                className="text-[10px] font-mono font-black uppercase text-charcoal bg-gold border border-charcoal px-2 py-0.5 shadow-bauhaus-sm"
              >
                {t('orders.currentStatusLabel')}
              </span>
            </div>
            <h2 className="text-lg font-black uppercase text-charcoal mt-1">
              {t('orders.itemsSummary')}
            </h2>
            <p className="text-xs font-medium text-charcoal/70 mt-0.5">
              {t('orders.estimatedArrival')}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-mono text-charcoal/60 uppercase block">{language === 'hi' ? 'कुल मूल्य' : 'Total landed value'}</span>
            <span style={{ color: '#14532D' }} className="text-2xl font-black text-forest font-mono">₹13,500</span>
            <span className="block text-[11px] font-bold text-charcoal/80">
              {language === 'hi' ? 'एस्क्रो में सुरक्षित' : 'Locked in Escrow'}
            </span>
          </div>
        </div>

        {/* Linear Order Pipeline */}
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-charcoal mb-3">
            {t('orders.timelineTitle')}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {timelineSteps.map((step) => {
              const isCompleted = step.status === 'completed';
              const isCurrent = step.status === 'current';

              return (
                <div
                  key={step.id}
                  style={
                    isCurrent
                      ? { backgroundColor: '#EAB308', color: '#172016' }
                      : isCompleted
                      ? { backgroundColor: '#F7F4EA', color: '#172016' }
                      : { backgroundColor: '#FFFFFF', color: '#172016' }
                  }
                  className={`p-3 border-2 border-charcoal text-xs shadow-bauhaus-sm ${
                    isCurrent
                      ? 'bg-gold text-charcoal'
                      : isCompleted
                      ? 'bg-cream text-charcoal'
                      : 'bg-white text-charcoal/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      style={
                        isCompleted
                          ? { backgroundColor: '#14532D', color: '#FFFFFF' }
                          : isCurrent
                          ? { backgroundColor: '#172016', color: '#FFFFFF' }
                          : { backgroundColor: '#F7F4EA', color: '#172016' }
                      }
                      className={`w-4 h-4 border border-charcoal flex items-center justify-center font-mono text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-forest text-white'
                          : isCurrent
                          ? 'bg-charcoal text-white'
                          : 'bg-cream text-charcoal'
                      }`}
                    >
                      {isCompleted ? '✓' : step.id}
                    </span>
                    <span className="font-black text-[11px] uppercase truncate">
                      {step.title}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-charcoal/80 font-medium pl-5">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t-2 border-charcoal text-xs">
          <div className="p-3 bg-cream border-2 border-charcoal flex items-center gap-2.5">
            <ShieldCheck style={{ color: '#14532D' }} className="w-4 h-4 text-forest stroke-[2.5] shrink-0" />
            <div>
              <span className="font-black uppercase text-charcoal block">
                {language === 'hi' ? 'डिजिटल गुणवत्ता प्रमाणीकरण' : 'Quality Calibration'}
              </span>
              <span className="text-charcoal/70 text-[11px] font-medium">
                {t('orders.qualityAssurance')}
              </span>
            </div>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-charcoal stroke-[2.5] shrink-0" />
            <div>
              <span className="font-black uppercase text-charcoal block">
                {language === 'hi' ? 'कोल्ड-चेन लॉजिस्टिक्स' : 'Cold-Chain Delivery'}
              </span>
              <span className="text-charcoal/70 text-[11px] font-medium">
                {t('orders.deliveryPartner')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Orders Data Table */}
      <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-charcoal">
          {language === 'hi' ? 'पूर्व खरीद ऑर्डर इतिहास' : 'Previous Procurement Orders'}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-charcoal uppercase tracking-wider text-[11px] font-black border-b-2 border-charcoal bg-cream">
              <tr>
                <th className="py-2.5 px-3">{t('orders.orderId')}</th>
                <th className="py-2.5 px-3">{t('common.crop')}</th>
                <th className="py-2.5 px-3">{t('common.quantity')}</th>
                <th className="py-2.5 px-3">{t('common.grade')}</th>
                <th className="py-2.5 px-3">{t('common.price')}</th>
                <th className="py-2.5 px-3">{t('common.date')}</th>
                <th className="py-2.5 px-3">{t('common.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-charcoal/10 font-mono">
              {MOCK_ORDERS.map((ord) => (
                <tr key={ord.id} className="hover:bg-cream/60 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-charcoal">{ord.id}</td>
                  <td className="py-2.5 px-3 font-sans font-bold text-charcoal">
                    {language === 'hi' ? ord.cropHi : ord.crop}
                  </td>
                  <td className="py-2.5 px-3 text-charcoal">{ord.quantity}</td>
                  <td className="py-2.5 px-3 font-sans text-charcoal">{ord.grade}</td>
                  <td style={{ color: '#14532D' }} className="py-2.5 px-3 font-bold text-forest">{ord.totalAmount}</td>
                  <td className="py-2.5 px-3 font-sans text-charcoal/70">{language === 'hi' ? ord.dateHi : ord.date}</td>
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

export default OrderTracking;
