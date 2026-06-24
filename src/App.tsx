import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import type { Freshman } from "./data/mockData";
import { mockFreshmen, mapSheetRecordToFreshman } from "./data/mockData";

// Extend global window interface for Google Identity Services SDK
declare global {
  interface Window {
    google: any;
  }
}

/**
 * Decodes a Google ID Token (JWT) in the frontend to extract payload claims (like email)
 * without requiring external decoders.
 */
const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

function App() {
  const [loggedInUser, setLoggedInUser] = useState<{ email: string } | null>(null);
  const [freshmen, setFreshmen] = useState<Freshman[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Fetch freshman data from Google Apps Script Web App or local mock fallback
  const fetchFreshmenData = async (token: string, email: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
    const isPlaceholderUrl = !appsScriptUrl || appsScriptUrl.includes("your-deployed-apps-script-id");
    
    if (isPlaceholderUrl) {
      // Simulate API load from local mock data
      console.log("Mock data fallback active (VITE_APPS_SCRIPT_URL not configured)");
      setTimeout(() => {
        const matches = mockFreshmen.filter(
          (nong) => nong.pDocchula.toLowerCase().trim() === email.toLowerCase().trim()
        );
        setFreshmen(matches);
        setLoggedInUser({ email });
        setIsLoading(false);
      }, 800);
      return;
    }
    
    try {
      const response = await fetch(`${appsScriptUrl}?id_token=${token}`);
      const result = await response.json();
      
      if (result.success) {
        // Map Google Sheet raw rows to Freshman typescript objects
        const mapped = (result.data || []).map((record: any, index: number) => 
          mapSheetRecordToFreshman(record, index)
        );
        setFreshmen(mapped);
        setLoggedInUser({ email: result.email });
      } else {
        setErrorMessage(result.error || "เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
      // Fallback to local mock data if the Apps Script URL fails or triggers CORS
      const matches = mockFreshmen.filter(
        (nong) => nong.pDocchula.toLowerCase().trim() === email.toLowerCase().trim()
      );
      setFreshmen(matches);
      setLoggedInUser({ email });
      setErrorMessage("⚠️ เชื่อมต่อ API ไม่สำเร็จ กำลังเข้าสู่ระบบด้วยโหมดออฟไลน์ (ข้อมูลจำลอง)");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Load Google Identity Services script and render Sign-In button
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const isPlaceholderClientId = !clientId || clientId.includes("your-google-oauth-client-id");
    
    // Do not load Sign-in script if already logged in
    if (loggedInUser) return;
    
    const scriptId = "google-gsi-client-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const renderGoogleButton = () => {
      const btnContainer = document.getElementById("google-signin-button-container");
      if (btnContainer && window.google) {
        const isDarkMode = mediaQuery.matches;
        window.google.accounts.id.renderButton(btnContainer, {
          theme: isDarkMode ? "filled_black" : "outline",
          size: "large",
          shape: "pill",
          width: 320
        });
      }
    };

    const initGoogleSignIn = () => {
      if (isPlaceholderClientId) {
        console.warn("VITE_GOOGLE_CLIENT_ID not configured in .env file.");
        const container = document.getElementById("google-signin-button-container");
        if (container) {
          container.innerHTML = `
            <div style="color: var(--text-secondary); font-size: 0.9rem; padding: 0.8rem; border: 1px dashed var(--card-border); border-radius: 12px; width: 100%; text-align: center; background: rgba(223, 42, 93, 0.03);">
              🔒 Google Sign-In Not Configured (.env)
              <div style="font-size: 0.75rem; color: var(--text-light); margin-top: 0.35rem;">กรุณาคลิกเลือก "Demo Mode" ด้านล่างเพื่อเข้าทดสอบทดลองใช้</div>
            </div>
          `;
        }
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          hd: "docchula.com", // Restricts Google Account Picker to @docchula.com domain
          callback: (response: any) => {
            const payload = decodeJwt(response.credential);
            if (payload && payload.email) {
              const email = payload.email.toLowerCase().trim();
              if (email.endsWith("@docchula.com")) {
                fetchFreshmenData(response.credential, email);
              } else {
                setErrorMessage("เข้าสู่ระบบไม่สำเร็จ: กรุณาใช้อีเมลคณะแพทย์ (@docchula.com) เท่านั้น");
              }
            } else {
              setErrorMessage("ไม่สามารถดึงข้อมูลอีเมลผู้ใช้จากบัญชี Google ได้");
            }
          }
        });
        
        renderGoogleButton();
      } catch (err) {
        console.error("Google SSO initialization error:", err);
      }
    };

    const handleThemeChange = () => {
      if (window.google && !isPlaceholderClientId) {
        renderGoogleButton();
      }
    };

    mediaQuery.addEventListener("change", handleThemeChange);

    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.id = scriptId;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google) {
          initGoogleSignIn();
        }
      };
      document.body.appendChild(script);
    } else if (window.google) {
      initGoogleSignIn();
    }

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, [loggedInUser]);

  const handleSignOut = () => {
    setLoggedInUser(null);
    setFreshmen([]);
    setErrorMessage(null);
  };

  return (
    <div className="app-container">
      {loggedInUser ? (
        <Dashboard 
          freshmen={freshmen} 
          email={loggedInUser.email} 
          onSignOut={handleSignOut} 
        />
      ) : (
        <LandingPage 
          isLoading={isLoading} 
          errorMessage={errorMessage} 
        />
      )}
    </div>
  );
}

export default App;
