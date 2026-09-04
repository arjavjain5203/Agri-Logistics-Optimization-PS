import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Store,
  FilePlus2,
  BrainCircuit,
  GitMerge,
  Truck,
  PackageCheck,
  Receipt,
  Leaf,
  Sprout,
  X,
  TrendingUp,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose, currentRole = 'buyer' }) => {
  const { t, language } = useLanguage();

  const buyerNavItems = [
    {
      to: '/buyer',
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/buyer/marketplace',
      label: t('nav.marketplace'),
      icon: Store,
      badge: null,
    },
    {
      to: '/buyer/demand',
      label: t('nav.procurement'),
      icon: FilePlus2,
      badge: language === 'hi' ? 'नया' : 'NEW',
      badgeColor: 'bg-gold text-charcoal border border-charcoal',
      badgeStyle: { backgroundColor: '#EAB308', color: '#172016' },
    },
    {
      to: '/buyer/matching',
      label: t('nav.smartMatching'),
      icon: GitMerge,
      badge: '94%',
      badgeColor: 'bg-crop text-white border border-charcoal',
      badgeStyle: { backgroundColor: '#4D7C0F', color: '#FFFFFF' },
    },
    {
      to: '/ai',
      label: t('nav.aiInsights'),
      icon: BrainCircuit,
      badge: '+19%',
      badgeColor: 'bg-gold text-charcoal border border-charcoal',
      badgeStyle: { backgroundColor: '#EAB308', color: '#172016' },
    },
    {
      to: '/logistics',
      label: t('nav.logistics'),
      icon: Truck,
      badge: null,
    },
    {
      to: '/orders',
      label: t('nav.orders'),
      icon: PackageCheck,
      badge: '3',
      badgeColor: 'bg-cream text-charcoal border border-charcoal',
      badgeStyle: { backgroundColor: '#F7F4EA', color: '#172016' },
    },
    {
      to: '/pricing',
      label: t('nav.pricing'),
      icon: Receipt,
      badge: null,
    },
    {
      to: '/impact',
      label: t('nav.impact'),
      icon: Leaf,
      badge: '+46%',
      badgeColor: 'bg-forest text-gold border border-charcoal',
      badgeStyle: { backgroundColor: '#14532D', color: '#EAB308' },
    },
  ];

  const farmerNavItems = [
    {
      to: '/farmer',
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/farmer/produce',
      label: t('nav.produce'),
      icon: Sprout,
      badge: null,
    },
    {
      to: '/farmer/demand',
      label: t('nav.nearbyDemand'),
      icon: TrendingUp,
      badge: language === 'hi' ? 'लाइव' : 'LIVE',
      badgeColor: 'bg-gold text-charcoal border border-charcoal',
      badgeStyle: { backgroundColor: '#EAB308', color: '#172016' },
    },
    {
      to: '/farmer/orders',
      label: t('nav.orders'),
      icon: PackageCheck,
      badge: '1',
      badgeColor: 'bg-crop text-white border border-charcoal',
      badgeStyle: { backgroundColor: '#4D7C0F', color: '#FFFFFF' },
    },
    {
      to: '/ai',
      label: t('nav.aiInsights'),
      icon: BrainCircuit,
      badge: null,
    },
    {
      to: '/pricing',
      label: t('nav.pricing'),
      icon: Receipt,
      badge: null,
    },
    {
      to: '/impact',
      label: t('nav.impact'),
      icon: Leaf,
      badge: null,
    },
  ];

  const navItems = currentRole === 'buyer' ? buyerNavItems : farmerNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r-3 border-charcoal flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-5 border-b-3 border-charcoal flex items-center justify-between bg-cream">
          <Link to="/" className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: '#14532D', color: '#FFFFFF' }}
              className="w-7 h-7 bg-forest border-2 border-charcoal text-white flex items-center justify-center shadow-bauhaus-sm"
            >
              <Sprout className="w-4 h-4 text-gold" />
            </div>
            <div>
              <span className="font-black text-charcoal text-base tracking-tight uppercase">
                {t('brand.name')}
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1 border-2 border-charcoal bg-white text-charcoal hover:bg-gold shadow-bauhaus-sm"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Role label */}
        <div className="px-5 pt-3 pb-1">
          <span className="text-[10px] font-mono font-black text-charcoal/60 uppercase tracking-widest">
            {currentRole === 'buyer' ? t('roles.buyer') : t('roles.farmer')}
          </span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/buyer' || item.to === '/farmer'}
                onClick={() => onClose && onClose()}
                style={({ isActive }) =>
                  isActive
                    ? { backgroundColor: '#14532D', color: '#FFFFFF' }
                    : { color: '#172016' }
                }
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 text-xs font-black uppercase tracking-tight transition-all ${
                    isActive
                      ? 'bg-forest text-white border-2 border-charcoal shadow-bauhaus-sm'
                      : 'text-charcoal hover:bg-cream border-2 border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0 stroke-[2.5]" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={item.badgeStyle || {}}
                    className={`text-[10px] font-mono font-black px-1.5 py-0.2 shadow-bauhaus-sm ${
                      item.badgeColor || 'bg-gold text-charcoal border border-charcoal'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Status indicator footer */}
        <div className="p-3 border-t-3 border-charcoal bg-cream m-2 border-2 border-charcoal shadow-bauhaus-sm text-[11px]">
          <div className="flex items-center gap-2">
            <span
              style={{ backgroundColor: '#14532D' }}
              className="w-2.5 h-2.5 rounded-full bg-forest border border-charcoal"
            ></span>
            <span className="font-black uppercase text-charcoal tracking-wide">Network Live</span>
          </div>
          <p className="text-[10px] font-mono text-charcoal/70 mt-0.5 pl-4">
            {language === 'hi' ? 'दादरी • गौतम बुद्ध नगर' : 'Dadri • Gautam Buddha Nagar'}
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
