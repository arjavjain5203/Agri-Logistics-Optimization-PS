import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../components/common/Toast';
import {
  MapPin,
  ArrowRight,
} from 'lucide-react';

export const FarmerDemand = () => {
  const { t, language } = useLanguage();
  const { addToast } = useToast();

  const demands = [
    {
      id: 'D1',
      buyer: 'FreshBite Restaurants',
      buyerHi: 'फ्रेशबाइट रेस्टोरेंट्स',
      crop: 'Tomato',
      cropHi: 'टमाटर',
      volumeKg: 500,
      offeredBudget: '₹22 - ₹24/kg',
      location: 'Sector 62, Noida (14 km away)',
      locationHi: 'सेक्टर 62, नोएडा (14 किमी)',
      requiredBy: '2026-09-10',
    },
    {
      id: 'D2',
      buyer: 'Delhi Hospitality Group',
      buyerHi: 'दिल्ली हॉस्पिटैलिटी ग्रुप',
      crop: 'Potato',
      cropHi: 'आलू',
      volumeKg: 1200,
      offeredBudget: '₹18 - ₹20/kg',
      location: 'Connaught Place, New Delhi (34 km away)',
      locationHi: 'कनॉट प्लेस, नई दिल्ली (34 किमी)',
      requiredBy: '2026-09-12',
    },
    {
      id: 'D3',
      buyer: 'UrbanMart Retail Hub',
      buyerHi: 'अर्बनमार्ट रिटेल हब',
      crop: 'Onion',
      cropHi: 'प्याज़',
      volumeKg: 800,
      offeredBudget: '₹25 - ₹27/kg',
      location: 'Gurugram Central (42 km away)',
      locationHi: 'गुरुग्राम सेंट्रल (42 किमी)',
      requiredBy: '2026-09-15',
    },
  ];

  const handleSupplyOffer = (buyerName) => {
    addToast(
      language === 'hi'
        ? `${buyerName} के लिए आपूर्ति प्रस्ताव दर्ज कर दिया गया है!`
        : `Supply allotment offered to ${buyerName}!`,
      'success'
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b-3 border-charcoal">
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal uppercase tracking-tight">
          {t('farmerDemand.title')}
        </h1>
        <p className="text-xs text-charcoal/80 font-medium mt-0.5">
          {t('farmerDemand.subtitle')}
        </p>
      </div>

      {/* Demands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {demands.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-white border-3 border-charcoal shadow-bauhaus flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b-2 border-charcoal">
                <span className="text-xs font-black uppercase text-charcoal">
                  {language === 'hi' ? item.buyerHi : item.buyer}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-gold text-charcoal border border-charcoal shadow-bauhaus-sm">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-charcoal/70 font-sans font-bold uppercase text-[10px]">{t('common.crop')}</span>
                  <span className="font-sans font-bold text-charcoal">
                    {language === 'hi' ? item.cropHi : item.crop}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-charcoal/70 font-sans font-bold uppercase text-[10px]">{t('common.quantity')}</span>
                  <span className="font-bold text-charcoal">
                    {item.volumeKg} kg
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-charcoal/70 font-sans font-bold uppercase text-[10px]">{language === 'hi' ? 'प्रस्तावित दर' : 'Price band'}</span>
                  <span className="font-black text-forest text-sm">
                    {item.offeredBudget}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-sans font-medium text-charcoal/70 pt-2 border-t border-charcoal/15">
                  <MapPin className="w-3.5 h-3.5 text-charcoal stroke-[2.5] shrink-0" />
                  <span className="truncate">{language === 'hi' ? item.locationHi : item.location}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSupplyOffer(language === 'hi' ? item.buyerHi : item.buyer)}
              className="btn-bauhaus-primary w-full py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>{t('farmerDemand.offerSupplyBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmerDemand;
