'use client';

import { useEffect, useState, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';
import TopNav from '@/components/layout/TopNav';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/components/layout/ToastManager';
import { useRouter } from 'next/navigation';
import { Tab } from '@headlessui/react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  VideoCameraIcon, 
  BookmarkIcon, 
  HeartIcon, 
  UserPlusIcon, 
  UserMinusIcon,
  ShareIcon, 
  PencilIcon,
  XMarkIcon,
  CheckBadgeIcon,
  LockClosedIcon,
  ArrowPathIcon,
  CameraIcon,
  LinkIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { mockVideos, mockUsers } from '@/lib/mockData';
import { userService } from '@/lib/services/firebaseService';

export default function ProfilePage() {
  const { user, loading, isGuest } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  
  const [editedProfile, setEditedProfile] = useState({
    displayName: '',
    username: '',
    bio: '',
    website: '',
    isPrivate: false
  });
  
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
    
    if (user) {
      // تحميل بيانات الملف الشخصي
      setEditedProfile({
        displayName: user.displayName || '',
        username: user.email?.split('@')[0] || '',
        bio: 'منشئ محتوى رقمي | أشارك رحلتي الإبداعية ✨ | تابعني للمحتوى اليومي',
        website: 'www.example.com',
        isPrivate: false
      });
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // الحصول على اسم العرض واسم المستخدم
  const displayName = user?.displayName || (user?.isAnonymous ? 'مستخدم ضيف' : user?.email?.split('@')[0] || 'مستخدم');
  const username = user?.isAnonymous ? 'guest_user' : user?.email?.split('@')[0] || 'user';
  
  // تصفية الفيديوهات لهذا المستخدم (للعرض التجريبي، استخدم أول 3 فيديوهات فقط)
  const userVideos = mockVideos.slice(0, 3);
  const likedVideos = mockVideos.slice(3, 6);
  const savedVideos = mockVideos.slice(6, 9);
  
  // الحصول على قوائم المتابعين والمتابَعين
  const followers = mockUsers;
  const following = mockUsers;
  
  // وظيفة متابعة/إلغاء متابعة المستخدم
  const toggleFollow = () => {
    if (isGuest) {
      showToast({
        type: 'warning',
        title: 'تسجيل الدخول مطلوب',
        message: 'يجب عليك تسجيل الدخول لمتابعة المستخدمين.',
        duration: 3000,
        action: {
          text: 'تسجيل الدخول',
          onClick: () => router.push('/auth')
        }
      });
      return;
    }
    
    setIsFollowing(!isFollowing);
    
    showToast({
      type: isFollowing ? 'info' : 'success',
      title: isFollowing ? 'تم إلغاء المتابعة' : 'تمت المتابعة',
      message: isFollowing ? `لم تعد تتابع ${displayName}` : `أنت الآن تتابع ${displayName}`,
      duration: 3000
    });
  };
  
  // وظيفة مشاركة الملف الشخصي
  const shareProfile = () => {
    setIsShareModalOpen(true);
  };
  
  // وظيفة نسخ الرابط
  const copyProfileLink = () => {
    const profileUrl = `https://bix.app/profile/${username}`;
    navigator.clipboard.writeText(profileUrl);
    
    showToast({
      type: 'success',
      title: 'تم النسخ',
      message: 'تم نسخ رابط الملف الشخصي إلى الحافظة.',
      duration: 3000
    });
    
    setIsShareModalOpen(false);
  };
  
  // وظيفة حفظ التغييرات في الملف الشخصي
  const saveProfileChanges = () => {
    setIsLoading(true);
    
    // محاكاة تأخير الشبكة
    setTimeout(() => {
      setIsLoading(false);
      setIsEditProfileOpen(false);
      
      showToast({
        type: 'success',
        title: 'تم الحفظ',
        message: 'تم تحديث الملف الشخصي بنجاح.',
        duration: 3000
      });
    }, 1000);
  };
  
  // وظيفة تحميل صورة جديدة للملف الشخصي
  const uploadProfilePicture = () => {
    // هنا سيتم تنفيذ منطق تحميل الصورة الفعلي
    showToast({
      type: 'info',
      title: 'قريبًا',
      message: 'ستتوفر هذه الميزة قريبًا.',
      duration: 3000
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      <TopNav />
      
      {/* معلومات الملف الشخصي */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-start">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src={user?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                alt="الصورة الشخصية"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            {!isGuest && (
              <button 
                onClick={uploadProfilePicture}
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full"
              >
                <CameraIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex-1 mr-4 rtl:ml-4 rtl:mr-0">
            <div className="flex items-center">
              <h2 className="text-xl font-bold">{displayName}</h2>
              {Math.random() > 0.7 && (
                <CheckBadgeIcon className="h-5 w-5 text-blue-500 mr-1 rtl:ml-1 rtl:mr-0" />
              )}
            </div>
            <p className="text-gray-500 text-sm">@{username}</p>
            
            <div className="flex space-x-6 rtl:space-x-reverse mt-2">
              <button 
                onClick={() => setIsFollowingModalOpen(true)}
                className="text-center"
              >
                <span className="font-bold block">42</span>
                <span className="text-gray-500 text-xs">يتابع</span>
              </button>
              <button 
                onClick={() => setIsFollowersModalOpen(true)}
                className="text-center"
              >
                <span className="font-bold block">1.2K</span>
                <span className="text-gray-500 text-xs">متابعين</span>
              </button>
              <div className="text-center">
                <span className="font-bold block">8.5K</span>
                <span className="text-gray-500 text-xs">إعجابات</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* السيرة الذاتية */}
        <div className="mt-3">
          <p className="text-sm">
            {editedProfile.bio}
          </p>
          
          {editedProfile.website && (
            <a 
              href={`https://${editedProfile.website}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 flex items-center mt-1"
            >
              <LinkIcon className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
              {editedProfile.website}
            </a>
          )}
        </div>
        
        {/* أزرار الإجراءات */}
        <div className="flex space-x-2 rtl:space-x-reverse mt-4">
          {isGuest ? (
            <button 
              onClick={() => router.push('/auth')}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-md flex items-center justify-center"
            >
              تسجيل الدخول لتعديل الملف الشخصي
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsEditProfileOpen(true)}
                className="flex-1 border border-gray-300 py-2 rounded-md flex items-center justify-center"
              >
                <PencilIcon className="h-5 w-5 mr-1 rtl:ml-1 rtl:mr-0" />
                تعديل الملف الشخصي
              </button>
              <button 
                onClick={shareProfile}
                className="w-12 border border-gray-300 rounded-md flex items-center justify-center"
              >
                <ShareIcon className="h-5 w-5 text-gray-600" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* علامات التبويب */}
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex border-b border-gray-200 bg-white">
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={`flex-1 py-3 text-center ${
                  selected 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <VideoCameraIcon className="h-5 w-5 mx-auto" />
                <span className="text-xs mt-1">الفيديوهات</span>
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={`flex-1 py-3 text-center ${
                  selected 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <HeartIcon className="h-5 w-5 mx-auto" />
                <span className="text-xs mt-1">الإعجابات</span>
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={`flex-1 py-3 text-center ${
                  selected 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookmarkIcon className="h-5 w-5 mx-auto" />
                <span className="text-xs mt-1">المحفوظات</span>
              </button>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels className="bg-white min-h-[300px]">
          {/* علامة تبويب الفيديوهات */}
          <Tab.Panel>
            {userVideos.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 p-1">
                {userVideos.map((video) => (
                  <Link 
                    href={`/video/${video.id}`}
                    key={video.id} 
                    className="aspect-square bg-gray-100 relative overflow-hidden"
                  >
                    <video
                      src={video.videoUrl}
                      className="object-cover w-full h-full"
                      muted
                      playsInline
                    />
                    <div className="absolute bottom-1 right-1 rtl:left-1 rtl:right-auto flex items-center">
                      <HeartIcon className="h-3 w-3 text-white" />
                      <span className="text-white text-xs mr-1 rtl:ml-1 rtl:mr-0">{video.likes}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">لا توجد فيديوهات بعد</p>
                <button 
                  onClick={() => router.push('/upload')}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm"
                >
                  تحميل أول فيديو
                </button>
              </div>
            )}
          </Tab.Panel>
          
          {/* علامة تبويب الإعجابات */}
          <Tab.Panel>
            {likedVideos.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 p-1">
                {likedVideos.map((video) => (
                  <Link 
                    href={`/video/${video.id}`}
                    key={video.id} 
                    className="aspect-square bg-gray-100 relative overflow-hidden"
                  >
                    <video
                      src={video.videoUrl}
                      className="object-cover w-full h-full"
                      muted
                      playsInline
                    />
                    <div className="absolute bottom-1 right-1 rtl:left-1 rtl:right-auto flex items-center">
                      <HeartIcon className="h-3 w-3 text-white" />
                      <span className="text-white text-xs mr-1 rtl:ml-1 rtl:mr-0">{video.likes}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">لا توجد فيديوهات معجب بها بعد</p>
              </div>
            )}
          </Tab.Panel>
          
          {/* علامة تبويب المحفوظات */}
          <Tab.Panel>
            {savedVideos.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 p-1">
                {savedVideos.map((video) => (
                  <Link 
                    href={`/video/${video.id}`}
                    key={video.id} 
                    className="aspect-square bg-gray-100 relative overflow-hidden"
                  >
                    <video
                      src={video.videoUrl}
                      className="object-cover w-full h-full"
                      muted
                      playsInline
                    />
                    <div className="absolute bottom-1 right-1 rtl:left-1 rtl:right-auto flex items-center">
                      <HeartIcon className="h-3 w-3 text-white" />
                      <span className="text-white text-xs mr-1 rtl:ml-1 rtl:mr-0">{video.likes}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">لا توجد فيديوهات محفوظة بعد</p>
              </div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
      {/* نافذة تعديل الملف الشخصي */}
      <Transition appear show={isEditProfileOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsEditProfileOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right rtl:text-right ltr:text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                  >
                    تعديل الملف الشخصي
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setIsEditProfileOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الاسم الظاهر
                      </label>
                      <input
                        type="text"
                        value={editedProfile.displayName}
                        onChange={(e) => setEditedProfile({...editedProfile, displayName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        اسم المستخدم
                      </label>
                      <input
                        type="text"
                        value={editedProfile.username}
                        onChange={(e) => setEditedProfile({...editedProfile, username: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        نبذة تعريفية
                      </label>
                      <textarea
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الموقع الإلكتروني
                      </label>
                      <input
                        type="text"
                        value={editedProfile.website}
                        onChange={(e) => setEditedProfile({...editedProfile, website: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="www.example.com"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPrivate"
                        checked={editedProfile.isPrivate}
                        onChange={(e) => setEditedProfile({...editedProfile, isPrivate: e.target.checked})}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isPrivate" className="mr-2 rtl:ml-2 rtl:mr-0 block text-sm text-gray-700">
                        حساب خاص
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3 rtl:space-x-reverse">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsEditProfileOpen(false)}
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                      onClick={saveProfileChanges}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <ArrowPathIcon className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 animate-spin" />
                          جارٍ الحفظ...
                        </>
                      ) : (
                        'حفظ التغييرات'
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      
      {/* نافذة المشاركة */}
      <Transition appear show={isShareModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsShareModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right rtl:text-right ltr:text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                  >
                    مشاركة الملف الشخصي
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setIsShareModalOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>
                  
                  <div className="mt-4">
                    <button
                      onClick={copyProfileLink}
                      className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <LinkIcon className="h-5 w-5 text-gray-500 ml-2 rtl:mr-2 rtl:ml-0" />
                        <span>نسخ الرابط</span>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </button>
                    
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      <button className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </div>
                        <span className="text-xs mt-1">فيسبوك</span>
                      </button>
                      
                      <button className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </div>
                        <span className="text-xs mt-1">تويتر</span>
                      </button>
                      
                      <button className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </div>
                        <span className="text-xs mt-1">واتساب</span>
                      </button>
                      
                      <button className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                          </svg>
                        </div>
                        <span className="text-xs mt-1">ريديت</span>
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      
      {/* نافذة المتابعين */}
      <Transition appear show={isFollowersModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsFollowersModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right rtl:text-right ltr:text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                  >
                    المتابعين
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setIsFollowersModalOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>
                  
                  <div className="mt-4 max-h-80 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                      {followers.map((follower) => (
                        <li key={follower.id} className="py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Image
                                src={follower.avatar}
                                alt={follower.username}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                              <div className="mr-3 rtl:ml-3 rtl:mr-0">
                                <p className="text-sm font-medium text-gray-900">{follower.displayName}</p>
                                <p className="text-xs text-gray-500">@{follower.username}</p>
                              </div>
                            </div>
                            <button
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                              onClick={() => {
                                setIsFollowersModalOpen(false);
                                router.push(`/profile/${follower.username}`);
                              }}
                            >
                              عرض
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      
      {/* نافذة المتابَعين */}
      <Transition appear show={isFollowingModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsFollowingModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right rtl:text-right ltr:text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                  >
                    يتابع
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setIsFollowingModalOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>
                  
                  <div className="mt-4 max-h-80 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                      {following.map((followedUser) => (
                        <li key={followedUser.id} className="py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Image
                                src={followedUser.avatar}
                                alt={followedUser.username}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                              <div className="mr-3 rtl:ml-3 rtl:mr-0">
                                <p className="text-sm font-medium text-gray-900">{followedUser.displayName}</p>
                                <p className="text-xs text-gray-500">@{followedUser.username}</p>
                              </div>
                            </div>
                            <button
                              className="text-sm font-medium text-red-600 hover:text-red-800"
                              onClick={() => {
                                // إلغاء المتابعة
                                showToast({
                                  type: 'info',
                                  title: 'تم إلغاء المتابعة',
                                  message: `لم تعد تتابع ${followedUser.displayName}`,
                                  duration: 3000
                                });
                              }}
                            >
                              إلغاء المتابعة
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      
      {/* شريط التنقل السفلي */}
      <BottomNav />
    </div>
  );
}