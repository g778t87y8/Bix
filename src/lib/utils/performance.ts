/**
 * وظائف مساعدة لتحسين أداء التطبيق
 */

/**
 * تأخير تنفيذ الدالة حتى يتوقف المستخدم عن الكتابة
 * @param func الدالة المراد تنفيذها
 * @param wait وقت الانتظار بالمللي ثانية
 * @returns دالة مؤجلة
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * تحديد عدد مرات تنفيذ الدالة في فترة زمنية محددة
 * @param func الدالة المراد تنفيذها
 * @param limit الحد الأقصى لعدد مرات التنفيذ
 * @returns دالة محدودة
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  
  return function(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      lastRan = Date.now();
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * تخزين نتائج الدالة في الذاكرة المؤقتة
 * @param func الدالة المراد تخزين نتائجها
 * @returns دالة مع تخزين مؤقت للنتائج
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return function(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    
    const result = func(...args);
    cache.set(key, result);
    
    return result;
  };
}

/**
 * تأخير تحميل المكونات حتى تظهر في نطاق الرؤية
 * @param element العنصر المراد مراقبته
 * @param callback الدالة التي سيتم تنفيذها عند ظهور العنصر
 * @param options خيارات المراقبة
 */
export function lazyLoad(
  element: Element,
  callback: () => void,
  options: IntersectionObserverInit = {}
): void {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback();
        observer.disconnect();
      }
    });
  }, options);
  
  observer.observe(element);
}

/**
 * تحسين أداء قوائم React عن طريق تجنب إعادة العرض غير الضرورية
 * @param prevProps الخصائص السابقة
 * @param nextProps الخصائص الجديدة
 * @returns هل الخصائص متساوية
 */
export function arePropsEqual<T extends Record<string, any>>(
  prevProps: T,
  nextProps: T
): boolean {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  
  return prevKeys.every(key => {
    if (typeof prevProps[key] === 'object' && typeof nextProps[key] === 'object') {
      return JSON.stringify(prevProps[key]) === JSON.stringify(nextProps[key]);
    }
    return prevProps[key] === nextProps[key];
  });
}

export default {
  debounce,
  throttle,
  memoize,
  lazyLoad,
  arePropsEqual
};