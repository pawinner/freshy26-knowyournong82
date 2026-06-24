import React from "react";
import type { Freshman } from "../data/mockData";
import { getInstagramLink, formatInstagramDisplay } from "../data/mockData";

interface NongCardProps {
  nong: Freshman;
}

export const NongCard: React.FC<NongCardProps> = ({ nong }) => {
  // Extract initial for avatar placeholder
  const avatarLetter = nong.nickname.charAt(0);

  // Check if freshman has food restrictions / allergies
  const hasAllergies = nong.allergies && 
    nong.allergies.toLowerCase() !== "none" && 
    nong.allergies !== "ไม่มี" && 
    nong.allergies !== "ไม่มีอาการแพ้" && 
    nong.allergies.trim() !== "-";

  // Combine title, first name, and last name
  const fullName = `${nong.title || ""}${nong.firstName || ""} ${nong.lastName || ""}`.trim();

  // Neutralize Instagram
  const igLink = getInstagramLink(nong.instagram);
  const igDisplay = formatInstagramDisplay(nong.instagram);

  return (
    <div className="nong-card">
      {/* Kinship Code Badge */}
      <span className="nong-kinship-tag">สาย {nong.kinshipId}</span>

      {/* Header Info */}
      <div className="card-header-info">
        <div 
          className="nong-avatar" 
          style={{ background: nong.profileColor || "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)" }}
        >
          {avatarLetter}
        </div>
        <div className="nong-name-block">
          <h3 className="nong-nickname">น้อง{nong.nickname}</h3>
          <span className="nong-fullname">{fullName} (MDCU 82)</span>
        </div>
      </div>

      {/* Details Row: House and Instagram */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {nong.house && (
          <div className="contact-link" style={{ cursor: "default" }}>
            <span style={{ fontWeight: 600, color: "var(--primary)" }}>🏠 บ้าน:</span>
            <span style={{ color: "var(--text-primary)" }}>{nong.house}</span>
          </div>
        )}
        
        {nong.instagram && (
          <a 
            href={igLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="contact-link"
          >
            <svg style={{ width: "16px", height: "16px" }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m8.4 2.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9m0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
            </svg>
            {igDisplay}
          </a>
        )}
      </div>

      {/* Favorite Foods */}
      <div className="card-section">
        <span className="section-label">
          🍱 อาหาร/ขนมที่ชอบทาน
        </span>
        <p className="section-value">{nong.favoriteFoods || "ไม่ได้ระบุ"}</p>
      </div>

      {/* Allergies / Restrictions */}
      <div className="card-section">
        <span className="section-label">
          ⚠️ ข้อจำกัดด้านอาหาร
        </span>
        <div className="badge-container">
          {hasAllergies ? (
            <span className="badge badge-allergy">
              {nong.allergies}
            </span>
          ) : (
            <span className="badge badge-allergy none">
              ไม่มีข้อจำกัดด้านอาหาร
            </span>
          )}
        </div>
      </div>

      {/* Interests / Hobbies */}
      <div className="card-section">
        <span className="section-label">
          🎨 ของที่น้องชอบ / อยากได้ / ความชอบ / ความสนใจ
        </span>
        <p className="section-value">{nong.interests || "ไม่ได้ระบุ"}</p>
      </div>

      {/* Message to P'Rahas (with pre-wrap newlines) */}
      <div className="card-section">
        <span className="section-label">
          ✉️ อยากฝากบอกอะไรพี่รหัสไหมเอ่ย?
        </span>
        <div className="message-container">
          <p className="message-text">{nong.messageToP || "น้องไม่ได้ฝากข้อความไว้"}</p>
        </div>
      </div>
    </div>
  );
};
