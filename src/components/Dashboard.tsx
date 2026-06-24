import React, { useState } from "react";
import type { Freshman } from "../data/mockData";
import { NongCard } from "./NongCard";

interface DashboardProps {
  freshmen: Freshman[];
  email: string;
  onSignOut: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ freshmen, email, onSignOut }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Extract senior's nickname (from the first freshman record, or fallback to email username)
  const seniorNickname = freshmen[0]?.pNickname || email.split("@")[0];

  const hasMultipleNongs = freshmen.length > 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh" }}>
      {/* Sticky Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <span className="logo-badge">MDCU</span>
            <span className="logo-text">จดหมายถึงพี่รหัส</span>
          </div>
          
          <div className="user-profile-bar">
            <span className="kinship-group-badge">
              สายรหัส: {freshmen[0]?.kinshipId || "N/A"}
            </span>
            <button className="btn-logout" onClick={onSignOut}>
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main" style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        {/* Welcome Section */}
        <div className="dashboard-intro" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🌸</div>
          <h2>ยินดีต้อนรับ พี่{seniorNickname}!</h2>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            เข้าสู่ระบบสำเร็จด้วยอีเมล: <span style={{ fontFamily: "var(--font-heading)", fontWeight: 500 }}>{email}</span>
          </p>
        </div>

        {/* UI Decision Logic based on number of Nongs */}
        {freshmen.length === 0 ? (
          /* Case 0: No freshmen found */
          <div className="no-results" style={{ padding: "3rem 2rem" }}>
            <svg 
              style={{ width: "64px", height: "64px", color: "var(--primary)", marginBottom: "1.5rem" }} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.75rem" }}>ไม่พบข้อมูลน้องรหัสในระบบ</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "0.95rem" }}>
              ขออภัยด้วยครับ อีเมลของคุณยังไม่พบความเชื่อมโยงกับน้องรหัสคนใดในขณะนี้ 
              <br />
              กรุณาแจ้งฝ่ายลงทะเบียนแคมป์เพื่ออัปเดตข้อมูลใน Google Sheet หรือตรวจสอบให้แน่ใจว่าได้ใช้บัญชี `@docchula.com` ที่ถูกต้อง
            </p>
          </div>
        ) : (
          /* Case 1+: Freshmen found */
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Multiple Nongs Selector (Tab Bar) */}
            {hasMultipleNongs && (
              <div 
                style={{ 
                  display: "flex", 
                  background: "rgba(100, 116, 139, 0.05)", 
                  padding: "0.4rem", 
                  borderRadius: "14px",
                  border: "1px solid var(--card-border)"
                }}
              >
                {freshmen.map((nong, index) => (
                  <button
                    key={nong.id}
                    onClick={() => setActiveTab(index)}
                    style={{
                      flex: 1,
                      padding: "0.85rem",
                      borderRadius: "10px",
                      border: "none",
                      background: activeTab === index ? "var(--primary)" : "transparent",
                      color: activeTab === index ? "white" : "var(--text-secondary)",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.95rem",
                      transition: "all 0.25s ease"
                    }}
                  >
                    น้องคนที่ {index + 1}: น้อง{nong.nickname}
                  </button>
                ))}
              </div>
            )}

            {/* Immersive Nong Card Container */}
            <div className="single-nong-container">
              <NongCard nong={freshmen[activeTab]} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
