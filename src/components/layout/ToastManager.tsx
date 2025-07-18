'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import ToastNotification, { ToastType } from './ToastNotification';

// تعريف نوع الإشعار
type Toast = {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    text: string;
    onClick: () => void;
  };
  user?: {
    username: string;
    avatar: string;
  };
  link?: string;
};

// تعريف سياق الإشعارات
type ToastContextType = {
  showToast: (toast: Omit<Toast, 'id'>) => string;
  hideToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// مزود سياق الإشعارات
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // إنشاء عنصر DOM للإشعارات
    if (typeof document !== 'undefined') {
      const container = document.getElementById('toast-container') || createToastContainer();
      setPortalContainer(container);
    }

    return () => {
      // تنظيف عنصر DOM عند إزالة المكون
      if (typeof document !== 'undefined') {
        const container = document.getElementById('toast-container');
        if (container && container.childNodes.length === 0) {
          container.remove();
        }
      }
    };
  }, []);

  // إنشاء حاوية الإشعارات
  const createToastContainer = () => {
    const container = document.createElement('div');
    container.id = 'toast-container';
    // تحسين موضع الإشعارات وزيادة z-index لضمان ظهورها فوق جميع العناصر الأخرى
    container.className = 'fixed top-4 right-4 z-[9999] flex flex-col space-y-2 items-end';
    document.body.appendChild(container);
    return container;
  };

  // إظهار إشعار جديد
  const showToast = (toast: Omit<Toast, 'id'>) => {
    // تحديد الحد الأقصى لعدد الإشعارات المعروضة في وقت واحد (3)
    const maxToasts = 3;
    
    // إذا كان هناك بالفعل الحد الأقصى من الإشعارات، قم بإزالة الأقدم
    if (toasts.length >= maxToasts) {
      const oldestToastId = toasts[0].id;
      hideToast(oldestToastId);
    }
    
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { ...toast, id };
    
    // إضافة الإشعار الجديد
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  // إخفاء إشعار
  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // عرض الإشعارات
  const renderToasts = () => {
    if (!portalContainer) return null;

    return createPortal(
      toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={hideToast}
          action={toast.action}
          user={toast.user}
          link={toast.link}
        />
      )),
      portalContainer
    );
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {renderToasts()}
    </ToastContext.Provider>
  );
}

// هوك استخدام الإشعارات
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}