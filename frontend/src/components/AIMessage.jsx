import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const AIMessage = ({ message, onClosePanel }) => {
  const navigate = useNavigate();
  const isUser = message.sender === 'user';

  const handleActionClick = (path) => {
    if (path) {
      if (onClosePanel) onClosePanel();
      navigate(path);
    }
  };

  const renderFormattedText = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }

      if (line.trim().startsWith('- ') || line.trim().startsWith('✓ ')) {
        const bulletChar = line.trim().startsWith('✓ ') ? '■' : '●';
        const content = line.trim().replace(/^[-✓]\s*/, '');
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5 text-xs">
            <span className="text-forest font-bold shrink-0">{bulletChar}</span>
            <span>{renderInlineFormatting(content)}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="text-xs leading-relaxed my-0.5">
          {renderInlineFormatting(line)}
        </p>
      );
    });
  };

  const renderInlineFormatting = (content) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-black text-charcoal">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-2.5">
        <div className="max-w-[85%] bg-charcoal text-white border-2 border-charcoal shadow-bauhaus-sm px-3 py-2 text-xs">
          <p className="leading-relaxed font-medium select-text">{message.text}</p>
          <span className="text-[9px] font-mono text-gold block text-right mt-1">
            {message.timestamp || 'Just now'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 mb-3">
      <div className="w-6 h-6 bg-forest border border-charcoal text-gold flex items-center justify-center shrink-0 text-[10px] font-mono font-black mt-0.5 shadow-bauhaus-sm">
        KF
      </div>

      <div className="max-w-[88%] space-y-2">
        <div className="bg-white border-2 border-charcoal text-charcoal shadow-bauhaus-sm px-3 py-2 text-xs">
          {renderFormattedText(message.text)}

          {message.card && (
            <div className="mt-2.5 p-2.5 bg-cream border-2 border-charcoal shadow-bauhaus-sm">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-black uppercase text-charcoal">
                  {message.card.title}
                </span>
                <span className="text-[10px] font-mono font-black text-charcoal bg-gold px-1.5 py-0.2 border border-charcoal">
                  {message.card.metric}
                </span>
              </div>

              <p className="text-xs font-black text-charcoal">{message.card.crop}</p>
              <p className="text-[11px] text-charcoal/70">{message.card.metricLabel}</p>

              {message.card.value && (
                <p className="text-xs font-mono font-bold text-forest mt-1">
                  {message.card.value}
                </p>
              )}

              {message.card.actionText && (
                <button
                  type="button"
                  onClick={() => handleActionClick(message.card.actionPath)}
                  className="btn-bauhaus-primary mt-2 w-full py-1 px-2.5 text-xs uppercase flex items-center justify-center gap-1.5"
                >
                  <span>{message.card.actionText}</span>
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </button>
              )}
            </div>
          )}

          <span className="text-[9px] font-mono text-charcoal/50 block mt-1">
            {message.timestamp || 'Online'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIMessage;
