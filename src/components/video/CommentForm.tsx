'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/components/layout/ToastManager';
import Image from 'next/image';
import { validateComment } from '@/lib/utils/contentFilter';

interface CommentFormProps {
  videoId: string;
  onCommentAdded: (comment: any) => void;
}

export default function CommentForm({ videoId, onCommentAdded }: CommentFormProps) {
  const { user, isGuest } = useAuth();
  const { showToast } = useToast();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast({
        type: 'warning',
        title: 'تسجيل الدخول مطلوب',
        message: 'يجب عليك تسجيل الدخول لإضافة تعليق',
        duration: 3000
      });
      return;
    }
    
    if (!comment.trim()) {
      showToast({
        type: 'error',
        title: 'خطأ',
        message: 'لا يمكن إرسال تعليق فارغ',
        duration: 3000
      });
      return;
    }
    
    // التحقق من المحتوى غير اللائق
    const validationResult = validateComment(comment);
    
    if (!validationResult.isValid) {
      showToast({
        type: 'error',
        title: 'محتوى غير لائق',
        message: validationResult.message || 'يرجى تجنب استخدام لغة غير لائقة',
        duration: 3000
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // في التطبيق الحقيقي، سنقوم بإرسال التعليق إلى قاعدة البيانات
      // هنا نقوم بمحاكاة ذلك
      
      setTimeout(() => {
        const newComment = {
          id: `comment-${Date.now()}`,
          userId: user.uid,
          username: user.displayName || 'مستخدم',
          userAvatar: user.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
          text: validationResult.cleanedComment,
          timestamp: new Date().toISOString(),
          likes: 0,
          isLiked: false
        };
        
        onCommentAdded(newComment);
        setComment('');
        setIsSubmitting(false);
        
        showToast({
          type: 'success',
          title: 'تم إضافة التعليق',
          message: 'تمت إضافة تعليقك بنجاح',
          duration: 3000
        });
      }, 500);
    } catch (error) {
      setIsSubmitting(false);
      showToast({
        type: 'error',
        title: 'خطأ',
        message: 'حدث خطأ أثناء إضافة التعليق. يرجى المحاولة مرة أخرى.',
        duration: 3000
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-3 border-t border-gray-200">
      <div className="h-8 w-8 rounded-full overflow-hidden mr-2 rtl:ml-2 rtl:mr-0">
        <Image
          src={user?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'}
          alt="صورة المستخدم"
          width={32}
          height={32}
          className="object-cover"
        />
      </div>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={isGuest ? "سجل الدخول للتعليق..." : "أضف تعليقًا..."}
        disabled={isGuest || isSubmitting}
        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <button
        type="submit"
        disabled={!comment.trim() || isSubmitting || isGuest}
        className={`mr-2 rtl:ml-2 rtl:mr-0 text-indigo-600 font-medium text-sm ${
          !comment.trim() || isSubmitting || isGuest
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:text-indigo-700'
        }`}
      >
        {isSubmitting ? 'جارٍ...' : 'نشر'}
      </button>
    </form>
  );
}