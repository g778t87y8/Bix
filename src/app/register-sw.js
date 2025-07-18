// تسجيل Service Worker للتطبيق

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered successfully:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

// مراقبة حالة الاتصال بالإنترنت
export function setupOfflineDetection(callback) {
  if (!navigator) return;

  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine;
    if (callback && typeof callback === 'function') {
      callback(isOnline);
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  // التحقق من الحالة الأولية
  updateOnlineStatus();

  // إرجاع دالة للتنظيف
  return () => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
  };
}