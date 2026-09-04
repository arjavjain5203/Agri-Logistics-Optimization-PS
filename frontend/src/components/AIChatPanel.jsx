import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Send,
  RotateCcw,
} from 'lucide-react';
import AIMessage from './AIMessage';
import QuickActions from './QuickActions';
import {
  getSuggestedQuestions,
  getQuickActions,
  getAssistantResponse,
} from '../services/mockAssistant';

export const AIChatPanel = ({ isOpen, onClose, currentRole = 'buyer' }) => {
  const { language } = useLanguage();
  const location = useLocation();
  const isHi = language === 'hi';

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const initialWelcomeMessage = {
    id: 'welcome',
    sender: 'ai',
    text: isHi
      ? "नमस्ते। मैं कृषिफ़्लो सहायक हूँ।\n\nमैं मांग विश्लेषण, आपूर्तिकर्ता मिलान, मूल्य निर्धारण और लॉजिस्टिक्स में आपकी सहायता कर सकता हूँ।"
      : "Hello. I am the KrishiFlow Assistant.\n\nI can help you analyze demand signals, review supplier clustering, examine disintermediated economics, and coordinate logistics.",
    timestamp: 'ONLINE',
  };

  const [messages, setMessages] = useState([initialWelcomeMessage]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [
          {
            ...initialWelcomeMessage,
            text: isHi
              ? "नमस्ते। मैं कृषिफ़्लो सहायक हूँ।\n\nमैं मांग विश्लेषण, आपूर्तिकर्ता मिलान, मूल्य निर्धारण और लॉजिस्टिक्स में आपकी सहायता कर सकता हूँ।"
              : "Hello. I am the KrishiFlow Assistant.\n\nI can help you analyze demand signals, review supplier clustering, examine disintermediated economics, and coordinate logistics.",
          },
        ];
      }
      return prev;
    });
  }, [language]);

  const suggestedQuestions = getSuggestedQuestions(location.pathname, currentRole, language);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isThinking]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isThinking) return;

    setInputVal('');

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const response = await getAssistantResponse(
        query,
        { pathname: location.pathname, role: currentRole },
        language
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: response.text,
          card: response.card,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: isHi
            ? "माफ़ कीजिए, कोई तकनीकी समस्या हुई। कृपया पुनः प्रयास करें।"
            : "Encountered an issue processing your query. Please try again.",
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        ...initialWelcomeMessage,
        id: `welcome-${Date.now()}`,
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="KrishiFlow Assistant"
      className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[400px] h-[540px] max-h-[82vh] bg-cream border-4 border-charcoal shadow-bauhaus-lg flex flex-col overflow-hidden animate-in fade-in duration-150"
    >
      {/* Bauhaus Light Soft Sage Header with Charcoal Typography */}
      <div
        style={{ backgroundColor: '#DDE7D8', color: '#172016' }}
        className="px-4 py-3 bg-sage text-charcoal border-b-3 border-charcoal flex items-center justify-between shrink-0"
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              style={{ backgroundColor: '#14532D' }}
              className="w-2.5 h-2.5 rounded-full bg-forest border border-charcoal"
            ></span>
            <span className="font-black text-charcoal text-xs sm:text-sm uppercase tracking-wider">
              {isHi ? "कृषिफ़्लो AI सहायक" : "KrishiFlow AI Assistant"}
            </span>
          </div>
          <p style={{ color: '#14532D' }} className="text-[10px] font-mono font-bold mt-0.5 uppercase tracking-wide">
            {isHi ? "कृषि बुद्धिमत्ता केंद्र" : "Agricultural Intelligence Node"}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleClearChat}
            title={isHi ? "साफ़ करें" : "Reset conversation"}
            className="p-1 border border-charcoal bg-white text-charcoal hover:bg-gold shadow-bauhaus-sm transition-transform active:translate-x-[1px] active:translate-y-[1px]"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="p-1 border border-charcoal bg-white text-charcoal hover:bg-gold shadow-bauhaus-sm transition-transform active:translate-x-[1px] active:translate-y-[1px]"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream">
        {messages.map((m) => (
          <AIMessage key={m.id} message={m} onClosePanel={onClose} />
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-forest pl-2">
            <span className="w-2 h-2 bg-forest animate-pulse border border-charcoal"></span>
            <span>{isHi ? "डेटा विश्लेषण प्रगति पर..." : "PROCESSING AGRI-TELEMETRY..."}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Contextual Quick Suggestions */}
      {suggestedQuestions.length > 0 && (
        <div className="px-3 py-2 border-t-2 border-charcoal bg-white flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          {suggestedQuestions.slice(0, 3).map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(sq)}
              className="text-[11px] font-bold px-2 py-1 bg-cream hover:bg-gold text-charcoal border border-charcoal shadow-bauhaus-sm transition-transform active:translate-x-[1px] active:translate-y-[1px] shrink-0"
            >
              {sq}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t-3 border-charcoal bg-white flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={isHi ? "प्रश्न दर्ज करें..." : "Ask KrishiFlow AI..."}
          className="flex-1 px-3 py-2 text-xs bg-cream border-2 border-charcoal text-charcoal placeholder-charcoal/50 font-medium focus:outline-none focus:bg-white focus:shadow-bauhaus-sm"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isThinking}
          className="btn-bauhaus-primary px-3 py-2 text-xs uppercase flex items-center justify-center disabled:opacity-50"
          aria-label="Send"
        >
          <Send className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
};

export default AIChatPanel;
