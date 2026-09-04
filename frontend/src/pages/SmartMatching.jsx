import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../components/common/Toast';
import {
  Check,
  Building2,
  User,
  ArrowRight,
} from 'lucide-react';
import Badge from '../components/common/Badge';

export const SmartMatching = () => {
  const { t, language } = useLanguage();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedIds, setSelectedIds] = useState(['f1', 'f2', 'f3']);

  const demand = location.state?.demand || {
    product: 'Tomato',
    quantity: '500',
    qualityGrade: 'Grade A',
    deliveryLocation: 'Sector 62, Noida',
    maxBudget: '30',
  };

  const suppliers = [
    {
      id: 'f1',
      name: 'Ramesh Kumar',
      nameHi: 'रमेश कुमार',
      role: 'Smallholder Farmer',
      roleHi: 'सीमांत किसान',
      location: 'Dadri, Greater Noida',
      locationHi: 'दादरी, ग्रेटर नोएडा',
      distanceKm: 8,
      crop: 'Tomato',
      cropHi: 'टमाटर',
      grade: 'Grade A',
      gradeHi: 'ग्रेड A',
      quantityKg: 250,
      pricePerKg: 22,
      matchScore: 94,
      isFpo: false,
    },
    {
      id: 'f2',
      name: 'Sita Devi',
      nameHi: 'सीता देवी',
      role: 'Smallholder Farmer',
      roleHi: 'सीमांत किसान',
      location: 'Dadri Rural Hub',
      locationHi: 'दादरी ग्रामीण हब',
      distanceKm: 12,
      crop: 'Tomato',
      cropHi: 'टमाटर',
      grade: 'Grade A',
      gradeHi: 'ग्रेड A',
      quantityKg: 150,
      pricePerKg: 21,
      matchScore: 91,
      isFpo: false,
    },
    {
      id: 'f3',
      name: 'Green Valley FPO',
      nameHi: 'ग्रीन वैली FPO',
      role: 'Farmer Producer Org (140+ Farmers)',
      roleHi: 'किसान उत्पादक संगठन (140+ किसान)',
      location: 'Bulandshahr Gate',
      locationHi: 'बुलंदशहर गेट',
      distanceKm: 15,
      crop: 'Tomato',
      cropHi: 'टमाटर',
      grade: 'Grade B',
      gradeHi: 'ग्रेड B',
      quantityKg: 100,
      pricePerKg: 23,
      matchScore: 87,
      isFpo: true,
    },
  ];

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalAllocatedKg = useMemo(() => {
    return suppliers
      .filter((s) => selectedIds.includes(s.id))
      .reduce((sum, s) => sum + s.quantityKg, 0);
  }, [selectedIds]);

  const blendedPrice = useMemo(() => {
    const selected = suppliers.filter((s) => selectedIds.includes(s.id));
    if (selected.length === 0 || totalAllocatedKg === 0) return 0;
    const totalCost = selected.reduce((sum, s) => sum + s.quantityKg * s.pricePerKg, 0);
    return (totalCost / totalAllocatedKg).toFixed(2);
  }, [selectedIds, totalAllocatedKg]);

  const targetQty = parseInt(demand.quantity, 10) || 500;
  const isFulfilled = totalAllocatedKg >= targetQty;

  const handleConfirmBatch = () => {
    addToast(
      language === 'hi'
        ? `आपूर्तिकर्ता क्लस्टर पुष्ट हुआ (${totalAllocatedKg} किग्रा @ ₹${blendedPrice}/किग्रा)`
        : `Clustered allocation confirmed (${totalAllocatedKg} kg @ ₹${blendedPrice}/kg)`,
      'success'
    );
    navigate('/logistics', {
      state: {
        batch: {
          product: demand.product,
          totalQty: totalAllocatedKg,
          blendedPrice,
          suppliers: suppliers.filter((s) => selectedIds.includes(s.id)),
        },
      },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b-3 border-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal uppercase tracking-tight">
            {t('smartMatching.title')}
          </h1>
          <p className="text-xs text-charcoal/80 font-medium mt-0.5">
            {t('smartMatching.subtitle')}
          </p>
        </div>

        <Link
          to="/buyer/demand"
          className="text-xs font-bold uppercase text-forest hover:text-charcoal self-start sm:self-auto underline"
        >
          ← {language === 'hi' ? 'मांग संपादित करें' : 'Edit Demand Parameters'}
        </Link>
      </div>

      {/* Aggregation Fulfillment Progress Bar */}
      <div className="p-5 bg-white border-3 border-charcoal shadow-bauhaus space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-black uppercase text-charcoal tracking-wider block">
              {language === 'hi' ? 'समूहन प्रगति स्थिति' : 'Smallholder Aggregation Progress'}
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-charcoal">
              {totalAllocatedKg} / {targetQty} kg
            </span>
            <span className="text-xs font-bold text-forest ml-2">
              ({Math.min(100, Math.round((totalAllocatedKg / targetQty) * 100))}%)
            </span>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-xs font-bold text-charcoal/60 uppercase block">{t('smartMatching.blendedPrice')}</span>
            <span className="text-2xl font-black text-forest">₹{blendedPrice}</span>
            <span className="text-xs font-bold text-charcoal/60"> / kg</span>
          </div>
        </div>

        {/* Bauhaus Solid Progress Bar */}
        <div className="w-full h-4 bg-cream border-2 border-charcoal shadow-bauhaus-sm overflow-hidden">
          <div
            className="h-full bg-forest transition-all duration-300"
            style={{ width: `${Math.min(100, (totalAllocatedKg / targetQty) * 100)}%` }}
          />
        </div>
      </div>

      {/* Clustered Suppliers List */}
      <div className="space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-charcoal block">
          {language === 'hi' ? 'क्लस्टर आपूर्तिकर्ता (दादरी नोड)' : 'Matched Smallholder Producers (Dadri Node)'}
        </span>

        {suppliers.map((s) => {
          const isSelected = selectedIds.includes(s.id);
          return (
            <div
              key={s.id}
              onClick={() => toggleSelect(s.id)}
              className={`p-4 border-3 border-charcoal transition-all cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSelected
                  ? 'bg-white shadow-bauhaus'
                  : 'bg-cream/40 opacity-60 border-charcoal/40'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Mechanical Checkbox */}
                <div
                  style={isSelected ? { backgroundColor: '#14532D', color: '#FFFFFF' } : { backgroundColor: '#FFFFFF' }}
                  className={`w-5 h-5 border-2 border-charcoal flex items-center justify-center mt-0.5 shadow-bauhaus-sm transition-colors ${
                    isSelected ? 'bg-forest text-white' : 'bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm uppercase text-charcoal">
                      {language === 'hi' ? s.nameHi : s.name}
                    </span>
                    <span
                      style={{
                        backgroundColor: s.isFpo ? '#EAB308' : '#4D7C0F',
                        color: s.isFpo ? '#172016' : '#FFFFFF',
                      }}
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 border border-charcoal ${
                        s.isFpo ? 'bg-gold text-charcoal' : 'bg-crop text-white'
                      }`}
                    >
                      {s.isFpo ? 'FPO' : 'FARMER'}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal/70 mt-0.5 font-medium">
                    {language === 'hi' ? s.locationHi : s.location} • <span className="font-mono">{s.distanceKm} km</span>
                  </p>
                </div>
              </div>

              {/* Volume, Grade, Price */}
              <div className="flex items-center gap-6 self-end sm:self-center font-mono text-xs">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-charcoal/60 uppercase block">Available</span>
                  <span className="font-bold text-charcoal">{s.quantityKg} kg</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-charcoal/60 uppercase block">Grade</span>
                  <span className="font-bold text-charcoal">{s.grade}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-charcoal/60 uppercase block">Farmgate</span>
                  <span className="font-black text-forest text-sm">₹{s.pricePerKg}/kg</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-charcoal/60 uppercase block">Compatibility</span>
                  <span className="font-bold text-charcoal bg-gold px-1 border border-charcoal">{s.matchScore}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bauhaus Action Bar */}
      <div className="p-4 bg-gold border-4 border-charcoal shadow-bauhaus-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-charcoal block">
            {language === 'hi' ? 'कुल संकलित बैच' : 'Total Aggregated Lot'}
          </span>
          <p className="text-xs text-charcoal/80 font-medium">
            {totalAllocatedKg} kg • Blended: <strong className="font-mono">₹{blendedPrice}/kg</strong> (Save 10% vs Mandi)
          </p>
        </div>

        <button
          onClick={handleConfirmBatch}
          disabled={!isFulfilled}
          className="btn-bauhaus-primary px-6 py-3 text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
        >
          <span>{t('smartMatching.confirmOrderBtn')}</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};

export default SmartMatching;
