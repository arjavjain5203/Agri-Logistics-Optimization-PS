import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../components/common/Toast';
import {
  ArrowRight,
  TrendingDown,
  Loader2,
} from 'lucide-react';
import mockApi from '../services/mockApi';

export const ProcurementRequest = () => {
  const { t, language } = useLanguage();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    product: 'Tomato',
    quantity: '500',
    requiredDate: '2026-09-10',
    deliveryLocation: 'FreshBite Hub, Sector 62, Noida',
    qualityGrade: 'Grade A',
    maxBudget: '30',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFillDemoData = () => {
    setFormData({
      product: 'Tomato',
      quantity: '500',
      requiredDate: '2026-09-10',
      deliveryLocation: 'FreshBite Hub, Sector 62, Noida',
      qualityGrade: 'Grade A',
      maxBudget: '30',
    });
    addToast(
      language === 'hi'
        ? 'नमूना डेटा लोड किया गया (500 किग्रा टमाटर, ग्रेड A, ₹30/किग्रा)'
        : 'Sample demand loaded (500 kg Tomato, Grade A, ₹30/kg budget)',
      'info'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product || !formData.quantity || !formData.maxBudget) {
      addToast(t('procurementForm.validationError'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await mockApi.createDemand(formData);
      addToast(
        language === 'hi'
          ? 'खरीद मांग दर्ज की गई। आपूर्तिकर्ता मिलान तैयार किया जा रहा है...'
          : 'Demand registered. Computing smallholder supplier matches...',
        'success'
      );
      navigate('/buyer/matching', {
        state: { demand: formData },
      });
    } catch (err) {
      addToast('Error registering demand request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-3 border-charcoal">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal uppercase tracking-tight">
            {t('procurementForm.title')}
          </h1>
          <p className="text-xs text-charcoal/80 font-medium mt-0.5">
            {t('procurementForm.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillDemoData}
          className="btn-bauhaus-white px-3 py-1.5 text-xs uppercase tracking-wider self-start sm:self-auto"
        >
          {t('procurementForm.autoFillDemo')}
        </button>
      </div>

      {/* Bauhaus Market Context Banner */}
      <div className="p-3.5 bg-gold border-3 border-charcoal shadow-bauhaus flex items-center gap-3 text-xs text-charcoal font-bold">
        <TrendingDown className="w-5 h-5 stroke-[2.5] shrink-0" />
        <p className="leading-snug">
          {t('procurementForm.aiForecastBanner')}
        </p>
      </div>

      {/* Main Procurement Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 border-4 border-charcoal shadow-bauhaus-lg space-y-8">
        {/* SECTION 1: PRODUCT INFORMATION */}
        <div>
          <div className="flex items-center gap-2 pb-2 border-b-2 border-charcoal mb-4">
            <span className="w-2.5 h-2.5 bg-forest border border-charcoal"></span>
            <span className="text-xs font-black uppercase tracking-wider text-charcoal">
              {language === 'hi' ? 'उपज विवरण' : 'Product Information'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-charcoal">
                {t('procurementForm.productLabel')} *
              </label>
              <select
                value={formData.product}
                onChange={(e) => handleInputChange('product', e.target.value)}
                className="w-full px-3 py-2 bg-cream border-2 border-charcoal text-xs font-bold text-charcoal focus:outline-none focus:bg-white focus:shadow-bauhaus-sm"
              >
                <option value="Tomato">{language === 'hi' ? 'टमाटर (Tomato)' : 'Tomato'}</option>
                <option value="Potato">{language === 'hi' ? 'आलू (Potato)' : 'Potato'}</option>
                <option value="Onion">{language === 'hi' ? 'प्याज़ (Onion)' : 'Onion'}</option>
                <option value="Carrot">{language === 'hi' ? 'गाजर (Carrot)' : 'Carrot'}</option>
                <option value="Cauliflower">{language === 'hi' ? 'फूलगोभी (Cauliflower)' : 'Cauliflower'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-charcoal">
                {t('procurementForm.quantityLabel')} (kg) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder={t('procurementForm.quantityPlaceholder')}
                  className="w-full pl-3 pr-8 py-2 bg-cream border-2 border-charcoal text-xs font-mono font-bold text-charcoal focus:outline-none focus:bg-white focus:shadow-bauhaus-sm"
                  required
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-charcoal/50">
                  kg
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-charcoal">
                {t('procurementForm.qualityGradeLabel')} *
              </label>
              <select
                value={formData.qualityGrade}
                onChange={(e) => handleInputChange('qualityGrade', e.target.value)}
                className="w-full px-3 py-2 bg-cream border-2 border-charcoal text-xs font-bold text-charcoal focus:outline-none focus:bg-white focus:shadow-bauhaus-sm"
              >
                <option value="Grade A">{t('procurementForm.gradeA')}</option>
                <option value="Grade B">{t('procurementForm.gradeB')}</option>
                <option value="Grade C">{t('procurementForm.gradeC')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: DELIVERY & DESTINATION */}
        <div className="pt-2">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-charcoal mb-4">
            <span className="w-2.5 h-2.5 bg-crop border border-charcoal"></span>
            <span className="text-xs font-black uppercase tracking-wider text-charcoal">
              {language === 'hi' ? 'डिलीवरी एवं गंतव्य' : 'Delivery Schedule'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-charcoal">
                {t('procurementForm.requiredDateLabel')} *
              </label>
              <input
                type="date"
                value={formData.requiredDate}
                onChange={(e) => handleInputChange('requiredDate', e.target.value)}
                className="w-full px-3 py-2 bg-cream border-2 border-charcoal text-xs font-mono font-bold text-charcoal focus:outline-none focus:bg-white focus:shadow-bauhaus-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-charcoal">
                {t('procurementForm.deliveryLocationLabel')} *
              </label>
              <input
                type="text"
                value={formData.deliveryLocation}
                onChange={(e) => handleInputChange('deliveryLocation', e.target.value)}
                placeholder={t('procurementForm.deliveryLocationPlaceholder')}
                className="w-full px-3 py-2 bg-cream border-2 border-charcoal text-xs font-medium text-charcoal focus:outline-none focus:bg-white focus:shadow-bauhaus-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: PRICING & BUDGET */}
        <div className="pt-2">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-charcoal mb-4">
            <span className="w-2.5 h-2.5 bg-earth border border-charcoal"></span>
            <span className="text-xs font-black uppercase tracking-wider text-charcoal">
              {language === 'hi' ? 'बजट एवं दर' : 'Target Budget'}
            </span>
          </div>

          <div className="max-w-xs space-y-1">
            <label className="text-xs font-bold uppercase text-charcoal">
              {t('procurementForm.maxBudgetLabel')} (₹/kg) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal">
                ₹
              </span>
              <input
                type="number"
                value={formData.maxBudget}
                onChange={(e) => handleInputChange('maxBudget', e.target.value)}
                placeholder={t('procurementForm.maxBudgetPlaceholder')}
                className="w-full pl-7 pr-12 py-2 bg-cream border-2 border-charcoal text-xs font-mono font-bold text-charcoal focus:outline-none focus:bg-white focus:shadow-bauhaus-sm"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-charcoal/60">
                / kg
              </span>
            </div>
            <p className="text-[11px] font-mono text-charcoal/60 pt-0.5">
              {language === 'hi' ? 'पारंपरिक थोक मंडी दर: ₹30/किग्रा' : 'Mandi wholesale benchmark: ₹30/kg'}
            </p>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-6 border-t-3 border-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs font-medium text-charcoal/80">
            {language === 'hi'
              ? 'आपूर्तिकर्ता मिलान दादरी एवं आसपास के स्थानीय क्लस्टरों से संकलित होगा।'
              : 'Smallholder harvests will be automatically grouped into a single multi-stop run.'}
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-bauhaus-primary px-6 py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin stroke-[3]" />
                <span>{t('procurementForm.calculatingMatches')}</span>
              </>
            ) : (
              <>
                <span>{t('procurementForm.findSuppliersBtn')}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProcurementRequest;
