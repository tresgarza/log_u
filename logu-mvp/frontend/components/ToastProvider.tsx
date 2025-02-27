import React, { createContext, useContext, useCallback, useState } from 'react';
import Toast, { ToastType } from './Toast';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

interface ToastContextValue {
  showToast: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message'>>) => void;
  success: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) => void;
  error: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) => void;
  warning: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) => void;
  info: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, options: Partial<Omit<ToastItem, 'id' | 'message'>> = {}) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type: 'info', ...options }]);
  }, []);

  const success = useCallback((message: string, options: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>> = {}) => {
    addToast(message, { ...options, type: 'success' });
  }, [addToast]);

  const error = useCallback((message: string, options: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>> = {}) => {
    addToast(message, { ...options, type: 'error' });
  }, [addToast]);

  const warning = useCallback((message: string, options: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>> = {}) => {
    addToast(message, { ...options, type: 'warning' });
  }, [addToast]);

  const info = useCallback((message: string, options: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>> = {}) => {
    addToast(message, { ...options, type: 'info' });
  }, [addToast]);

  const contextValue = {
    showToast: addToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={toast.position}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};

export default ToastProvider; 