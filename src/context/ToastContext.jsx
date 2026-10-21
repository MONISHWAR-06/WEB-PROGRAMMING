import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 9999,
        maxWidth: '420px',
        width: 'calc(100% - 48px)'
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: '#ffffff',
              boxShadow: 'var(--shadow-lg)',
              border: `1.5px solid ${
                toast.type === 'success'
                  ? 'var(--primary-400)'
                  : toast.type === 'error'
                  ? '#f87171'
                  : '#60a5fa'
              }`,
              animation: 'fadeIn 0.25s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {toast.type === 'success' && <CheckCircle2 size={18} color="var(--primary-600)" />}
              {toast.type === 'error' && <AlertCircle size={18} color="#dc2626" />}
              {toast.type === 'info' && <Info size={18} color="#2563eb" />}
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)' }}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: 'var(--text-subtle)', display: 'flex', alignItems: 'center' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
