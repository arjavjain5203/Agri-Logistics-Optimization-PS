import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../components/common/Toast';
import { Plus } from 'lucide-react';

export const FarmerProduce = () => {
  const { t, language } = useLanguage();
  const { addToast } = useToast();

  const [crops, setCrops] = useState([
    {
      id: 1,
      name: 'Tomato (Hybrid Red)',
      nameHi: 'टमाटर (हाइब्रिड लाल)',
      quantity: 250,
      harvestDate: '2026-09-02',
      price: 22,
      grade: 'Grade A',
      status: 'allocated',
    },
    {
      id: 2,
      name: 'Potato (Pukhraj)',
      nameHi: 'आलू (पुखराज)',
      quantity: 400,
      harvestDate: '2026-09-05',
      price: 18,
      grade: 'Grade A',
      status: 'available',
    },
  ]);

  const [newCrop, setNewCrop] = useState({
    name: 'Tomato',
    quantity: '100',
    harvestDate: '2026-09-08',
    price: '22',
    grade: 'Grade A',
  });

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setCrops((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newCrop.name,
        nameHi: newCrop.name === 'Tomato' ? 'टमाटर' : newCrop.name,
        quantity: parseInt(newCrop.quantity, 10),
        harvestDate: newCrop.harvestDate,
        price: parseInt(newCrop.price, 10),
        grade: newCrop.grade,
        status: 'available',
      },
    ]);
    setShowAddModal(false);
    addToast(t('toasts.produceAdded'), 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b-3 border-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal uppercase tracking-tight">
            {t('farmerProduce.title')}
          </h1>
          <p className="text-xs text-charcoal/80 font-medium mt-0.5">
            {t('farmerProduce.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-bauhaus-primary px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('farmerProduce.addProduce')}</span>
        </button>
      </div>

      {/* Table of Listings */}
      <div className="bg-white border-3 border-charcoal shadow-bauhaus overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream text-charcoal uppercase tracking-wider text-[11px] font-black border-b-2 border-charcoal">
              <tr>
                <th className="py-3 px-4">{t('farmerProduce.cropName')}</th>
                <th className="py-3 px-4">{t('farmerProduce.quantityAvailable')}</th>
                <th className="py-3 px-4">{t('farmerProduce.expectedPrice')}</th>
                <th className="py-3 px-4">{t('farmerProduce.grade')}</th>
                <th className="py-3 px-4">{t('farmerProduce.harvestDate')}</th>
                <th className="py-3 px-4">{t('farmerProduce.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-charcoal/10 font-mono">
              {crops.map((c) => (
                <tr key={c.id} className="hover:bg-cream/50 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-bold text-charcoal">
                    {language === 'hi' ? c.nameHi || c.name : c.name}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-charcoal">{c.quantity} kg</td>
                  <td className="py-3.5 px-4 font-black text-forest">₹{c.price}/kg</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className="px-1.5 py-0.2 bg-cream text-charcoal border border-charcoal text-[11px] font-bold">
                      {c.grade}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-charcoal/70">{c.harvestDate}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-black uppercase border border-charcoal shadow-bauhaus-sm ${
                        c.status === 'allocated'
                          ? 'bg-gold text-charcoal'
                          : 'bg-crop text-white'
                      }`}
                    >
                      {c.status === 'allocated'
                        ? (language === 'hi' ? 'ऑर्डर आवंटित' : 'ALLOCATED')
                        : (language === 'hi' ? 'सक्रिय' : 'AVAILABLE')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bauhaus Add Produce Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-cream border-4 border-charcoal shadow-bauhaus-lg max-w-md w-full p-6 animate-in fade-in">
            <h3 className="text-lg font-black uppercase text-charcoal tracking-tight mb-0.5">
              {t('farmerProduce.addProduce')}
            </h3>
            <p className="text-xs text-charcoal/70 font-medium mb-5">
              {language === 'hi' ? 'अपनी उपज का विवरण भरें' : 'Register your harvest lot into KrishiFlow network'}
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold uppercase text-charcoal block">
                  {t('farmerProduce.cropName')}
                </label>
                <select
                  value={newCrop.name}
                  onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border-2 border-charcoal font-bold text-charcoal focus:shadow-bauhaus-sm"
                >
                  <option value="Tomato">Tomato (टमाटर)</option>
                  <option value="Potato">Potato (आलू)</option>
                  <option value="Onion">Onion (प्याज़)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-charcoal block">
                  {t('farmerProduce.quantityAvailable')} (kg)
                </label>
                <input
                  type="number"
                  value={newCrop.quantity}
                  onChange={(e) => setNewCrop({ ...newCrop, quantity: e.target.value })}
                  className="w-full px-3 py-2 bg-white border-2 border-charcoal font-mono font-bold text-charcoal focus:shadow-bauhaus-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-charcoal block">
                  {t('farmerProduce.expectedPrice')} (₹/kg)
                </label>
                <input
                  type="number"
                  value={newCrop.price}
                  onChange={(e) => setNewCrop({ ...newCrop, price: e.target.value })}
                  className="w-full px-3 py-2 bg-white border-2 border-charcoal font-mono font-bold text-charcoal focus:shadow-bauhaus-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t-2 border-charcoal">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-bauhaus-white px-4 py-2 text-xs uppercase tracking-wider"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="btn-bauhaus-primary px-5 py-2 text-xs uppercase tracking-wider"
                >
                  {t('farmerProduce.addBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProduce;
