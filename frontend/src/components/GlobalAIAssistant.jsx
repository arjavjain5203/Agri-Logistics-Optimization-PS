import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, X } from 'lucide-react';
import AIChatPanel from './AIChatPanel';

export const GlobalAIAssistant = ({ currentRole = 'buyer' }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const isHi = language === 'hi';

  const tooltipText = isHi ? "कृषिफ़्लो AI सहायक" : "KrishiFlow AI Assistant";

  return (
    <>
      {/* Floating Chat Panel */}
      <AIChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentRole={currentRole}
      />

      {/* Bauhaus Physical Floating Button */}
      <div className="fixed bottom-5 right-5 z-40 group">
        {!isOpen && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-white border-2 border-charcoal text-charcoal text-xs font-black uppercase tracking-wider shadow-bauhaus-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
            {tooltipText}
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={tooltipText}
          style={{
            backgroundColor: isOpen ? '#172016' : '#14532D',
            color: isOpen ? '#FFFFFF' : '#EAB308',
          }}
          className={`relative w-12 h-12 flex items-center justify-center border-3 border-charcoal shadow-bauhaus-md transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-bauhaus-sm ${
            isOpen
              ? 'bg-charcoal text-white hover:bg-forest'
              : 'bg-forest text-gold hover:bg-forest-light'
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5 stroke-[3]" />
          ) : (
            <MessageSquare className="w-5 h-5 stroke-[2.5]" />
          )}
        </button>
      </div>
    </>
  );
};

export default GlobalAIAssistant;
