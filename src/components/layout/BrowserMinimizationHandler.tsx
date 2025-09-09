"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sticker, RefreshCw } from "lucide-react";

export function BrowserMinimizationHandler() {
  const [showPopup, setShowPopup] = useState(false);
  const [wasMinimized, setWasMinimized] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Browser was minimized or tab lost focus
        console.log("🔍 Browser minimized or lost focus - marking for popup");
        setWasMinimized(true);
      } else if (document.visibilityState === "visible" && wasMinimized) {
        // Browser was restored and we had previously minimized it
        console.log("🔍 Browser restored after minimization - showing popup");
        setShowPopup(true);
      }
    };

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Also listen for window focus/blur events as backup
    const handleWindowBlur = () => {
      console.log("🔍 Window lost focus - marking for popup");
      setWasMinimized(true);
    };

    const handleWindowFocus = () => {
      if (wasMinimized) {
        console.log("🔍 Window regained focus after blur - showing popup");
        setShowPopup(true);
      }
    };

    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [wasMinimized]);

  const handleRefresh = () => {
    console.log("🔍 User clicked refresh - reloading page");
    window.location.reload();
  };

  // Don't render anything if popup is not shown
  if (!showPopup) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-2 border-green-200">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Sticker className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Poxa vida, atualiza pra gente?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 leading-relaxed">
            O seu navegador perdeu o foco. Por favor, atualize a página para
            continuar.
          </p>
          <Button
            onClick={handleRefresh}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            size="lg"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Atualizar página
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
