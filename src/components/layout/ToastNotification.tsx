'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'notification';

type ToastProps = {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
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

export default function ToastNotification({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  action,
  user,
  link
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // تأكد من أن المدة أكبر من صفر لتجنب الإشعارات الدائمة
    if (duration <= 0) return;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // إزالة بعد انتهاء الحركة
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'notification':
        return user ? (
          <div className="flex-shrink-0">
            <Image
              src={user.avatar}
              alt={user.username}
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
        ) : (
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full">
            <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
        );
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'notification': return 'bg-white border-gray-200';
    }
  };

  const getProgressBarColor = () => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      case 'notification': return 'bg-indigo-500';
    }
  };

  // تحسين وظيفة إغلاق الإشعار
  const handleClose = () => {
    setIsVisible(false);
    // إزالة الإشعار فورًا عند النقر على زر الإغلاق
    onClose(id);
  };

  const toastContent = (
    <div className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border ${getBackgroundColor()}`}>
      <div className="p-4">
        <div className="flex items-start">
          {getIcon()}
          
          <div className="ml-3 w-0 flex-1">
            <div className="text-sm font-medium text-gray-900">
              {user ? (
                <span>
                  <span className="font-bold">{user.username}</span> {title}
                </span>
              ) : (
                title
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
            
            {action && (
              <div className="mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // منع انتشار الحدث
                    action.onClick();
                  }}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {action.text}
                </button>
              </div>
            )}
          </div>
          
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={(e) => {
                e.stopPropagation(); // منع انتشار الحدث
                handleClose();
              }}
              className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="إغلاق الإشعار"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* شريط التقدم */}
      <div className="h-1 w-full bg-gray-200 rounded-b-lg overflow-hidden">
        <div 
          className={`h-full ${getProgressBarColor()}`}
          style={{ 
            width: '100%', 
            animation: `shrink ${duration / 1000}s linear forwards` 
          }}
        />
      </div>
      
      <style jsx global>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="z-[9999]"
          onClick={(e) => {
            // منع انتشار الحدث إذا تم النقر على الإشعار نفسه
            // هذا يمنع تفاعل العناصر خلف الإشعار
            e.stopPropagation();
          }}
        >
          {link ? (
            <Link href={link} className="block">
              {toastContent}
            </Link>
          ) : (
            toastContent
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}