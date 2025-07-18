'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  PlusCircleIcon, 
  UserIcon, 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  PlusCircleIcon as PlusCircleIconSolid, 
  UserIcon as UserIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid
} from '@heroicons/react/24/solid';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'الرئيسية', href: '/feed', icon: HomeIcon, activeIcon: HomeIconSolid },
    { name: 'استكشاف', href: '/discover', icon: MagnifyingGlassIcon, activeIcon: MagnifyingGlassIconSolid },
    { name: 'إنشاء', href: '/upload', icon: PlusCircleIcon, activeIcon: PlusCircleIconSolid },
    { name: 'الرسائل', href: '/inbox', icon: ChatBubbleLeftRightIcon, activeIcon: ChatBubbleLeftRightIconSolid },
    { name: 'حسابي', href: '/profile', icon: UserIcon, activeIcon: UserIconSolid },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.activeIcon : item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-label={item.name}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${
                isActive 
                  ? 'text-indigo-600 dark:text-indigo-400 font-medium' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'transform scale-110 transition-transform duration-200' : ''}`} />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}