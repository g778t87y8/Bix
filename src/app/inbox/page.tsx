'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Image from 'next/image';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    username: 'sarah_j',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    lastMessage: 'Hey, loved your latest video! 🔥',
    timestamp: '2h ago',
    unread: true,
  },
  {
    id: 2,
    username: 'mike_dancer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: 'Can you teach me that dance move?',
    timestamp: '1d ago',
    unread: false,
  },
  {
    id: 3,
    username: 'dance_queen',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    lastMessage: 'Let\'s collaborate on a video!',
    timestamp: '3d ago',
    unread: false,
  },
  {
    id: 4,
    username: 'official_bix',
    avatar: '/logo.png',
    lastMessage: 'Welcome to Bix! Start creating...',
    timestamp: '1w ago',
    unread: false,
  },
];

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: 'like',
    username: 'dance_lover',
    content: 'liked your video',
    timestamp: '1h ago',
  },
  {
    id: 2,
    type: 'comment',
    username: 'creative_mind',
    content: 'commented: "Amazing moves!"',
    timestamp: '3h ago',
  },
  {
    id: 3,
    type: 'follow',
    username: 'new_follower',
    content: 'started following you',
    timestamp: '1d ago',
  },
  {
    id: 4,
    type: 'mention',
    username: 'video_creator',
    content: 'mentioned you in a comment',
    timestamp: '2d ago',
  },
];

export default function InboxPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('messages');

  return (
    <div className="pb-20 pt-2 min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-center">الرسائل والإشعارات</h1>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'messages' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('messages')}
          >
            الرسائل
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'notifications' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            الإشعارات
          </button>
        </div>
      </div>

      {activeTab === 'messages' ? (
        <div className="divide-y divide-gray-100">
          {mockMessages.map((message) => (
            <Link href={`/inbox/${message.id}`} key={message.id} className="block">
              <div className="flex items-center p-4 hover:bg-gray-50">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
                  <Image 
                    src={message.avatar} 
                    alt={message.username}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                  {message.unread && (
                    <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-indigo-600"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-900 truncate">{message.username}</p>
                    <p className="text-xs text-gray-500">{message.timestamp}</p>
                  </div>
                  <p className={`text-sm truncate ${message.unread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                    {message.lastMessage}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {mockNotifications.map((notification) => (
            <div key={notification.id} className="p-4 hover:bg-gray-50">
              <div className="flex">
                <div className="mr-3">
                  {notification.type === 'like' && (
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {notification.type === 'comment' && (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {notification.type === 'follow' && (
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                    </div>
                  )}
                  {notification.type === 'mention' && (
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">@{notification.username}</span> {notification.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}