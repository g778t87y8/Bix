'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/auth/AuthProvider';
import NotificationsPanel from './NotificationsPanel';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { 
  Bars3Icon, 
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

export default function TopNav() {
  const { user, isGuest } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    try {
      // التحقق من وجود مستخدم ضيف في localStorage
      const mockGuestUser = localStorage.getItem('bix-guest-user');
      if (mockGuestUser) {
        // إزالة المستخدم الضيف من localStorage
        localStorage.removeItem('bix-guest-user');
        console.log("تم إزالة المستخدم الضيف من localStorage");
      }
      
      // إعادة توجيه المستخدم إلى صفحة المصادقة
      window.location.href = '/auth';
    } catch (error) {
      console.error('خطأ أثناء تسجيل الخروج:', error);
      // في حالة حدوث خطأ، نقوم بإعادة التوجيه على أي حال
      window.location.href = '/auth';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-2">
        {/* الشعار */}
        <Link href="/feed" className="flex items-center">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 transition-colors duration-300">Bix</span>
        </Link>

        {/* شريط البحث */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full bg-gray-50 dark:bg-gray-800 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:text-white transition-colors duration-300"
              placeholder="ابحث عن فيديوهات، مستخدمين، أو هاشتاغات..."
            />
          </div>
        </div>

        {/* أزرار التنقل */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* زر الوضع المظلم */}
          <ThemeToggle />
          
          {/* زر البحث للشاشات الصغيرة */}
          <Link href="/discover" className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-300">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </Link>

          {/* مكون الإشعارات */}
          <NotificationsPanel />

          {/* صورة المستخدم والقائمة */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-full"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="صورة المستخدم"
                  width={32}
                  height={32}
                  className="rounded-full border border-gray-300 dark:border-gray-700 transition-colors duration-300"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center transition-colors duration-300">
                  <UserCircleIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              )}
              <Bars3Icon className="h-5 w-5 text-gray-500 dark:text-gray-400 ml-1" />
            </button>

            {/* قائمة المستخدم */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate transition-colors duration-300">
                    {user?.displayName || 'مستخدم Bix'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate transition-colors duration-300">
                    {isGuest ? 'مستخدم ضيف' : user?.email || '@username'}
                  </p>
                </div>
                
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  الملف الشخصي
                </Link>
                
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Cog6ToothIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  الإعدادات
                </Link>
                
                <Link
                  href="/help"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <QuestionMarkCircleIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  المساعدة
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center transition-colors duration-300"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 text-red-500 dark:text-red-400" />
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}