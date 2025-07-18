// استخدام leo-profanity فقط بدلاً من bad-words لتجنب مشاكل التوافق
import leoProfanity from 'leo-profanity';

// قائمة الكلمات المحظورة باللغة العربية
const arabicBadWords = [
  'كلمة_سيئة_1',
  'كلمة_سيئة_2',
  'كلمة_سيئة_3',
  // يمكن إضافة المزيد من الكلمات هنا
];

// إعداد فلتر الكلمات السيئة باللغة العربية
const arabicFilter = {
  clean: (text: string): string => {
    let cleanedText = text;
    arabicBadWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      cleanedText = cleanedText.replace(regex, '***');
    });
    return cleanedText;
  },
  isProfane: (text: string): boolean => {
    return arabicBadWords.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(text);
    });
  }
};

// إعداد فلتر leo-profanity للغات متعددة
leoProfanity.clearList();
leoProfanity.add(leoProfanity.getDictionary('en'));
// إضافة الكلمات العربية المحظورة
arabicBadWords.forEach(word => leoProfanity.add([word]));

/**
 * فحص النص للكشف عن المحتوى غير اللائق
 * @param text النص المراد فحصه
 * @returns إذا كان النص يحتوي على محتوى غير لائق
 */
export function containsProfanity(text: string): boolean {
  if (!text) return false;
  
  // فحص باستخدام فلتر اللغة العربية
  const hasArabicProfanity = arabicFilter.isProfane(text);
  
  // فحص باستخدام leo-profanity
  const hasLeoProfanity = leoProfanity.check(text);
  
  return hasArabicProfanity || hasLeoProfanity;
}

/**
 * تنظيف النص من المحتوى غير اللائق
 * @param text النص المراد تنظيفه
 * @returns النص بعد التنظيف
 */
export function cleanText(text: string): string {
  if (!text) return '';
  
  // تنظيف النص باستخدام فلتر اللغة العربية
  let cleanedText = arabicFilter.clean(text);
  
  // تنظيف النص باستخدام leo-profanity
  cleanedText = leoProfanity.clean(cleanedText);
  
  return cleanedText;
}

/**
 * فحص وتنظيف التعليق
 * @param comment التعليق المراد فحصه وتنظيفه
 * @returns نتيجة الفحص والتنظيف
 */
export function validateComment(comment: string): { 
  isValid: boolean; 
  cleanedComment: string; 
  message?: string;
} {
  if (!comment || comment.trim() === '') {
    return {
      isValid: false,
      cleanedComment: '',
      message: 'التعليق لا يمكن أن يكون فارغًا'
    };
  }
  
  const hasProfanity = containsProfanity(comment);
  const cleanedComment = cleanText(comment);
  
  if (hasProfanity) {
    return {
      isValid: false,
      cleanedComment,
      message: 'التعليق يحتوي على محتوى غير لائق'
    };
  }
  
  return {
    isValid: true,
    cleanedComment
  };
}

/**
 * فحص وتنظيف وصف الفيديو
 * @param caption وصف الفيديو المراد فحصه وتنظيفه
 * @returns نتيجة الفحص والتنظيف
 */
export function validateCaption(caption: string): { 
  isValid: boolean; 
  cleanedCaption: string; 
  message?: string;
} {
  if (!caption || caption.trim() === '') {
    return {
      isValid: false,
      cleanedCaption: '',
      message: 'الوصف لا يمكن أن يكون فارغًا'
    };
  }
  
  const hasProfanity = containsProfanity(caption);
  const cleanedCaption = cleanText(caption);
  
  if (hasProfanity) {
    return {
      isValid: false,
      cleanedCaption,
      message: 'الوصف يحتوي على محتوى غير لائق'
    };
  }
  
  return {
    isValid: true,
    cleanedCaption
  };
}

/**
 * فحص وتنظيف اسم المستخدم
 * @param username اسم المستخدم المراد فحصه وتنظيفه
 * @returns نتيجة الفحص والتنظيف
 */
export function validateUsername(username: string): { 
  isValid: boolean; 
  cleanedUsername: string; 
  message?: string;
} {
  if (!username || username.trim() === '') {
    return {
      isValid: false,
      cleanedUsername: '',
      message: 'اسم المستخدم لا يمكن أن يكون فارغًا'
    };
  }
  
  const hasProfanity = containsProfanity(username);
  const cleanedUsername = cleanText(username);
  
  if (hasProfanity) {
    return {
      isValid: false,
      cleanedUsername,
      message: 'اسم المستخدم يحتوي على محتوى غير لائق'
    };
  }
  
  return {
    isValid: true,
    cleanedUsername
  };
}

export default {
  containsProfanity,
  cleanText,
  validateComment,
  validateCaption,
  validateUsername
};