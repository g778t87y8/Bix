'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/auth/AuthProvider';
import NotificationsPanel from './NotificationsPanel';
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
    // في الإصدار الحقيقي، سنقوم بتسجيل الخروج من Firebase
    // لكن الآن سنقوم بإعادة تحميل الصفحة فقط
    window.location.href = '/auth';
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between px-4 py-2">
        {/* الشعار */}
        <Link href="/feed" className="flex items-center">
          <span className="text-xl font-bold text-indigo-600">Bix</span>
        </Link>

        {/* شريط البحث */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="ابحث عن فيديوهات، مستخدمين، أو هاشتاغات..."
            />
          </div>
        </div>

        {/* أزرار التنقل */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* زر البحث للشاشات الصغيرة */}
          <Link href="/discover" className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </Link>

          {/* مكون الإشعارات */}
          <NotificationsPanel />

          {/* صورة المستخدم والقائمة */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="صورة المستخدم"
                  width={32}
                  height={32}
                  className="rounded-full border border-gray-300"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                </div>
              )}
              <Bars3Icon className="h-5 w-5 text-gray-500 ml-1" />
            </button>

            {/* قائمة المستخدم */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.displayName || 'مستخدم Bix'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {isGuest ? 'مستخدم ضيف' : user?.email || '@username'}
                  </p>
                </div>
                
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                  الملف الشخصي
                </Link>
                
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Cog6ToothIcon className="h-5 w-5 mr-2 text-gray-500" />
                  الإعدادات
                </Link>
                
                <Link
                  href="/help"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <QuestionMarkCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                  المساعدة
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 text-red-500" />
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