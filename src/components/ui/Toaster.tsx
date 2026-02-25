import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-[100] space-y-3 pointer-events-none">
          {toasts.map(toast => (
            <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

interface ToastComponentProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onRemove }) => {
  const typeStyles = {
    success: 'bg-green-500/10 border-green-500/20 text-green-400 shadow-[0_4px_20px_-4px_rgba(34,197,94,0.2)]',
    error: 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.2)]',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 shadow-[0_4px_20px_-4px_rgba(234,179,8,0.2)]',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.2)]'
  };

  const typeIcons = {
    success: (
      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <div
      className={cn(
        'max-w-sm w-full bg-surface/90 backdrop-blur-xl shadow-2xl rounded-xl border p-4 pointer-events-auto transition-all animate-slide-up flex items-start gap-3 relative overflow-hidden',
        typeStyles[toast.type]
      )}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-50"></div>

      <div className="flex-shrink-0 mt-0.5 p-1 rounded-lg bg-surface border border-border">
        {typeIcons[toast.type]}
      </div>

      <div className="flex-1 min-w-0 pr-6">
        <p className="text-sm font-bold text-white mb-0.5">
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-xs font-medium text-textMuted leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>

      <div className="absolute top-3 right-3">
        <button
          onClick={() => onRemove(toast.id)}
          className="rounded-lg p-1 text-textMuted hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <span className="sr-only">Close</span>
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Simple Toaster component for apps not using the provider
export const Toaster: React.FC = () => {
  return null; // This would be implemented if needed
};

export default ToastProvider;