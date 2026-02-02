# Mohaweel AI - محول الصور الذكي

تطبيق ويب حديث لتحويل وتعديل الصور باستخدام الذكاء الاصطناعي (Gemini 2.5 Flash Model).

## طريقة التشغيل محلياً (Local Development)

1. تأكد من تثبيت Node.js.
2. قم بتثبيت الحزم:
   ```bash
   npm install
   ```
3. قم بإنشاء ملف `.env` في المجلد الرئيسي وأضف مفتاح API الخاص بك:
   ```env
   API_KEY=your_gemini_api_key_here
   ```
4. شغل المشروع:
   ```bash
   npm run dev
   ```

## طريقة النشر على Vercel

1. ارفع المشروع على حسابك في **GitHub**.
2. اذهب إلى **Vercel** وأنشئ مشروع جديد (New Project).
3. اختر المستودع (Repository) الذي قمت برفعه.
4. سيقوم Vercel باكتشاف إعدادات Vite تلقائياً (Framework Preset: Vite).
5. **خطوة هامة جداً**: في قسم **Environment Variables**، أضف المتغير التالي:
   - **Name**: `API_KEY`
   - **Value**: (ضع مفتاح Gemini API الخاص بك هنا)
6. اضغط **Deploy**.

## التقنيات المستخدمة
- React 18
- Vite
- Tailwind CSS
- Google GenAI SDK (Gemini 2.5 Flash)
