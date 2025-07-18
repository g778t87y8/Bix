# التوثيق التقني لتطبيق Bix

## التقنيات المستخدمة

- **Next.js 15.3.5**: إطار عمل React للتطبيقات الويب
- **React 19.0.0**: مكتبة JavaScript لبناء واجهات المستخدم
- **TypeScript**: لغة برمجة مبنية على JavaScript مع إضافة أنواع ثابتة
- **Tailwind CSS**: إطار عمل CSS للتصميم
- **Firebase**: منصة لتطوير التطبيقات
- **Framer Motion**: مكتبة للرسوم المتحركة في React

## الهيكل التقني

### 1. نظام التوجيه

يستخدم التطبيق نظام التوجيه الجديد في Next.js (App Router):

- `/app/page.tsx`: الصفحة الرئيسية التي تعيد توجيه المستخدم إلى صفحة التغذية
- `/app/auth/page.tsx`: صفحة المصادقة
- `/app/feed/page.tsx`: صفحة التغذية الرئيسية
- `/app/discover/page.tsx`: صفحة اكتشاف المحتوى
- `/app/profile/page.tsx`: صفحة الملف الشخصي
- `/app/upload/page.tsx`: صفحة رفع الفيديو
- `/app/video/[id]/page.tsx`: صفحة عرض فيديو محدد
- `/app/inbox/page.tsx`: صفحة الرسائل
- `/app/inbox/[id]/page.tsx`: صفحة محادثة محددة

### 2. إدارة الحالة

يستخدم التطبيق مزيجًا من:

- **React Context**: لإدارة حالة المصادقة والإشعارات
- **React Hooks**: لإدارة الحالة المحلية للمكونات
- **Zustand**: (مضمن ولكن غير مستخدم حاليًا) لإدارة حالة التطبيق العامة

### 3. المصادقة

يستخدم التطبيق Firebase Authentication مع دعم إضافي للمستخدمين الضيوف:

```typescript
// src/components/auth/AuthProvider.tsx
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // التحقق من وجود مستخدم ضيف في localStorage
    const checkForMockGuestUser = () => { ... };

    // إنشاء مستخدم ضيف جديد
    const createMockGuestUser = () => { ... };

    // الاستماع لتغييرات حالة المصادقة في Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => { ... });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isGuest }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 4. عرض الفيديو

يستخدم التطبيق عنصر `<video>` الأصلي مع IntersectionObserver لتشغيل الفيديو تلقائيًا عند ظهوره:

```typescript
// src/components/video/VideoCard.tsx
export default function VideoCard({ video, autoPlay, onVideoEnd }: VideoCardProps) {
  // ...
  
  // إعداد IntersectionObserver لتتبع ظهور الفيديو
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.6 }
    );
    
    observer.observe(videoContainerRef.current);
    
    return () => observer.unobserve(videoContainerRef.current);
  }, []);
  
  // تشغيل الفيديو تلقائيًا عند ظهوره
  useEffect(() => {
    if (isInView) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((error) => { ... });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isInView]);
  
  // ...
}
```

### 5. نظام الإشعارات

يستخدم التطبيق نظام إشعارات مخصص مع React Portal:

```typescript
// src/components/layout/ToastManager.tsx
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // إنشاء حاوية الإشعارات في DOM
  useEffect(() => {
    const container = document.getElementById('toast-container') || createToastContainer();
    setPortalContainer(container);
    
    return () => { ... };
  }, []);

  // إظهار إشعار جديد
  const showToast = (toast: Omit<Toast, 'id'>) => { ... };

  // إخفاء إشعار
  const hideToast = (id: string) => { ... };

  // عرض الإشعارات باستخدام React Portal
  const renderToasts = () => {
    return createPortal(
      toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={hideToast}
          action={toast.action}
          user={toast.user}
          link={toast.link}
        />
      )),
      portalContainer
    );
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {renderToasts()}
    </ToastContext.Provider>
  );
}
```

### 6. الخادم المخصص

يستخدم التطبيق خادم Node.js مخصص لتكوين رؤوس CORS وإطارات iframe:

```javascript
// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = 12000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // إضافة رؤوس CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('X-Frame-Options', 'ALLOWALL');
      
      // تحليل عنوان URL
      const parsedUrl = parse(req.url, true);
      
      // السماح لـ Next.js بمعالجة الطلب
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Access via: https://work-1-ryuuqjomxbqjnxrs.prod-runtime.all-hands.dev`);
  });
});
```

## التحسينات التقنية

### 1. تحسين أداء الفيديو

تم تحسين تشغيل الفيديو بإضافة تأخير قبل محاولة التشغيل ومحاولة ثانية في حالة الفشل:

```typescript
useEffect(() => {
  if (videoRef.current) {
    if (isInView) {
      // إضافة تأخير صغير قبل محاولة التشغيل
      const playTimer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play()
            .then(() => setIsPlaying(true))
            .catch((error) => {
              console.error("Error playing video:", error);
              // محاولة إعادة التشغيل مرة أخرى بعد تأخير
              setTimeout(() => {
                if (videoRef.current) {
                  videoRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => console.error("Second attempt failed:", e));
                }
              }, 1000);
            });
        }
      }, 300);
      
      return () => clearTimeout(playTimer);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }
}, [isInView]);
```

### 2. تحسين معالجة المستخدم الضيف

تم تحسين إنشاء المستخدم الضيف بإضافة معالجة أفضل للأخطاء:

```typescript
const createMockGuestUser = () => {
  try {
    const randomId = Math.random().toString(36).substring(2, 9);
    const guestUser = {
      uid: `guest-${Date.now()}-${randomId}`,
      isAnonymous: true,
      displayName: "مستخدم ضيف",
      photoURL: "https://randomuser.me/api/portraits/lego/1.jpg",
      email: null
    };
    
    const success = safeLocalStorage.setItem('bix-guest-user', JSON.stringify(guestUser));
    if (success) {
      console.log("Created new mock guest user:", guestUser.uid);
    } else {
      console.log("Created guest user in memory only (localStorage failed)");
    }
    
    if (isMounted) {
      setUser(guestUser);
      setIsGuest(true);
      setLoading(false);
    }
    return true;
  } catch (error) {
    console.error("Error creating guest user:", error);
    // إنشاء مستخدم ضيف بسيط في حالة حدوث خطأ
    if (isMounted) {
      const fallbackUser = { 
        uid: `guest-fallback`, 
        isAnonymous: true, 
        displayName: "ضيف",
        photoURL: null,
        email: null
      };
      setUser(fallbackUser);
      setIsGuest(true);
      setLoading(false);
    }
    return true;
  }
};
```

## الأمان

### 1. حماية بيانات المستخدم

- استخدام Firebase Authentication لإدارة المصادقة بشكل آمن
- عدم تخزين كلمات المرور محليًا
- استخدام localStorage فقط للمستخدمين الضيوف

### 2. تكوين CORS

تم تكوين رؤوس CORS في الخادم المخصص للسماح بالوصول من أي مصدر:

```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
res.setHeader('Access-Control-Allow-Credentials', true);
```

## الأداء

### 1. تحميل الفيديو

- استخدام IntersectionObserver لتحميل وتشغيل الفيديوهات فقط عند ظهورها في العرض
- تعليق الفيديوهات غير المرئية لتوفير موارد النظام

### 2. تحسين الأداء العام

- استخدام Next.js للتحميل المسبق للصفحات وتحسين الأداء
- استخدام Tailwind CSS للحصول على أحجام CSS صغيرة
- استخدام TypeScript للكشف المبكر عن الأخطاء