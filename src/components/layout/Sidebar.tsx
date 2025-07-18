'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, PlusCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/components/auth/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      // التحقق من وجود مستخدم ضيف في localStorage
      const mockGuestUser = localStorage.getItem('bix-guest-user');
      if (mockGuestUser) {
        // إزالة المستخدم الضيف من localStorage
        localStorage.removeItem('bix-guest-user');
        console.log("تم إزالة المستخدم الضيف من localStorage");
        
        // إعادة توجيه إلى صفحة المصادقة
        window.location.href = '/auth';
        return;
      }
      
      // تسجيل الخروج من Firebase
      try {
        await signOut(auth);
        console.log("تم تسجيل الخروج من Firebase بنجاح");
        
        // إعادة توجيه إلى صفحة المصادقة بعد تأخير قصير
        setTimeout(() => {
          window.location.href = '/auth';
        }, 300);
      } catch (firebaseError) {
        console.error('خطأ أثناء تسجيل الخروج من Firebase:', firebaseError);
        // في حالة حدوث خطأ، نقوم بإعادة التوجيه على أي حال
        window.location.href = '/auth';
      }
    } catch (error) {
      console.error('خطأ عام أثناء تسجيل الخروج:', error);
      // في حالة حدوث خطأ، نقوم بإعادة التوجيه على أي حال
      window.location.href = '/auth';
    }
  };

  const navItems = [
    { name: 'الرئيسية', href: '/feed', icon: HomeIcon },
    { name: 'رفع فيديو', href: '/upload', icon: PlusCircleIcon },
    { name: 'الملف الشخصي', href: '/profile', icon: UserIcon },
  ];

  // Determine if user is a guest - safely check localStorage only in browser
  const [isGuest, setIsGuest] = useState(user?.isAnonymous || false);
  const [displayName, setDisplayName] = useState(user?.displayName || 'مستخدم');
  
  // Check localStorage for guest user (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const isGuestFromStorage = localStorage.getItem('bix-guest-user') !== null;
        setIsGuest(user?.isAnonymous || isGuestFromStorage);
        
        // تحديد اسم العرض بناءً على بيانات المستخدم
        if (user?.displayName) {
          setDisplayName(user.displayName);
        } else if (isGuestFromStorage) {
          try {
            const guestData = JSON.parse(localStorage.getItem('bix-guest-user') || '{}');
            setDisplayName(guestData.displayName || 'مستخدم ضيف');
          } catch {
            setDisplayName('مستخدم ضيف');
          }
        } else {
          setDisplayName('مستخدم');
        }
      } catch (e) {
        console.error("Error accessing localStorage:", e);
        setDisplayName('مستخدم');
      }
    }
  }, [user]);

  return (
    <div className="w-20 md:w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <Link href="/feed" className="flex items-center justify-center md:justify-start">
            <span className="text-2xl font-bold text-indigo-600">Bix</span>
          </Link>
        </div>

        {user && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-center md:justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-medium text-gray-700">{displayName}</p>
                <p className="text-xs text-gray-500">
                  {isGuest ? 'Guest Account' : user.email || 'Authenticated User'}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-6 w-6 ${
                      isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {user && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center md:justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden md:inline">تسجيل الخروج</span>
              <span className="md:hidden">خروج</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}