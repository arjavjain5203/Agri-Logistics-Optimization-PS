import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const QuickActions = ({ actions = [], onSelectAction, onClosePanel }) => {
  const navigate = useNavigate();

  if (!actions || actions.length === 0) return null;

  const handleClick = (action) => {
    if (action.query && onSelectAction) {
      onSelectAction(action.query);
    } else if (action.path) {
      if (onClosePanel) onClosePanel();
      navigate(action.path);
    }
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-none">
      {actions.map((act, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => handleClick(act)}
          className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 transition-all flex items-center gap-1.5 shadow-2xs hover:scale-102 active:scale-98"
        >
          <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>{act.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
