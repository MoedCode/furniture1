"use client";

import { Truck, Package, Home, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function Loading() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Package, text: "جاري تعبئة أغراضك..." },
    { icon: Truck, text: "جاري تحميل الشاحنة..." },
    { icon: Home, text: "أوشكنا على الوصول..." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <html lang="">
      <body>
          <div
      className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-blue-50 to-orange-50"
      dir="rtl"
    >
      <div className="relative mb-8">
        {/* Main truck animation */}
        <div className="relative">
          <Truck className="h-16 w-16 text-blue-600 animate-bounce scale-x-[-1]" />
          <div className="absolute -top-2 -left-2">
            <Package className="h-6 w-6 text-orange-500 animate-pulse" />
          </div>
        </div>

        {/* Moving dots animation */}
        <div className="flex gap-2 mt-2 justify-center space-x-reverse">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      </div>

      
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-arabic">السلام لنقل الاثاث</h2>
        <p className="text-gray-600 font-arabic">نجعل انتقالك سهلاً وخالياً من التوتر</p>
      </div>

      <style jsx>{`
               
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>  
      </body>
    </html>
  );
}
