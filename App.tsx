import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultViewer } from './components/ResultViewer';
import { generateTransformedImage } from './services/geminiService';
import { GeneratedImageResult } from './types';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<GeneratedImageResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((base64: string) => {
    setSelectedImage(base64);
    setResult(null); // Reset result when new image is selected
    setError(null);
  }, []);

  const handleGenerate = async () => {
    if (!selectedImage) {
      setError('الرجاء اختيار صورة أولاً.');
      return;
    }
    if (!prompt.trim()) {
      setError('الرجاء كتابة وصف للتعديل المطلوب.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedBase64 = await generateTransformedImage(selectedImage, prompt);
      setResult({
        original: selectedImage,
        generated: generatedBase64,
        prompt: prompt
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'حدث خطأ أثناء معالجة الصورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPrompt('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-50 selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <div className="space-y-12">
          
          {/* Section 1: Introduction */}
          <section className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 pb-2">
              حوّل صورك باستخدام الذكاء الاصطناعي
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              قم برفع صورة واكتب وصفاً للتعديل الذي تريده، وسيقوم النموذج المتطور بمعالجتها فوراً.
            </p>
          </section>

          {/* Section 2: Workspace */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Left Column (Desktop) / Top (Mobile): Input Controls */}
              <div className="space-y-6 order-2 lg:order-1">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 block">
                    1. اختر الصورة الأصلية
                  </label>
                  <ImageUploader 
                    onImageSelect={handleImageSelect} 
                    selectedImage={selectedImage}
                    onClear={() => handleImageSelect('')}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="prompt" className="text-sm font-medium text-slate-300 block">
                    2. صف التعديل المطلوب
                  </label>
                  <div className="relative">
                    <textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="مثال: اجعل الخلفية في الفضاء، حوّل الصورة لنمط كرتوني، أضف نظارات شمسية..."
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-32 leading-relaxed"
                    />
                    <div className="absolute bottom-3 left-3 text-slate-600 text-xs">
                      يدعم العربية والإنجليزية
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !selectedImage || !prompt}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98]
                    ${isLoading || !selectedImage || !prompt
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25'
                    }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      بدء التحويل
                    </>
                  )}
                </button>
              </div>

              {/* Right Column (Desktop) / Bottom (Mobile): Result Display */}
              <div className="order-1 lg:order-2 h-full min-h-[400px] bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-700 p-4 flex flex-col items-center justify-center relative overflow-hidden">
                {!result && !isLoading && !selectedImage && (
                  <div className="text-center text-slate-500 space-y-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>ستظهر النتيجة هنا</p>
                  </div>
                )}

                {isLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm p-6 text-center">
                     <div className="relative w-24 h-24 mb-4">
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/30 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
                     </div>
                     <p className="text-indigo-300 font-medium animate-pulse">جاري تحويل الصورة...</p>
                     <p className="text-slate-500 text-sm mt-2">قد يستغرق هذا بضع ثوانٍ</p>
                  </div>
                )}

                {selectedImage && !result && !isLoading && (
                   <img src={selectedImage} alt="Preview" className="max-h-[400px] w-auto rounded-lg shadow-lg object-contain" />
                )}

                {result && (
                  <ResultViewer result={result} onReset={handleReset} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Mohaweel AI. تم التطوير باستخدام React & Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;