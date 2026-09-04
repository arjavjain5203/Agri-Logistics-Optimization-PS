import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { useLanguage } from '../context/LanguageContext';

export const AppLayout = ({ currentRole = 'buyer', onRoleChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language } = useLanguage();

  const demoPipeline = [
    { path: '/buyer', label: language === 'hi' ? '1. डैशबोर्ड' : '1. Overview' },
    { path: '/buyer/demand', label: language === 'hi' ? '2. मांग दर्ज' : '2. Procurement' },
    { path: '/buyer/matching', label: language === 'hi' ? '3. स्मार्ट मिलान' : '3. Matching' },
    { path: '/ai', label: language === 'hi' ? '4. पूर्वानुमान' : '4. Forecast' },
    { path: '/logistics', label: language === 'hi' ? '5. लॉजिस्टिक्स' : '5. Logistics' },
    { path: '/orders', label: language === 'hi' ? '6. ऑर्डर' : '6. Orders' },
    { path: '/pricing', label: language === 'hi' ? '7. अर्थशास्त्र' : '7. Economics' },
    { path: '/impact', label: language === 'hi' ? '8. प्रभाव' : '8. Impact' },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col font-sans antialiased text-charcoal">
      {/* Bauhaus Workflow Navigator Bar */}
      <div
        style={{ backgroundColor: '#172016', color: '#F7F4EA' }}
        className="bg-charcoal text-cream text-xs px-4 py-2 border-b-3 border-charcoal flex items-center justify-between overflow-x-auto whitespace-nowrap select-none"
      >
        <div className="flex items-center gap-2 shrink-0 pr-3 border-r-2 border-charcoal-muted">
          <span
            style={{ backgroundColor: '#EAB308' }}
            className="w-2 h-2 rounded-full bg-gold"
          ></span>
          <span
            style={{ color: '#EAB308' }}
            className="font-mono text-[11px] uppercase font-black tracking-wider text-gold"
          >
            {language === 'hi' ? 'लाइव प्रवाह' : 'PIPELINE'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pl-3">
          {demoPipeline.map((step, idx) => {
            const isActive = location.pathname === step.path;
            return (
              <React.Fragment key={step.path}>
                <Link
                  to={step.path}
                  style={
                    isActive
                      ? { backgroundColor: '#EAB308', color: '#172016' }
                      : { color: 'rgba(247, 244, 234, 0.75)' }
                  }
                  className={`px-2.5 py-0.5 text-[11px] font-mono font-bold transition-all ${
                    isActive
                      ? 'bg-gold text-charcoal shadow-bauhaus-sm border border-charcoal'
                      : 'text-cream/70 hover:text-white hover:underline'
                  }`}
                >
                  {step.label}
                </Link>
                {idx < demoPipeline.length - 1 && (
                  <span style={{ color: 'rgba(247, 244, 234, 0.4)' }} className="text-cream/40 text-[10px] font-mono">›</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          currentRole={currentRole}
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <Header
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            currentRole={currentRole}
            onRoleChange={onRoleChange}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
