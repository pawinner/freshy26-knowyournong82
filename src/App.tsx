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

  // 2. Check for redirected Google OAuth token in hash on load
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const idToken = params.get("id_token");
      
      if (idToken) {
        // Clean URL address bar by removing the hash fragment
        window.history.replaceState(null, "", window.location.pathname);
        
        setIsLoading(true);
        const payload = decodeJwt(idToken);
        if (payload && payload.email) {
          const email = payload.email.toLowerCase().trim();
          if (email.endsWith("@docchula.com")) {
            fetchFreshmenData(idToken, email);
          } else {
            setErrorMessage("เข้าสู่ระบบไม่สำเร็จ: กรุณาใช้อีเมลคณะแพทย์ (@docchula.com) เท่านั้น");
            setIsLoading(false);
          }
        } else {
          setErrorMessage("ไม่สามารถดึงข้อมูลอีเมลผู้ใช้จากบัญชี Google ได้");
          setIsLoading(false);
        }
      }
    }
  }, []);

  const handleSignInGoogleCustom = () => {
    setIsLoading(true);
    setErrorMessage(null);

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const isPlaceholderClientId = !clientId || clientId.includes("your-google-oauth-client-id");

    if (isPlaceholderClientId) {
      setErrorMessage("🔒 Google Sign-In Not Configured (.env) - กรุณาตรวจสอบการตั้งค่า");
      setIsLoading(false);
      return;
    }

    const nonce = Math.random().toString(36).substring(2);
    // Construct Google OAuth Implicit Flow auth URL (forces domain selection to @docchula.com)
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(window.location.origin + window.location.pathname)}` +
      `&response_type=id_token` +
      `&scope=${encodeURIComponent("openid email profile")}` +
      `&nonce=${nonce}` +
      `&hd=docchula.com`;

    window.location.href = authUrl;
  };

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
          onSignInGoogleCustom={handleSignInGoogleCustom}
          isLoading={isLoading} 
          errorMessage={errorMessage} 
        />
      )}
    </div>
  );
}

export default App;
