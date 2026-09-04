import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const FarmerOrders = () => {
  const { t, language } = useLanguage();

  const orders = [
    {
      id: 'ORD-FARM-901',
      crop: 'Tomato (Grade A)',
      cropHi: 'टमाटर (ग्रेड A)',
      quantity: 250,
      buyer: 'FreshBite Restaurants, Noida',
      buyerHi: 'फ्रेशबाइट रेस्टोरेंट्स, नोएडा',
      pickupDate: 'Today, 09:25 AM',
      pickupDateHi: 'आज, 09:25 AM',
      payout: '₹5,500',
      status: 'dispatched',
    },
    {
      id: 'ORD-FARM-842',
      crop: 'Tomato (Grade A)',
      cropHi: 'टमाटर (ग्रेड A)',
      quantity: 200,
      buyer: 'Delhi Hospitality Group',
      buyerHi: 'दिल्ली हॉस्पिटैलिटी ग्रुप',
      pickupDate: '28 Aug 2026',
      pickupDateHi: '28 अगस्त 2026',
      payout: '₹4,400',
      status: 'settled',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b-3 border-charcoal">
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal uppercase tracking-tight">
          {t('farmerOrders.title')}
        </h1>
        <p className="text-xs text-charcoal/80 font-medium mt-0.5">
          {t('farmerOrders.subtitle')}
        </p>
      </div>

      {/* Bauhaus Table of Dispatches */}
      <div className="bg-white border-3 border-charcoal shadow-bauhaus overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream text-charcoal uppercase tracking-wider text-[11px] font-black border-b-2 border-charcoal">
              <tr>
                <th className="py-3 px-4">{t('farmerOrders.orderId')}</th>
                <th className="py-3 px-4">{t('farmerOrders.crop')}</th>
                <th className="py-3 px-4">{t('farmerOrders.quantity')}</th>
                <th className="py-3 px-4">{t('farmerOrders.buyer')}</th>
                <th className="py-3 px-4">{t('farmerOrders.pickupDate')}</th>
                <th className="py-3 px-4">{t('farmerOrders.payoutAmount')}</th>
                <th className="py-3 px-4">{t('farmerOrders.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-charcoal/10 font-mono">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-cream/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-charcoal">{o.id}</td>
                  <td className="py-3.5 px-4 font-sans font-bold text-charcoal">
                    {language === 'hi' ? o.cropHi : o.crop}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-charcoal">{o.quantity} kg</td>
                  <td className="py-3.5 px-4 font-sans font-medium text-charcoal">
                    {language === 'hi' ? o.buyerHi : o.buyer}
                  </td>
                  <td className="py-3.5 px-4 text-charcoal/70">
                    {language === 'hi' ? o.pickupDateHi : o.pickupDate}
                  </td>
                  <td className="py-3.5 px-4 font-black text-forest text-sm">{o.payout}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-black uppercase border border-charcoal shadow-bauhaus-sm ${
                        o.status === 'dispatched'
                          ? 'bg-gold text-charcoal'
                          : 'bg-crop text-white'
                      }`}
                    >
                      {o.status === 'dispatched'
                        ? (language === 'hi' ? 'वाहन मार्ग पर' : 'DISPATCHED')
                        : (language === 'hi' ? 'UPI प्राप्त' : 'SETTLED')}
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

export default FarmerOrders;
