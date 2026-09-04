import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../components/common/Toast';
import {
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  ThermometerSnowflake,
} from 'lucide-react';
import { MOCK_LOGISTICS_ROUTE } from '../data/mockData';

export const SmartLogistics = () => {
  const { t, language } = useLanguage();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [routeConfirmed, setRouteConfirmed] = useState(false);

  const metrics = [
    {
      title: t('logistics.optimizedDistance'),
      value: '42 km',
      subtext: language === 'hi' ? 'सीधा रूट अनुकूलन' : 'Cluster multi-stop route',
      accent: 'bg-forest',
    },
    {
      title: t('logistics.estimatedTime'),
      value: '1h 35m',
      subtext: language === 'hi' ? 'सुबह 11:30 बजे आगमन' : 'ETA 11:30 AM arrival',
      accent: 'bg-gold',
    },
    {
      title: t('logistics.estimatedCost'),
      value: '₹850',
      subtext: language === 'hi' ? 'केवल ₹1.70/किग्रा मालभाड़ा' : '₹1.70/kg landed freight',
      accent: 'bg-crop',
    },
    {
      title: t('logistics.distanceSaved'),
      value: '19 km',
      subtext: t('logistics.co2Saved'),
      accent: 'bg-earth',
    },
  ];

  const handleConfirmRoute = () => {
    setRouteConfirmed(true);
    addToast(
      language === 'hi'
        ? 'रूट की पुष्टि हुई। वाहन रवाना कर दिया गया है।'
        : 'Route confirmed. Reefer dispatched to farm pickup points.',
      'success'
    );
    setTimeout(() => {
      navigate('/orders');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b-3 border-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal uppercase tracking-tight">
            {t('logistics.title')}
          </h1>
          <p className="text-xs text-charcoal/80 font-medium mt-0.5">
            {t('logistics.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-gold text-charcoal border-2 border-charcoal shadow-bauhaus-sm text-xs font-mono font-black uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-forest border border-charcoal"></span>
            <span>{t('logistics.dispatchStatus')}</span>
          </span>
        </div>
      </div>

      {/* 4 Logistics Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-4 bg-white border-3 border-charcoal shadow-bauhaus space-y-1 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-charcoal/70 tracking-wider">
                {m.title}
              </span>
              <span className={`w-2.5 h-2.5 ${m.accent} border border-charcoal`}></span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-charcoal font-mono tracking-tight">
              {m.value}
            </div>
            <p className="text-xs text-charcoal/70 font-medium leading-tight">{m.subtext}</p>
          </div>
        ))}
      </div>

      {/* Route Architecture Diagram & Operational Rig details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Stops (Left 2 Columns) */}
        <div className="lg:col-span-2 p-5 bg-white border-3 border-charcoal shadow-bauhaus space-y-6">
          <div className="flex items-center justify-between pb-3 border-b-2 border-charcoal">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-charcoal">
                {t('logistics.routePlanTitle')}
              </h2>
              <p className="text-xs text-charcoal/70 font-medium">
                Clustered Multi-Pickup Sequence • Route #KF-DADRI-903
              </p>
            </div>
            <span className="text-xs font-mono font-black text-charcoal bg-gold border border-charcoal px-2 py-0.5 shadow-bauhaus-sm">
              OPTIMAL PATH
            </span>
          </div>

          {/* BAUHAUS ROUTE VISUALIZATION (Green Nodes, Earth lines, Gold optimal path) */}
          <div className="relative pl-6 space-y-6">
            {/* Connecting Vertical Line */}
            <div className="absolute left-2.5 top-3 bottom-3 w-1 bg-charcoal"></div>

            {MOCK_LOGISTICS_ROUTE.stops.map((stop, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === MOCK_LOGISTICS_ROUTE.stops.length - 1;

              return (
                <div key={stop.id} className="relative flex items-start gap-4">
                  {/* Bauhaus Node Circle */}
                  <div
                    style={
                      isLast
                        ? { backgroundColor: '#EAB308', color: '#172016' }
                        : { backgroundColor: '#14532D', color: '#FFFFFF' }
                    }
                    className={`absolute -left-6 top-1 w-6 h-6 border-2 border-charcoal flex items-center justify-center font-mono font-black text-xs z-10 shadow-bauhaus-sm ${
                      isLast
                        ? 'bg-gold text-charcoal'
                        : 'bg-forest text-white'
                    }`}
                  >
                    {isLast ? '✓' : stop.order}
                  </div>

                  <div className="flex-1 p-3 bg-cream border-2 border-charcoal shadow-bauhaus-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs uppercase text-charcoal">
                          {language === 'hi' ? stop.locationHi : stop.location}
                        </span>
                        <span
                          style={{
                            backgroundColor: stop.type === 'pickup' ? '#4D7C0F' : '#EAB308',
                            color: stop.type === 'pickup' ? '#FFFFFF' : '#172016',
                          }}
                          className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.2 border border-charcoal ${
                            stop.type === 'pickup'
                              ? 'bg-crop text-white'
                              : 'bg-gold text-charcoal'
                          }`}
                        >
                          {stop.type === 'pickup'
                            ? (language === 'hi' ? 'खेत पिकअप' : 'Farm Pickup')
                            : (language === 'hi' ? 'खरीदार डिलीवरी' : 'Destination Hub')}
                        </span>
                      </div>

                      <span className="font-mono text-xs font-black text-charcoal">
                        {stop.eta}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-xs text-charcoal/80 font-medium">
                      <span>{language === 'hi' ? stop.farmerNameHi : stop.farmerName}</span>
                      <span className="font-mono font-bold text-forest">
                        {stop.quantity} ({stop.crop})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cold-Chain Telemetry & Dispatch Confirmation */}
        <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-charcoal pb-2 border-b-2 border-charcoal">
              {language === 'hi' ? 'वाहन एवं कोल्ड-चेन स्थिति' : 'Fleet & Cold-Chain Specs'}
            </h2>

            <div className="p-3 bg-sage border-2 border-charcoal space-y-2 text-xs font-medium">
              <div className="flex justify-between font-mono">
                <span className="text-charcoal/70 uppercase">Rig Model:</span>
                <span className="font-black text-charcoal">Tata Ace EV Reefer</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-charcoal/70 uppercase">Fleet Unit:</span>
                <span className="font-black text-charcoal">UP-16-EV-8492</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-charcoal/70 uppercase">Cargo Bay Temp:</span>
                <span className="font-black text-forest">11.2°C (Calibrated)</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-charcoal/70 uppercase">e-Way Bill:</span>
                <span className="font-black text-charcoal">#8920-1948-12</span>
              </div>
            </div>

            <div className="p-3 bg-cream border-2 border-charcoal text-xs space-y-1">
              <span className="font-bold text-charcoal uppercase block">Zero Waste Guarantee</span>
              <p className="text-[11px] text-charcoal/80 font-medium leading-relaxed">
                Farmgate collection within 3 hours ensures harvest spoilage drops from traditional 24% down to under 4%.
              </p>
            </div>
          </div>

          <button
            onClick={handleConfirmRoute}
            disabled={routeConfirmed}
            className="btn-bauhaus-primary w-full py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span>{routeConfirmed ? 'DISPATCHED' : t('logistics.confirmRouteBtn')}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartLogistics;
