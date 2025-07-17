'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeftIcon, 
  CheckIcon, 
  XMarkIcon,
  ScissorsIcon,
  MusicalNoteIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useToast } from '@/components/layout/ToastManager';

// أنواع الفلاتر
const FILTERS = [
  { id: 'normal', name: 'عادي', class: '' },
  { id: 'grayscale', name: 'رمادي', class: 'grayscale' },
  { id: 'sepia', name: 'سيبيا', class: 'sepia' },
  { id: 'saturate', name: 'مشبع', class: 'saturate-150' },
  { id: 'contrast', name: 'تباين', class: 'contrast-125' },
  { id: 'brightness', name: 'سطوع', class: 'brightness-125' },
  { id: 'blur', name: 'ضبابي', class: 'blur-sm' },
  { id: 'hue-rotate', name: 'تدوير اللون', class: 'hue-rotate-90' },
  { id: 'invert', name: 'عكس', class: 'invert' },
];

// أنواع التأثيرات
const EFFECTS = [
  { id: 'none', name: 'بدون', icon: XMarkIcon },
  { id: 'hearts', name: 'قلوب', icon: '❤️' },
  { id: 'stars', name: 'نجوم', icon: '⭐' },
  { id: 'confetti', name: 'كونفيتي', icon: '🎉' },
  { id: 'fire', name: 'نار', icon: '🔥' },
  { id: 'rainbow', name: 'قوس قزح', icon: '🌈' },
];

// أنواع الموسيقى
const MUSIC_TRACKS = [
  { id: 'none', name: 'بدون موسيقى', artist: '' },
  { id: 'track1', name: 'أغنية شعبية', artist: 'فنان 1' },
  { id: 'track2', name: 'موسيقى هادئة', artist: 'فنان 2' },
  { id: 'track3', name: 'إيقاع سريع', artist: 'فنان 3' },
  { id: 'track4', name: 'موسيقى حماسية', artist: 'فنان 4' },
  { id: 'track5', name: 'أغنية عربية', artist: 'فنان 5' },
];

type MediaEditorProps = {
  file: File;
  type: 'video' | 'image';
  preview: string;
  onSave: (file: File, metadata: MediaMetadata) => void;
  onCancel: () => void;
};

type MediaMetadata = {
  filter: string;
  effect: string;
  musicTrackId: string;
  caption: string;
  trimStart?: number;
  trimEnd?: number;
};

export default function MediaEditor({ file, type, preview, onSave, onCancel }: MediaEditorProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'filter' | 'music' | 'effects' | 'trim'>('filter');
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [selectedEffect, setSelectedEffect] = useState('none');
  const [selectedMusic, setSelectedMusic] = useState('none');
  const [caption, setCaption] = useState('');
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(type === 'video' ? 30 : 0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null);
  
  // تحميل مدة الفيديو
  useEffect(() => {
    if (type === 'video' && mediaRef.current instanceof HTMLVideoElement) {
      const videoElement = mediaRef.current as HTMLVideoElement;
      
      const handleLoadedMetadata = () => {
        setDuration(videoElement.duration);
        setTrimEnd(videoElement.duration);
      };
      
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [type]);
  
  // تشغيل/إيقاف الفيديو
  const togglePlay = () => {
    if (type === 'video' && mediaRef.current instanceof HTMLVideoElement) {
      const videoElement = mediaRef.current as HTMLVideoElement;
      
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      
      setIsPlaying(!isPlaying);
    }
  };
  
  // حفظ التغييرات
  const handleSave = () => {
    // في الواقع، هنا ستقوم بمعالجة الصورة/الفيديو لتطبيق الفلاتر والتأثيرات
    // لكن في هذا المثال، سنكتفي بإرسال البيانات الوصفية
    
    const metadata: MediaMetadata = {
      filter: selectedFilter,
      effect: selectedEffect,
      musicTrackId: selectedMusic,
      caption,
      trimStart: type === 'video' ? trimStart : undefined,
      trimEnd: type === 'video' ? trimEnd : undefined
    };
    
    onSave(file, metadata);
    
    showToast({
      type: 'success',
      title: 'تم الحفظ',
      message: 'تم حفظ التعديلات بنجاح.',
      duration: 3000
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
      {/* شريط الأدوات العلوي */}
      <div className="p-4 flex justify-between items-center">
        <button
          onClick={onCancel}
          className="text-white p-2"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <h2 className="text-white text-lg font-medium">تحرير {type === 'video' ? 'الفيديو' : 'الصورة'}</h2>
        
        <button
          onClick={handleSave}
          className="text-white p-2"
        >
          <CheckIcon className="h-6 w-6" />
        </button>
      </div>
      
      {/* عرض الوسائط */}
      <div className="flex-1 relative">
        {type === 'video' ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={preview}
            className={`w-full h-full object-contain ${FILTERS.find(f => f.id === selectedFilter)?.class || ''}`}
            loop
            onClick={togglePlay}
          />
        ) : (
          <img
            ref={mediaRef as React.RefObject<HTMLImageElement>}
            src={preview}
            alt="Preview"
            className={`w-full h-full object-contain ${FILTERS.find(f => f.id === selectedFilter)?.class || ''}`}
          />
        )}
        
        {/* عرض التأثيرات */}
        {selectedEffect !== 'none' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {selectedEffect === 'hearts' && (
              <div className="hearts-effect">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="heart">❤️</div>
                ))}
              </div>
            )}
            {selectedEffect === 'stars' && (
              <div className="stars-effect">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="star">⭐</div>
                ))}
              </div>
            )}
            {selectedEffect === 'confetti' && (
              <div className="confetti-effect">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div key={i} className="confetti"></div>
                ))}
              </div>
            )}
            {selectedEffect === 'fire' && (
              <div className="fire-effect">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="fire">🔥</div>
                ))}
              </div>
            )}
            {selectedEffect === 'rainbow' && (
              <div className="rainbow-effect">
                <div className="rainbow"></div>
              </div>
            )}
          </div>
        )}
        
        {/* زر تشغيل/إيقاف الفيديو */}
        {type === 'video' && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {!isPlaying && (
              <div className="bg-black bg-opacity-50 rounded-full p-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
          </button>
        )}
      </div>
      
      {/* شريط التقطيع للفيديو */}
      {type === 'video' && activeTab === 'trim' && (
        <div className="px-4 py-2 bg-gray-900">
          <div className="relative h-12">
            <div className="absolute inset-y-0 bg-gray-700 rounded-md" style={{ left: `${(trimStart / duration) * 100}%`, right: `${100 - (trimEnd / duration) * 100}%` }}></div>
            
            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={trimStart}
              onChange={(e) => setTrimStart(parseFloat(e.target.value))}
              className="absolute inset-y-0 left-0 w-full opacity-50"
            />
            
            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={trimEnd}
              onChange={(e) => setTrimEnd(parseFloat(e.target.value))}
              className="absolute inset-y-0 left-0 w-full opacity-50"
            />
          </div>
          
          <div className="flex justify-between text-white text-xs mt-1">
            <span>{formatTime(trimStart)}</span>
            <span>{formatTime(trimEnd)}</span>
          </div>
        </div>
      )}
      
      {/* حقل التعليق */}
      <div className="px-4 py-2 bg-gray-900">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="أضف تعليقًا..."
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          maxLength={150}
        />
      </div>
      
      {/* شريط التبويب */}
      <div className="flex bg-gray-900 text-white">
        <button
          onClick={() => setActiveTab('filter')}
          className={`flex-1 py-3 text-center ${activeTab === 'filter' ? 'text-indigo-400 border-b-2 border-indigo-400' : ''}`}
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5 mx-auto" />
          <span className="text-xs mt-1">فلاتر</span>
        </button>
        
        <button
          onClick={() => setActiveTab('effects')}
          className={`flex-1 py-3 text-center ${activeTab === 'effects' ? 'text-indigo-400 border-b-2 border-indigo-400' : ''}`}
        >
          <SparklesIcon className="h-5 w-5 mx-auto" />
          <span className="text-xs mt-1">تأثيرات</span>
        </button>
        
        <button
          onClick={() => setActiveTab('music')}
          className={`flex-1 py-3 text-center ${activeTab === 'music' ? 'text-indigo-400 border-b-2 border-indigo-400' : ''}`}
        >
          <MusicalNoteIcon className="h-5 w-5 mx-auto" />
          <span className="text-xs mt-1">موسيقى</span>
        </button>
        
        {type === 'video' && (
          <button
            onClick={() => setActiveTab('trim')}
            className={`flex-1 py-3 text-center ${activeTab === 'trim' ? 'text-indigo-400 border-b-2 border-indigo-400' : ''}`}
          >
            <ScissorsIcon className="h-5 w-5 mx-auto" />
            <span className="text-xs mt-1">تقطيع</span>
          </button>
        )}
      </div>
      
      {/* محتوى التبويب */}
      <div className="bg-gray-900 p-4 overflow-x-auto">
        {activeTab === 'filter' && (
          <div className="flex space-x-4 rtl:space-x-reverse">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex flex-col items-center ${selectedFilter === filter.id ? 'text-indigo-400' : 'text-white'}`}
              >
                <div className={`w-16 h-16 rounded-md overflow-hidden mb-1 border-2 ${selectedFilter === filter.id ? 'border-indigo-400' : 'border-transparent'}`}>
                  {type === 'video' ? (
                    <video
                      src={preview}
                      className={`w-full h-full object-cover ${filter.class}`}
                    />
                  ) : (
                    <img
                      src={preview}
                      alt={filter.name}
                      className={`w-full h-full object-cover ${filter.class}`}
                    />
                  )}
                </div>
                <span className="text-xs">{filter.name}</span>
              </button>
            ))}
          </div>
        )}
        
        {activeTab === 'effects' && (
          <div className="flex space-x-4 rtl:space-x-reverse">
            {EFFECTS.map((effect) => (
              <button
                key={effect.id}
                onClick={() => setSelectedEffect(effect.id)}
                className={`flex flex-col items-center ${selectedEffect === effect.id ? 'text-indigo-400' : 'text-white'}`}
              >
                <div className={`w-16 h-16 rounded-md flex items-center justify-center bg-gray-800 mb-1 border-2 ${selectedEffect === effect.id ? 'border-indigo-400' : 'border-transparent'}`}>
                  {typeof effect.icon === 'string' ? (
                    <span className="text-2xl">{effect.icon}</span>
                  ) : (
                    <effect.icon className="h-8 w-8" />
                  )}
                </div>
                <span className="text-xs">{effect.name}</span>
              </button>
            ))}
          </div>
        )}
        
        {activeTab === 'music' && (
          <div className="space-y-2">
            {MUSIC_TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedMusic(track.id)}
                className={`w-full flex items-center p-3 rounded-md ${
                  selectedMusic === track.id ? 'bg-indigo-900' : 'bg-gray-800'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedMusic === track.id ? 'bg-indigo-600' : 'bg-gray-700'
                }`}>
                  <MusicalNoteIcon className="h-5 w-5 text-white" />
                </div>
                <div className="mr-3 rtl:ml-3 rtl:mr-0 text-right rtl:text-right ltr:text-left flex-1">
                  <div className="text-sm font-medium text-white">{track.name}</div>
                  {track.artist && (
                    <div className="text-xs text-gray-400">{track.artist}</div>
                  )}
                </div>
                {selectedMusic === track.id && (
                  <CheckIcon className="h-5 w-5 text-indigo-400" />
                )}
              </button>
            ))}
          </div>
        )}
        
        {activeTab === 'trim' && type === 'video' && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="text-white">
                <div className="text-sm">بداية</div>
                <div className="text-lg font-medium">{formatTime(trimStart)}</div>
              </div>
              <div className="text-white">
                <div className="text-sm">نهاية</div>
                <div className="text-lg font-medium">{formatTime(trimEnd)}</div>
              </div>
              <div className="text-white">
                <div className="text-sm">المدة</div>
                <div className="text-lg font-medium">{formatTime(trimEnd - trimStart)}</div>
              </div>
            </div>
            
            <div className="flex space-x-4 rtl:space-x-reverse">
              <button className="flex-1 bg-gray-800 text-white py-2 rounded-md flex items-center justify-center">
                <ArrowUturnLeftIcon className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
                تراجع
              </button>
              <button className="flex-1 bg-gray-800 text-white py-2 rounded-md flex items-center justify-center">
                <ArrowUturnRightIcon className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
                إعادة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// تنسيق الوقت (ثواني إلى mm:ss)
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}