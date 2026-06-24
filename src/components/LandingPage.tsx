import React from "react";

interface LandingPageProps {
  isLoading: boolean;
  errorMessage: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  isLoading, 
  errorMessage 
}) => {
  return (
    <div className="landing-wrapper">
      {/* Decorative background items */}
      <div className="blur-circle circle-1"></div>
      <div className="blur-circle circle-2"></div>

      <div className="landing-card">
        <div className="camp-badge">MDCU FRESHY CAMP 2026</div>
        
        <h1 className="landing-title">จดหมายถึงพี่รหัส</h1>
        
        <p className="landing-subtitle">
          ระบบส่องความโปรด ข้อความ และรายละเอียดสิ่งของที่น้องรหัสชื่นชอบ 
          กรุณาเข้าสู่ระบบด้วยบัญชี Google คณะแพทย์ (@docchula.com) 
          เพื่อความปลอดภัยของข้อมูลตามนโยบาย PDPA 🛡️
        </p>

        {/* Error message banner */}
        {errorMessage && (
          <div className="error-banner" style={{ marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading ? (
          <div key="loading-state" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", margin: "2rem 0" }}>
            <div className="spinner"></div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>กำลังดึงข้อมูลน้องรหัส...</p>
          </div>
        ) : (
          <div key="signin-state" className="google-signin-container-wrapper">
            {/* Target container where Google Client SDK will inject the official button */}
            <div 
              id="google-signin-button-container" 
              style={{ 
                display: "flex", 
                justifyContent: "center", 
                width: "100%",
                minHeight: "44px"
              }}
            ></div>

            {/* Explanatory text under the official button */}
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, textAlign: "center" }}>
              * ข้อมูลน้องรหัสจะแสดงเฉพาะสายรหัสของพี่ที่เข้าสู่ระบบเท่านั้น
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
