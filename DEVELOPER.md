# دليل المطور لتطبيق Bix

## متطلبات التطوير

- **Node.js**: الإصدار 18.0.0 أو أحدث
- **npm**: الإصدار 9.0.0 أو أحدث
- **حساب Firebase**: للمصادقة وتخزين البيانات

## إعداد بيئة التطوير

### 1. استنساخ المشروع

```bash
git clone https://github.com/yourusername/Bix.git
cd Bix
```

### 2. تثبيت التبعيات

```bash
npm install
```

### 3. إعداد Firebase

1. قم بإنشاء مشروع Firebase جديد على [console.firebase.google.com](https://console.firebase.google.com)
2. قم بتمكين المصادقة (البريد الإلكتروني/كلمة المرور، Google، المجهول)
3. قم بتمكين Firestore وStorage
4. قم بتحديث بيانات التكوين في `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 4. تشغيل خادم التطوير

```bash
# لتشغيل الخادم على المنفذ الافتراضي 3000
npm run dev

# لتشغيل الخادم على المنفذ 12000 مع إمكانية الوصول من أي عنوان IP
npm run dev:server

# لتشغيل الخادم المخصص (يدعم CORS وإطارات iframe)
node server.js
```

## هيكل المشروع

```
Bix/
├── public/                  # الملفات الثابتة
├── src/
│   ├── app/                 # صفحات التطبيق (Next.js App Router)
│   ├── components/          # مكونات التطبيق
│   └── lib/                 # المكتبات والخدمات
├── server.js                # خادم مخصص
├── next.config.js           # تكوين Next.js
└── package.json             # تبعيات المشروع
```

## دليل المكونات

### 1. نظام المصادقة

#### AuthProvider

يدير حالة المصادقة ويوفر معلومات المستخدم لجميع أنحاء التطبيق.

**الملف**: `src/components/auth/AuthProvider.tsx`

**الاستخدام**:
```tsx
// في layout.tsx
import AuthProvider from '@/components/auth/AuthProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

// في أي مكون
import { useAuth } from '@/components/auth/AuthProvider';

function MyComponent() {
  const { user, loading, isGuest } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? `مرحبًا ${user.displayName}` : 'الرجاء تسجيل الدخول'}
    </div>
  );
}
```

#### AuthForm

نموذج تسجيل الدخول والتسجيل.

**الملف**: `src/components/auth/AuthForm.tsx`

**الاستخدام**:
```tsx
import AuthForm from '@/components/auth/AuthForm';

function AuthPage() {
  return (
    <div>
      <h1>تسجيل الدخول</h1>
      <AuthForm />
    </div>
  );
}
```

### 2. نظام الفيديو

#### VideoCard

يعرض فيديو واحد مع معلوماته وأزرار التفاعل.

**الملف**: `src/components/video/VideoCard.tsx`

**الاستخدام**:
```tsx
import VideoCard from '@/components/video/VideoCard';

function MyComponent() {
  const video = {
    id: '1',
    username: 'user123',
    userImage: '/avatar.jpg',
    caption: 'وصف الفيديو',
    videoUrl: '/video.mp4',
    likes: 100,
    comments: 20,
    shares: 5
  };
  
  return (
    <VideoCard 
      video={video} 
      autoPlay={true}
      onVideoEnd={() => console.log('انتهى الفيديو')}
    />
  );
}
```

### 3. نظام الإشعارات

#### ToastManager

يدير حالة الإشعارات ويوفر واجهة برمجية لإظهار الإشعارات.

**الملف**: `src/components/layout/ToastManager.tsx`

**الاستخدام**:
```tsx
// في layout.tsx
import { ToastProvider } from '@/components/layout/ToastManager';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

// في أي مكون
import { useToast } from '@/components/layout/ToastManager';

function MyComponent() {
  const { showToast } = useToast();
  
  const handleClick = () => {
    showToast({
      type: 'success',
      title: 'تم بنجاح',
      message: 'تمت العملية بنجاح',
      duration: 3000
    });
  };
  
  return (
    <button onClick={handleClick}>إظهار الإشعار</button>
  );
}
```

## دليل API

### 1. Firebase API

#### المصادقة

```typescript
// تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// إنشاء حساب جديد
import { createUserWithEmailAndPassword } from 'firebase/auth';

const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

// تسجيل الدخول بحساب Google
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// تسجيل الخروج
import { signOut } from 'firebase/auth';

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
```

#### Firestore (قاعدة البيانات)

```typescript
// الحصول على وثيقة
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const getDocument = async (collection, id) => {
  try {
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

// إنشاء وثيقة جديدة
import { collection, addDoc } from 'firebase/firestore';

const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

// تحديث وثيقة
import { updateDoc } from 'firebase/firestore';

const updateDocument = async (collection, id, data) => {
  try {
    const docRef = doc(db, collection, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// حذف وثيقة
import { deleteDoc } from 'firebase/firestore';

const deleteDocument = async (collection, id) => {
  try {
    const docRef = doc(db, collection, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};
```

#### Storage (تخزين الملفات)

```typescript
// رفع ملف
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// حذف ملف
import { deleteObject } from 'firebase/storage';

const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
```

## أفضل الممارسات

### 1. إدارة الحالة

- استخدم React Context للحالة العامة مثل المصادقة والإشعارات
- استخدم React Hooks للحالة المحلية للمكونات
- استخدم Zustand للحالة المعقدة التي تحتاج إلى مشاركتها بين مكونات متعددة

### 2. الأداء

- استخدم `useMemo` و `useCallback` لتجنب إعادة الحسابات غير الضرورية
- استخدم `React.memo` لتجنب إعادة التصيير غير الضرورية للمكونات
- استخدم `IntersectionObserver` لتحميل المحتوى عند الطلب

### 3. الأمان

- لا تخزن بيانات حساسة في localStorage أو sessionStorage
- استخدم Firebase Authentication للمصادقة
- تحقق من صحة المدخلات باستخدام مكتبات مثل Zod

### 4. الاختبار

- اكتب اختبارات وحدة للمكونات والوظائف المهمة
- استخدم Jest و React Testing Library للاختبار
- اختبر سيناريوهات الخطأ والحالات الحدية

## استكشاف الأخطاء وإصلاحها

### 1. مشاكل المصادقة

- تأكد من تمكين مزودي المصادقة في لوحة تحكم Firebase
- تحقق من صحة بيانات اعتماد Firebase في `src/lib/firebase.ts`
- تحقق من سجلات وحدة التحكم في المتصفح للحصول على رسائل خطأ محددة

### 2. مشاكل عرض الفيديو

- تأكد من أن روابط الفيديو صالحة ويمكن الوصول إليها
- تحقق من دعم المتصفح لتنسيق الفيديو المستخدم
- استخدم `console.log` لتتبع دورة حياة الفيديو

### 3. مشاكل Next.js

- امسح ذاكرة التخزين المؤقت للمتصفح
- أعد تشغيل خادم التطوير
- تحقق من سجلات الخادم للحصول على رسائل خطأ

## الموارد

- [وثائق Next.js](https://nextjs.org/docs)
- [وثائق Firebase](https://firebase.google.com/docs)
- [وثائق React](https://reactjs.org/docs)
- [وثائق TypeScript](https://www.typescriptlang.org/docs)
- [وثائق Tailwind CSS](https://tailwindcss.com/docs)