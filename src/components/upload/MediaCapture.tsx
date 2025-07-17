'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  CameraIcon, 
  VideoCameraIcon, 
  PhotoIcon, 
  ArrowUpTrayIcon,
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useToast } from '@/components/layout/ToastManager';

type MediaCaptureProps = {
  onMediaCaptured: (file: File, type: 'video' | 'image', preview: string) => void;
  onCancel: () => void;
};

export default function MediaCapture({ onMediaCaptured, onCancel }: MediaCaptureProps) {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // طلب الإذن للوصول إلى الكاميرا
  useEffect(() => {
    const requestCameraPermission = async () => {
      setIsLoading(true);
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: mode === 'video'
        });
        
        setStream(mediaStream);
        setHasPermission(true);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasPermission(false);
        showToast({
          type: 'error',
          title: 'خطأ في الوصول للكاميرا',
          message: 'لم نتمكن من الوصول إلى كاميرا الجهاز. يرجى التحقق من الأذونات.',
          duration: 5000
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    requestCameraPermission();
    
    // تنظيف المصادر عند إزالة المكون
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [facingMode, mode, showToast]);
  
  // عد تنازلي قبل التقاط الصورة
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        
        if (countdown === 1) {
          capturePhoto();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  // التقاط صورة
  const capturePhoto = () => {
    if (!videoRef.current || !stream) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        onMediaCaptured(file, 'image', imageUrl);
      }
    }, 'image/jpeg', 0.8);
  };
  
  // بدء تسجيل فيديو
  const startRecording = () => {
    if (!stream) return;
    
    chunksRef.current = [];
    
    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        
        onMediaCaptured(file, 'video', videoUrl);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // تحديد الحد الأقصى لمدة التسجيل (30 ثانية)
      setTimeout(() => {
        if (mediaRecorderRef.current && isRecording) {
          stopRecording();
        }
      }, 30000);
    } catch (error) {
      console.error('Error starting recording:', error);
      showToast({
        type: 'error',
        title: 'خطأ في التسجيل',
        message: 'حدث خطأ أثناء بدء تسجيل الفيديو.',
        duration: 3000
      });
    }
  };
  
  // إيقاف تسجيل الفيديو
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  // تبديل الكاميرا الأمامية/الخلفية
  const toggleCamera = () => {
    // إيقاف المسار الحالي
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };
  
  // معالجة تحميل ملف
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        onMediaCaptured(file, 'image', imageUrl);
      } else if (file.type.startsWith('video/')) {
        const videoUrl = URL.createObjectURL(file);
        onMediaCaptured(file, 'video', videoUrl);
      } else {
        showToast({
          type: 'error',
          title: 'نوع ملف غير مدعوم',
          message: 'يرجى تحميل ملف صورة أو فيديو.',
          duration: 3000
        });
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center text-white">
          <ArrowPathIcon className="h-12 w-12 mx-auto animate-spin text-indigo-500" />
          <p className="mt-4">جارٍ تحميل الكاميرا...</p>
        </div>
      </div>
    );
  }
  
  if (hasPermission === false) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center text-white p-6 max-w-md">
          <XMarkIcon className="h-12 w-12 mx-auto text-red-500" />
          <h3 className="text-xl font-bold mt-4">لا يمكن الوصول إلى الكاميرا</h3>
          <p className="mt-2">يرجى السماح بالوصول إلى الكاميرا في إعدادات المتصفح الخاص بك.</p>
          <div className="mt-6 flex space-x-4 rtl:space-x-reverse justify-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-md"
            >
              إلغاء
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center"
            >
              <ArrowUpTrayIcon className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
              تحميل ملف
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,video/*"
              className="hidden"
            />
          </div>
        </div>
      </div>
    );
  }
  
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
        
        <div className="flex space-x-4 rtl:space-x-reverse">
          <button
            onClick={toggleCamera}
            className="text-white p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-white p-2"
          >
            <ArrowUpTrayIcon className="h-6 w-6" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*"
            className="hidden"
          />
        </div>
        
        <div className="flex space-x-2 rtl:space-x-reverse bg-gray-800 rounded-full p-1">
          <button
            onClick={() => setMode('photo')}
            className={`px-3 py-1 rounded-full text-sm ${
              mode === 'photo' ? 'bg-white text-black' : 'text-white'
            }`}
          >
            صورة
          </button>
          <button
            onClick={() => setMode('video')}
            className={`px-3 py-1 rounded-full text-sm ${
              mode === 'video' ? 'bg-white text-black' : 'text-white'
            }`}
          >
            فيديو
          </button>
        </div>
      </div>
      
      {/* عرض الكاميرا */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* عداد تنازلي */}
        {countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-7xl font-bold bg-black bg-opacity-50 rounded-full w-24 h-24 flex items-center justify-center">
              {countdown}
            </div>
          </div>
        )}
        
        {/* مؤشر التسجيل */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-600 animate-pulse mr-2 rtl:ml-2 rtl:mr-0"></div>
            <span className="text-white text-sm">جارٍ التسجيل...</span>
          </div>
        )}
      </div>
      
      {/* شريط الأدوات السفلي */}
      <div className="p-6 flex justify-center">
        {mode === 'photo' ? (
          <button
            onClick={() => setCountdown(3)}
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-white"></div>
          </button>
        ) : (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isRecording 
                ? 'bg-red-600' 
                : 'border-4 border-white'
            }`}
          >
            {isRecording ? (
              <div className="w-6 h-6 rounded bg-white"></div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-red-600"></div>
            )}
          </button>
        )}
      </div>
    </div>
  );
}