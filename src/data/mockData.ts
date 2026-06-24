export interface Freshman {
  id: string;
  pDocchula: string;
  kinshipId: string;
  pNickname: string;
  title: string;
  firstName: string;
  lastName: string;
  nickname: string;
  house: string;
  instagram: string;
  messageToP: string;
  favoriteFoods: string;
  interests: string;
  allergies: string;
  profileColor?: string;
}

/**
 * Normalizes an Instagram username by stripping '@', trimming whitespace,
 * and converting it to lowercase for URLs to ensure clickable links function correctly.
 */
export function getInstagramLink(igInput: string): string {
  if (!igInput) return "";
  let username = igInput.trim();
  if (username.startsWith("@")) {
    username = username.substring(1);
  }
  // Convert to lowercase for standard Instagram profile URL paths
  username = username.toLowerCase();
  return `https://instagram.com/${username}`;
}

/**
 * Standardizes an Instagram username for display (prefixed with '@').
 */
export function formatInstagramDisplay(igInput: string): string {
  if (!igInput) return "";
  let username = igInput.trim();
  if (username.startsWith("@")) {
    username = username.substring(1);
  }
  return `@${username}`;
}

/**
 * Maps a raw record from the Google Apps Script Web App (matching Sheet header names)
 * into a structured Freshman interface.
 */
export function mapSheetRecordToFreshman(record: any, index: number): Freshman {
  const profileColors = [
    "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
    "linear-gradient(135deg, #F35588 0%, #FF8FA3 100%)",
    "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    "linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)",
    "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)"
  ];

  return {
    id: record.id || `freshman-${index}`,
    pDocchula: record["P_Docchula"] || "",
    kinshipId: String(record["สายรหัส"] || ""),
    pNickname: record["P_Nickname"] || "",
    title: record["คำนำหน้า"] || "",
    firstName: record["ชื่อ"] || "",
    lastName: record["นามสกุล"] || "",
    nickname: record["ชื่อเล่น"] || "",
    house: String(record["บ้าน"] || ""),
    instagram: record["N_Instagram"] || "",
    messageToP: record["อยากฝากบอกอะไรพี่รหัสไหมเอ่ย?"] || "",
    favoriteFoods: record["อาหาร/ขนมที่น้องชอบทาน"] || "",
    interests: record["ของที่น้องชอบ/อยากได้/ความชอบ/ความสนใจ"] || "",
    allergies: record["ข้อจำกัดด้านอาหาร"] || "",
    profileColor: profileColors[index % profileColors.length]
  };
}

export const mockFreshmen: Freshman[] = [
  {
    id: "1",
    pDocchula: "kanokpitch.tbd@docchula.com",
    kinshipId: "1",
    pNickname: "ฟ้าใส",
    title: "นางสาว",
    firstName: "กชพร",
    lastName: "ดีมีชัย",
    nickname: "บัว",
    house: "8",
    instagram: "BuaBua_", // Testing capitalization neutralization
    messageToP: "รอเจอพี่รหัสนะคะ ฝากตัวด้วยค่ะ🌸",
    favoriteFoods: "ชาบู, ขนมปังนมโสดนูเทลล่า afteryou",
    interests: "popmart (Hirono Dimoo)",
    allergies: "-",
    profileColor: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)"
  },
  {
    id: "2",
    pDocchula: "kamonsinarojnd@docchula.com",
    kinshipId: "2",
    pNickname: "หนูดี",
    title: "นาย",
    firstName: "กรณ์",
    lastName: "ดาราวร",
    nickname: "กรณ์",
    house: "4",
    instagram: "@ko._.rn", // Testing '@' neutralization
    messageToP: "ขอบคุณสำหรับการ์ดครับ พี่เขียนยาวมาก พี่ชื่อแจกันหรอ",
    favoriteFoods: "ขนมปัง sunmoulin",
    interests: "พี่ว่าผมชอบอะไรผมชอบอันนั้นครับ",
    allergies: "-",
    profileColor: "linear-gradient(135deg, #F35588 0%, #FF8FA3 100%)"
  },
  {
    id: "3",
    pDocchula: "korn.supraphakorn@docchula.com",
    kinshipId: "3",
    pNickname: "กร",
    title: "นางสาว",
    firstName: "กรวรรณ",
    lastName: "อนันต์ธนถาวร",
    nickname: "แก้ม",
    house: "5",
    instagram: "01grfebm",
    messageToP: "รอเจอพี่รหัสอยู่นะคะ😊",
    favoriteFoods: "ชาเขียว, ซูชิ",
    interests: "tattoo colour, ตุ๊กตาcrybaby",
    allergies: "-",
    profileColor: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
  },
  {
    id: "4",
    pDocchula: "korrapat@docchula.com", // Senior with multiple nongs (Nong 1)
    kinshipId: "4",
    pNickname: "กร",
    title: "นาย",
    firstName: "กฤตภาส",
    lastName: "เศรษฐโชติก",
    nickname: "วิน",
    house: "8",
    instagram: "_ks_win",
    messageToP: "ใบ้ผมเพิ่มหน่อยได้ไหมครับ ยังเดาไม่ออกเลย 5555",
    favoriteFoods: "มัทฉะ/ชานมไข่มุก/วาราบิโมจิ",
    interests: "โคนัน/Doraemon",
    allergies: "ม่ายค่อยมี",
    profileColor: "linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)"
  },
  {
    id: "5",
    pDocchula: "korrapat@docchula.com", // Senior with multiple nongs (Nong 2)
    kinshipId: "4",
    pNickname: "กร",
    title: "นาย",
    firstName: "กฤตเมธ",
    lastName: "อังกูลภักดีกุล",
    nickname: "ข้าวกล้อง",
    house: "8",
    instagram: "@KaoKong_Krittamet", // Testing '@' and capitalization
    messageToP: "สวัสดีค้าบบ :)",
    favoriteFoods: "ไอศครีม, คุกกี้",
    interests: "ชอบเล่นเกม (เช่น Overwatch, Minecraft ฯลฯ), ตุ๊กตาน่ารักๆ, อาหารอร่อยๆ",
    allergies: "-",
    profileColor: "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)"
  },
  {
    id: "6",
    pDocchula: "krittapas2700@docchula.com",
    kinshipId: "6",
    pNickname: "แม็กนั่ม",
    title: "นาย",
    firstName: "กฤติเดช",
    lastName: "องอาจเดชาชัย",
    nickname: "เจเปน",
    house: "12",
    instagram: "jpbolii_",
    messageToP: "ขอบคุณครับ",
    favoriteFoods: "ชาเขียว",
    interests: "อะไรก็ได้ครับ",
    allergies: "-",
    profileColor: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)"
  },
  {
    id: "7",
    pDocchula: "krib.rue@docchula.com",
    kinshipId: "7",
    pNickname: "กิต",
    title: "นาย",
    firstName: "กฤติพัฒน์",
    lastName: "จันทะคาด",
    nickname: "ปลื้ม",
    house: "7",
    instagram: "mmmmmomomamaa",
    messageToP: "yo เจอกัน p",
    favoriteFoods: "คุ้กกี้อาร์เซนอล",
    interests: "ปากกาเขียนดีๆครับ😉",
    allergies: "ไม่ทานเผ็ด",
    profileColor: "linear-gradient(135deg, #F35588 0%, #FF8FA3 100%)"
  }
];
