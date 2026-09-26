import React from 'react';
import { ToastMessage } from '../../types';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
          info: <Info className="w-4 h-4 text-cyan-400 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
        };

        const icon = icons[toast.type || 'success'];

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#15151B]/95 border border-white/10 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 fade-in duration-200"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {icon}
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {toast.title}
                </div>
                {toast.description && (
                  <div className="text-[11px] text-[#9A9AA3] truncate">
                    {toast.description}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-[#9A9AA3] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
