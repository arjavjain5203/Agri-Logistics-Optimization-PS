import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Sprout,
  Building2,
  User,
  ArrowRight,
} from 'lucide-react';

export const LoginPage = ({ onSelectRole }) => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleChooseRole = (role) => {
    if (onSelectRole) onSelectRole(role);
    if (role === 'buyer') {
      navigate('/buyer');
    } else {
      navigate('/farmer');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Bauhaus Language toggle top right */}
      <div className="absolute top-5 right-5 flex border-2 border-charcoal bg-white shadow-bauhaus-sm">
        <button
          onClick={() => setLanguage('en')}
          style={
            language === 'en'
              ? { backgroundColor: '#14532D', color: '#FFFFFF' }
              : { backgroundColor: '#FFFFFF', color: '#172016' }
          }
          className={`px-3 py-1 text-xs font-black transition-all ${
            language === 'en' ? 'bg-forest text-white' : 'text-charcoal hover:bg-gold/30'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('hi')}
          style={
            language === 'hi'
              ? { backgroundColor: '#14532D', color: '#FFFFFF' }
              : { backgroundColor: '#FFFFFF', color: '#172016' }
          }
          className={`px-3 py-1 text-xs font-black transition-all border-l-2 border-charcoal ${
            language === 'hi' ? 'bg-forest text-white' : 'text-charcoal hover:bg-gold/30'
          }`}
        >
          हिन्दी
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          style={{ backgroundColor: '#14532D', color: '#EAB308' }}
          className="w-12 h-12 bg-forest border-3 border-charcoal text-gold flex items-center justify-center mx-auto mb-4 shadow-bauhaus"
        >
          <Sprout className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h1 className="text-3xl font-black text-charcoal uppercase tracking-tight">
          {t('brand.name')}
        </h1>
        <p className="mt-1 text-xs font-mono font-bold text-charcoal/70 uppercase">
          {language === 'hi'
            ? 'प्रोटोटाइप मूल्यांकनकर्ता पहुंच • भूमिका चुनें'
            : 'Prototype Evaluator Access • Select Interactive Persona'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-6 border-4 border-charcoal shadow-bauhaus-lg space-y-4">
          <div className="text-xs font-mono font-black uppercase tracking-wider text-charcoal/60 text-center pb-2 border-b-2 border-charcoal">
            {language === 'hi' ? 'डेमो प्रोफाइल चुनें' : 'SELECT PERSONA TO ENTER'}
          </div>

          {/* Persona 1: Buyer */}
          <div
            onClick={() => handleChooseRole('buyer')}
            className="p-4 bg-cream border-3 border-charcoal hover:bg-gold cursor-pointer transition-all shadow-bauhaus-sm flex items-center justify-between group active:translate-x-[2px] active:translate-y-[2px]"
          >
            <div className="flex items-center gap-3.5">
              <div
                style={{ backgroundColor: '#14532D', color: '#EAB308' }}
                className="w-10 h-10 bg-forest text-gold border-2 border-charcoal flex items-center justify-center shrink-0 shadow-bauhaus-sm"
              >
                <Building2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase text-charcoal">
                  {language === 'hi' ? 'प्रिया शर्मा (संस्थागत खरीदार)' : 'Priya Sharma (Enterprise Buyer)'}
                </h2>
                <p className="text-xs text-charcoal/70 font-medium">
                  FreshBite Restaurants • Sector 62 Hub
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-charcoal stroke-[3] group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Persona 2: Farmer */}
          <div
            onClick={() => handleChooseRole('farmer')}
            className="p-4 bg-cream border-3 border-charcoal hover:bg-crop hover:text-white cursor-pointer transition-all shadow-bauhaus-sm flex items-center justify-between group active:translate-x-[2px] active:translate-y-[2px]"
          >
            <div className="flex items-center gap-3.5">
              <div
                style={{ backgroundColor: '#4D7C0F', color: '#FFFFFF' }}
                className="w-10 h-10 bg-crop text-white border-2 border-charcoal flex items-center justify-center shrink-0 shadow-bauhaus-sm"
              >
                <User className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase text-charcoal group-hover:text-white">
                  {language === 'hi' ? 'रमेश कुमार (सीमांत किसान)' : 'Ramesh Kumar (Smallholder Farmer)'}
                </h2>
                <p className="text-xs text-charcoal/70 group-hover:text-white/90 font-medium">
                  Dadri Cluster Gate #1 • 250 kg Harvest Listed
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-charcoal group-hover:text-white stroke-[3] group-hover:translate-x-1 transition-transform" />
          </div>

          <div className="pt-3 border-t-2 border-charcoal text-center">
            <p className="text-[11px] font-mono font-bold text-charcoal/60 uppercase">
              National AgriTech Supply Chain Prototype
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
