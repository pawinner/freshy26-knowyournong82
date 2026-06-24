import React, { useState } from "react";

interface LandingPageProps {
  onSignInMock: (email: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onSignInMock, 
  isLoading, 
  errorMessage 
}) => {
  const [showDemo, setShowDemo] = useState(false);

  // List of test emails matching our spreadsheet mock cases
  const demoSeniors = [
    { email: "kanokpitch.tbd@docchula.com", desc: "พี่ฟ้าใส (มีน้องรหัส 1 คน: น้องบัว)" },
    { email: "korrapat@docchula.com", desc: "พี่กร (มีน้องรหัส 2 คน: น้องวิน, น้องข้าวกล้อง)" },
    { email: "krittapas2700@docchula.com", desc: "พี่แม็กนั่ม (มีน้องรหัส 1 คน: น้องเจเปน)" },
    { email: "invalid@docchula.com", desc: "ทดสอบบัญชีไม่มีน้องรหัสในระบบ" },
    { email: "stranger@gmail.com", desc: "ทดสอบบัญชีทั่วไป (บล็อกอีเมลทั่วไป)" }
  ];

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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", margin: "2rem 0" }}>
            <div className="spinner"></div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>กำลังดึงข้อมูลน้องรหัส...</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Target container where Google Client SDK will inject the official button */}
            <div 
              id="google-signin-button-container" 
              style={{ 
                display: "flex", 
                justifyContent: "center", 
                margin: "0.5rem 0",
                minHeight: "44px"
              }}
            ></div>

            {/* Explanatory text under the official button */}
            <p style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>
              * ข้อมูลน้องรหัสจะแสดงเฉพาะสายรหัสของพี่ที่เข้าสู่ระบบเท่านั้น
            </p>
          </div>
        )}

        {/* Developer / Testing Bypass Panel */}
        <div 
          style={{ 
            marginTop: "3rem", 
            paddingTop: "1.5rem", 
            borderTop: "1px dashed var(--card-border)",
            textAlign: "left"
          }}
        >
          <button 
            onClick={() => setShowDemo(!showDemo)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--primary)",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              margin: "0 auto"
            }}
          >
            {showDemo ? "隐藏" : "🧪 คลิกเพื่อแสดงระบบจำลอง / Demo Mode (ทดสอบ)"} {showDemo ? "▲" : "▼"}
          </button>

          {showDemo && (
            <div 
              style={{ 
                marginTop: "1rem", 
                background: "rgba(100, 116, 139, 0.05)", 
                padding: "1rem", 
                borderRadius: "12px",
                border: "1px solid var(--card-border)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}
            >
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                เลือกบัญชีจำลองด้านล่างเพื่อจำลองพฤติกรรมของระบบ:
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {demoSeniors.map((senior) => (
                  <button
                    key={senior.email}
                    onClick={() => onSignInMock(senior.email)}
                    style={{
                      padding: "0.6rem 0.8rem",
                      borderRadius: "8px",
                      border: "1px solid var(--card-border)",
                      background: "var(--card-bg)",
                      color: "var(--text-primary)",
                      textAlign: "left",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                    onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
                  >
                    <div style={{ fontWeight: 600 }}>{senior.email}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                      {senior.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
