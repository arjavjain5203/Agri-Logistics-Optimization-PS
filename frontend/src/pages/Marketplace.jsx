import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  ArrowRight,
} from 'lucide-react';
import { MOCK_FARMERS } from '../data/mockData';

export const Marketplace = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredFarmers = selectedFilter === 'all'
    ? MOCK_FARMERS
    : MOCK_FARMERS.filter((f) => f.cropId === selectedFilter);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b-3 border-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal uppercase tracking-tight">
            {t('marketplace.title')}
          </h1>
          <p className="text-xs text-charcoal/80 font-medium mt-0.5">
            {t('marketplace.subtitle')}
          </p>
        </div>

        {/* Bauhaus Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedFilter('all')}
            style={
              selectedFilter === 'all'
                ? { backgroundColor: '#14532D', color: '#FFFFFF' }
                : { backgroundColor: '#FFFFFF', color: '#172016' }
            }
            className={`px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-charcoal transition-all ${
              selectedFilter === 'all'
                ? 'bg-forest text-white shadow-bauhaus-sm'
                : 'bg-white text-charcoal hover:bg-gold'
            }`}
          >
            {t('marketplace.allCrops')}
          </button>
          <button
            onClick={() => setSelectedFilter('tomato')}
            style={
              selectedFilter === 'tomato'
                ? { backgroundColor: '#14532D', color: '#FFFFFF' }
                : { backgroundColor: '#FFFFFF', color: '#172016' }
            }
            className={`px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-charcoal transition-all ${
              selectedFilter === 'tomato'
                ? 'bg-forest text-white shadow-bauhaus-sm'
                : 'bg-white text-charcoal hover:bg-gold'
            }`}
          >
            {language === 'hi' ? 'टमाटर' : 'Tomato'}
          </button>
          <button
            onClick={() => setSelectedFilter('potato')}
            style={
              selectedFilter === 'potato'
                ? { backgroundColor: '#14532D', color: '#FFFFFF' }
                : { backgroundColor: '#FFFFFF', color: '#172016' }
            }
            className={`px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-charcoal transition-all ${
              selectedFilter === 'potato'
                ? 'bg-forest text-white shadow-bauhaus-sm'
                : 'bg-white text-charcoal hover:bg-gold'
            }`}
          >
            {language === 'hi' ? 'आलू' : 'Potato'}
          </button>
          <button
            onClick={() => setSelectedFilter('onion')}
            style={
              selectedFilter === 'onion'
                ? { backgroundColor: '#14532D', color: '#FFFFFF' }
                : { backgroundColor: '#FFFFFF', color: '#172016' }
            }
            className={`px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-charcoal transition-all ${
              selectedFilter === 'onion'
                ? 'bg-forest text-white shadow-bauhaus-sm'
                : 'bg-white text-charcoal hover:bg-gold'
            }`}
          >
            {language === 'hi' ? 'प्याज़' : 'Onion'}
          </button>
        </div>
      </div>

      {/* Grid of Verified Farmers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFarmers.map((farmer) => (
          <div
            key={farmer.id}
            className="p-5 bg-white border-3 border-charcoal shadow-bauhaus flex flex-col justify-between space-y-4 relative"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-charcoal text-base uppercase">
                      {language === 'hi' ? farmer.nameHi : farmer.name}
                    </span>
                    <span
                      style={{
                        backgroundColor: farmer.isFpo ? '#EAB308' : '#4D7C0F',
                        color: farmer.isFpo ? '#172016' : '#FFFFFF',
                      }}
                      className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.2 border border-charcoal ${
                        farmer.isFpo ? 'bg-gold text-charcoal' : 'bg-crop text-white'
                      }`}
                    >
                      {farmer.isFpo ? 'FPO' : (language === 'hi' ? 'किसान' : 'FARMER')}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/70 flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-charcoal stroke-[2.5]" />
                    <span>{language === 'hi' ? farmer.locationHi : farmer.location}</span>
                  </p>
                </div>

                <div
                  style={{ backgroundColor: '#EAB308', color: '#172016' }}
                  className="flex items-center gap-1 text-xs font-mono font-bold text-charcoal bg-gold px-2 py-0.5 border border-charcoal shadow-bauhaus-sm"
                >
                  <Star className="w-3 h-3 text-charcoal fill-charcoal" />
                  <span>{farmer.rating}</span>
                </div>
              </div>

              {/* Crop & Quantity details */}
              <div className="p-3 bg-cream border-2 border-charcoal space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal/70 font-sans font-bold uppercase text-[10px]">{t('common.crop')}</span>
                  <span className="font-sans font-bold text-charcoal">
                    {language === 'hi' ? farmer.cropHi : farmer.crop}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal/70 font-sans font-bold uppercase text-[10px]">{t('common.quantity')}</span>
                  <span className="font-bold text-charcoal">
                    {farmer.availableQtyKg} kg
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal/70 font-sans font-bold uppercase text-[10px]">{t('common.grade')}</span>
                  <span className="font-bold text-charcoal">
                    {farmer.grade}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-charcoal/20">
                  <span className="text-charcoal/70 font-sans font-bold uppercase text-[10px]">{t('common.price')}</span>
                  <span style={{ color: '#14532D' }} className="font-black text-forest text-sm">
                    ₹{farmer.pricePerKg} <span className="text-charcoal/60 text-xs font-normal">/kg</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/buyer/demand')}
              className="btn-bauhaus-primary w-full py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>{t('landing.startProcuring')}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
