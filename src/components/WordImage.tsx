import React, { useState } from 'react';
import { WordItem } from '../types';

interface WordImageProps {
  word: WordItem;
  className?: string;
  alt?: string;
}

export const WordImage: React.FC<WordImageProps> = ({ word, className = '', alt }) => {
  const [imgError, setImgError] = useState(false);
  const wordLower = (word?.word || '').trim().toLowerCase();

  // 1. Render custom high-detail vector SVG for words that need 100% visual clarity
  const renderVectorIllustration = () => {
    switch (wordLower) {
      // --- Body Parts (身体部位 - 必须极其精准无歧义) ---
      case 'ear':
      case 'ears':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FFF4EB" />
            {/* Cute Ear Diagram */}
            <path d="M45 25C65 20 85 35 85 55C85 70 75 80 70 90C65 100 50 102 42 94C35 86 38 72 45 68C52 64 65 65 65 52C65 42 55 35 45 40" stroke="#FF8A3D" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="#FFE5D3" />
            <path d="M52 48C58 45 62 50 60 56C58 60 50 64 48 70" stroke="#FF8A3D" strokeWidth="5" strokeLinecap="round" />
            <circle cx="95" cy="40" r="3" fill="#FFB800" />
            <circle cx="102" cy="50" r="2" fill="#FFB800" />
            <circle cx="98" cy="62" r="2.5" fill="#FFB800" />
          </svg>
        );

      case 'eye':
      case 'eyes':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#EFF8FF" />
            {/* Eye Shape */}
            <path d="M15 60C30 35 90 35 105 60C90 85 30 85 15 60Z" fill="#FFFFFF" stroke="#0084FF" strokeWidth="6" strokeLinejoin="round" />
            {/* Iris */}
            <circle cx="60" cy="60" r="22" fill="#38BDF8" />
            {/* Pupil */}
            <circle cx="60" cy="60" r="13" fill="#0F172A" />
            {/* Light Reflection */}
            <circle cx="54" cy="54" r="5" fill="#FFFFFF" />
            <circle cx="67" cy="67" r="2" fill="#FFFFFF" />
            {/* Eyelashes */}
            <path d="M40 38L34 26M60 34L60 22M80 38L86 26" stroke="#0084FF" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'nose':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FFF0F5" />
            {/* Nose Bridge and Nostrils */}
            <path d="M52 25C54 45 42 68 38 78C35 85 40 92 50 92C56 92 64 92 70 92C80 92 85 85 82 78C78 68 66 45 68 25" stroke="#FF6B8B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="#FFE4EC" />
            {/* Nostril details */}
            <ellipse cx="48" cy="84" rx="4" ry="3" fill="#E11D48" />
            <ellipse cx="72" cy="84" rx="4" ry="3" fill="#E11D48" />
            {/* Sparkles */}
            <path d="M92 35L95 42L102 45L95 48L92 55L89 48L82 45L89 42L92 35Z" fill="#FFB800" />
          </svg>
        );

      case 'mouth':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FFF1F2" />
            {/* Happy smiling mouth */}
            <path d="M22 52C22 52 40 92 60 92C80 92 98 52 98 52C98 52 80 62 60 62C40 62 22 52 22 52Z" fill="#E11D48" stroke="#BE123C" strokeWidth="5" strokeLinejoin="round" />
            {/* White Teeth */}
            <path d="M36 57C45 62 55 64 60 64C65 64 75 62 84 57C82 66 74 72 60 72C46 72 38 66 36 57Z" fill="#FFFFFF" />
            {/* Cute Tongue */}
            <path d="M48 80C52 86 68 86 72 80C70 74 50 74 48 80Z" fill="#FDA4AF" />
            {/* Dimples */}
            <path d="M18 48C18 54 22 58 24 58" stroke="#FB7185" strokeWidth="4" strokeLinecap="round" />
            <path d="M102 48C102 54 98 58 96 58" stroke="#FB7185" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'arm':
      case 'arms':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FFFBEB" />
            {/* Muscular Arm Bicep */}
            <path d="M25 75C25 55 35 32 52 30C65 28 72 38 78 48C84 58 98 58 98 72C98 84 86 92 72 88C58 84 45 90 32 90C25 90 25 82 25 75Z" fill="#FDE68A" stroke="#D97706" strokeWidth="6" strokeLinejoin="round" />
            {/* Bicep muscle line */}
            <path d="M50 48C58 44 65 52 68 62" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
            {/* Fist */}
            <circle cx="92" cy="65" r="12" fill="#FDE68A" stroke="#D97706" strokeWidth="5" />
            {/* Strength stars */}
            <path d="M22 28L25 34L31 36L25 38L22 44L19 38L13 36L19 34L22 28Z" fill="#F59E0B" />
          </svg>
        );

      case 'hand':
      case 'hands':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FFF7ED" />
            {/* 5-Finger Open Hand Palm */}
            <path d="M38 95L38 68C38 62 30 62 30 68L30 82C24 82 20 76 22 70L28 48C30 42 38 42 40 48L42 30C42 24 50 24 50 30L50 48L52 22C52 16 60 16 60 22L60 48L62 26C62 20 70 20 70 26L70 52L72 38C72 32 80 32 80 38L80 70C80 88 68 98 48 98L38 95Z" fill="#FED7AA" stroke="#EA580C" strokeWidth="5" strokeLinejoin="round" />
            {/* Palm line */}
            <path d="M45 68C55 72 65 68 70 60" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'leg':
      case 'legs':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#F0FDF4" />
            {/* Legs with shorts and shoes */}
            <path d="M35 20L85 20L80 50L60 50L60 25L40 50L35 20Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="4" />
            {/* Left Leg */}
            <path d="M42 50L44 88L56 88L54 50" fill="#BBF7D0" stroke="#16A34A" strokeWidth="4" />
            <path d="M40 88H60V98H36C36 92 40 88 40 88Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="4" strokeLinejoin="round" />
            {/* Right Leg */}
            <path d="M66 50L68 88L80 88L78 50" fill="#BBF7D0" stroke="#16A34A" strokeWidth="4" />
            <path d="M64 88H84V98H60C60 92 64 88 64 88Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="4" strokeLinejoin="round" />
          </svg>
        );

      case 'foot':
      case 'feet':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FEFCE8" />
            {/* Foot Sole Profile */}
            <path d="M45 20C55 20 58 35 58 55C58 75 75 80 92 82C96 85 96 92 90 95C75 98 40 98 32 88C24 78 28 40 32 30C35 20 40 20 45 20Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="5" strokeLinejoin="round" />
            {/* 5 Toes */}
            <circle cx="88" cy="74" r="5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
            <circle cx="82" cy="68" r="4.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
            <circle cx="76" cy="64" r="4" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
            <circle cx="70" cy="62" r="3.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
            <circle cx="64" cy="61" r="3" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
          </svg>
        );

      case 'head':
      case 'face':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#EFF6FF" />
            {/* Head circle */}
            <circle cx="60" cy="62" r="36" fill="#FED7AA" stroke="#EA580C" strokeWidth="5" />
            {/* Hair */}
            <path d="M26 52C24 35 40 22 60 22C80 22 96 35 94 52C88 42 75 42 60 42C45 42 32 42 26 52Z" fill="#475569" />
            {/* Eyes */}
            <circle cx="48" cy="58" r="4" fill="#0F172A" />
            <circle cx="72" cy="58" r="4" fill="#0F172A" />
            {/* Smile */}
            <path d="M50 74C55 80 65 80 70 74" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
            {/* Cheeks */}
            <circle cx="42" cy="68" r="4" fill="#FDA4AF" />
            <circle cx="78" cy="68" r="4" fill="#FDA4AF" />
          </svg>
        );

      // --- Actions & Social (动作与品格) ---
      case 'smile':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FEF9C3" />
            <circle cx="60" cy="60" r="42" fill="#FACC15" stroke="#CA8A04" strokeWidth="5" />
            {/* Happy crescent eyes */}
            <path d="M42 50C42 42 52 42 52 50" stroke="#713F12" strokeWidth="4" strokeLinecap="round" />
            <path d="M68 50C68 42 78 42 78 50" stroke="#713F12" strokeWidth="4" strokeLinecap="round" />
            {/* Big Smile */}
            <path d="M38 65C45 84 75 84 82 65" stroke="#713F12" strokeWidth="5" strokeLinecap="round" fill="#FFFFFF" />
            {/* Rosy Cheeks */}
            <circle cx="34" cy="62" r="6" fill="#F87171" opacity="0.6" />
            <circle cx="86" cy="62" r="6" fill="#F87171" opacity="0.6" />
          </svg>
        );

      case 'listen':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#F0FDF4" />
            {/* Headphones */}
            <path d="M30 65C30 40 42 26 60 26C78 26 90 40 90 65" stroke="#16A34A" strokeWidth="6" strokeLinecap="round" />
            {/* Earcups */}
            <rect x="22" y="60" width="16" height="26" rx="8" fill="#22C55E" stroke="#15803D" strokeWidth="4" />
            <rect x="82" y="60" width="16" height="26" rx="8" fill="#22C55E" stroke="#15803D" strokeWidth="4" />
            {/* Musical Sound Notes */}
            <path d="M52 68V54L68 50V64" stroke="#0D9488" strokeWidth="4" strokeLinecap="round" />
            <circle cx="48" cy="68" r="5" fill="#0D9488" />
            <circle cx="64" cy="64" r="5" fill="#0D9488" />
          </svg>
        );

      case 'share':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FAF5FF" />
            {/* Gift Box with Ribbon */}
            <rect x="35" y="48" width="50" height="44" rx="8" fill="#C084FC" stroke="#9333EA" strokeWidth="4" />
            <rect x="30" y="38" width="60" height="14" rx="4" fill="#E9D5FF" stroke="#9333EA" strokeWidth="4" />
            {/* Ribbon */}
            <line x1="60" y1="38" x2="60" y2="92" stroke="#FACC15" strokeWidth="6" />
            <path d="M48 30C42 22 55 22 60 30C65 22 78 22 72 30C66 38 54 38 48 30Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" />
            {/* Sparkles */}
            <circle cx="25" cy="30" r="3" fill="#F59E0B" />
            <circle cx="95" cy="35" r="4" fill="#F59E0B" />
          </svg>
        );

      case 'help':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FEF2F2" />
            {/* Holding Hands / Heart */}
            <path d="M60 35C50 20 28 25 32 46C36 62 60 85 60 85C60 85 84 62 88 46C92 25 70 20 60 35Z" fill="#EF4444" stroke="#DC2626" strokeWidth="4" />
            <path d="M40 75L54 62C58 58 62 58 66 62L80 75" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'hello':
      case 'hi':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#ECFDF5" />
            {/* Waving Hand */}
            <path d="M45 88L45 62C45 56 36 56 36 62L36 76C30 76 26 70 28 64L32 45C34 38 42 38 44 45L46 28C46 22 54 22 54 28L54 45L56 22C56 16 64 16 64 22L64 45L66 26C66 20 74 20 74 26L74 50L76 38C76 32 84 32 84 38L84 68C84 84 72 92 54 92L45 88Z" fill="#6EE7B7" stroke="#059669" strokeWidth="4" strokeLinejoin="round" />
            {/* Wave lines */}
            <path d="M88 28C94 34 94 44 88 50" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
            <path d="M96 22C104 32 104 48 96 58" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'friend':
      case 'friends':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#EFF6FF" />
            {/* Two happy friends */}
            <circle cx="42" cy="46" r="16" fill="#FED7AA" stroke="#EA580C" strokeWidth="3" />
            <path d="M22 86C22 72 32 64 42 64C52 64 62 72 62 86" fill="#60A5FA" stroke="#2563EB" strokeWidth="3" />
            <circle cx="78" cy="46" r="16" fill="#FED7AA" stroke="#EA580C" strokeWidth="3" />
            <path d="M58 86C58 72 68 64 78 64C88 64 98 72 98 86" fill="#34D399" stroke="#059669" strokeWidth="3" />
            {/* Heart between them */}
            <path d="M60 32C56 26 48 28 50 36C52 42 60 48 60 48C60 48 68 42 70 36C72 28 64 26 60 32Z" fill="#F43F5E" />
          </svg>
        );

      // --- Stationery & Classroom ---
      case 'pencil':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FEFCE8" />
            {/* Classic Yellow Pencil */}
            <path d="M30 88L24 96L32 90L85 37L77 29L24 82L30 88Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="4" />
            <path d="M85 37L77 29L86 20C89 17 94 17 97 20L100 23C103 26 103 31 100 34L85 37Z" fill="#F472B6" stroke="#DB2777" strokeWidth="4" />
            <polygon points="24,96 18,102 24,82" fill="#FDE68A" stroke="#CA8A04" strokeWidth="2" />
            <polygon points="18,102 16,104 20,100" fill="#0F172A" />
          </svg>
        );

      case 'pen':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#EFF6FF" />
            <path d="M35 85L85 35L95 45L45 95L30 98L35 85Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="4" strokeLinejoin="round" />
            <path d="M78 28L92 42" stroke="#93C5FD" strokeWidth="6" strokeLinecap="round" />
            <polygon points="30,98 22,106 35,95" fill="#0F172A" />
          </svg>
        );

      case 'ruler':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#F0FDF4" />
            <rect x="20" y="45" width="80" height="30" rx="4" transform="rotate(-25 60 60)" fill="#86EFAC" stroke="#16A34A" strokeWidth="4" />
            <line x1="38" y1="42" x2="43" y2="52" stroke="#15803D" strokeWidth="3" />
            <line x1="48" y1="37" x2="51" y2="44" stroke="#15803D" strokeWidth="3" />
            <line x1="58" y1="32" x2="63" y2="42" stroke="#15803D" strokeWidth="3" />
            <line x1="68" y1="27" x2="71" y2="34" stroke="#15803D" strokeWidth="3" />
            <line x1="78" y1="22" x2="83" y2="32" stroke="#15803D" strokeWidth="3" />
          </svg>
        );

      case 'eraser':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FFF1F2" />
            <path d="M28 72L55 35L88 55L61 92L28 72Z" fill="#FB7185" stroke="#E11D48" strokeWidth="4" strokeLinejoin="round" />
            <path d="M42 53L69 16L95 32L68 69L42 53Z" fill="#60A5FA" stroke="#2563EB" strokeWidth="4" strokeLinejoin="round" />
          </svg>
        );

      case 'book':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FFFBEB" />
            <path d="M22 45C35 40 55 42 60 52C65 42 85 40 98 45V85C85 80 65 82 60 92C55 82 35 80 22 85V45Z" fill="#FDE68A" stroke="#D97706" strokeWidth="4" strokeLinejoin="round" />
            <line x1="60" y1="52" x2="60" y2="92" stroke="#D97706" strokeWidth="4" />
          </svg>
        );

      case 'bag':
      case 'schoolbag':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#F0F9FF" />
            <path d="M42 35C42 26 50 20 60 20C70 20 78 26 78 35" stroke="#0284C7" strokeWidth="5" strokeLinecap="round" />
            <rect x="28" y="35" width="64" height="60" rx="14" fill="#38BDF8" stroke="#0284C7" strokeWidth="4" />
            <rect x="38" y="55" width="44" height="30" rx="8" fill="#BAE6FD" stroke="#0284C7" strokeWidth="3" />
          </svg>
        );

      // --- Fruits & Foods ---
      case 'apple':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FEF2F2" />
            <path d="M60 22C60 32 68 36 68 36" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
            <path d="M64 24C74 20 80 26 78 32C68 34 64 26 64 24Z" fill="#22C55E" />
            <path d="M32 48C24 64 26 88 42 96C52 100 58 92 60 92C62 92 68 100 78 96C94 88 96 64 88 48C82 38 68 40 60 46C52 40 38 38 32 48Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="4" strokeLinejoin="round" />
            <circle cx="45" cy="55" r="4" fill="#F87171" />
          </svg>
        );

      case 'banana':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FEFCE8" />
            <path d="M30 85C50 95 85 85 95 38C98 25 85 24 85 24C85 24 84 42 70 65C58 84 38 80 30 85Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="5" strokeLinejoin="round" />
            <path d="M26 86L32 82" stroke="#854D0E" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );

      case 'orange':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FFF7ED" />
            <circle cx="60" cy="65" r="35" fill="#FB923C" stroke="#C2410C" strokeWidth="5" />
            <path d="M60 22V32" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
            <path d="M60 26C70 22 76 28 72 34C64 34 60 28 60 26Z" fill="#22C55E" />
          </svg>
        );

      case 'pear':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#F7FEE7" />
            <path d="M60 20V28" stroke="#713F12" strokeWidth="4" strokeLinecap="round" />
            <path d="M60 24C68 20 74 24 72 28C64 30 60 24 60 24Z" fill="#65A30D" />
            <path d="M48 38C44 50 32 64 32 78C32 92 45 98 60 98C75 98 88 92 88 78C88 64 76 50 72 38C68 30 52 30 48 38Z" fill="#BEF264" stroke="#65A30D" strokeWidth="4" strokeLinejoin="round" />
          </svg>
        );

      case 'water':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#F0F9FF" />
            {/* Water Glass */}
            <path d="M35 30L42 90C42 96 48 100 55 100H65C72 100 78 96 78 90L85 30H35Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="4" strokeLinejoin="round" />
            <path d="M40 50C48 46 54 54 60 50C66 46 72 54 80 50L76 88C76 92 72 95 68 95H52C48 95 44 92 44 88L40 50Z" fill="#38BDF8" />
          </svg>
        );

      case 'milk':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#F8FAFC" />
            <path d="M45 20H75L82 35V95C82 100 78 102 72 102H48C42 102 38 100 38 95V35L45 20Z" fill="#FFFFFF" stroke="#64748B" strokeWidth="4" strokeLinejoin="round" />
            <rect x="42" y="52" width="36" height="28" fill="#38BDF8" />
            <text x="60" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">MILK</text>
          </svg>
        );

      // --- Animals ---
      case 'dog':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FEF3C7" />
            <circle cx="60" cy="62" r="32" fill="#FBBF24" stroke="#B45309" strokeWidth="4" />
            {/* Floppy Ears */}
            <path d="M30 42C24 54 26 72 36 74C42 74 40 58 36 48L30 42Z" fill="#92400E" />
            <path d="M90 42C96 54 94 72 84 74C78 74 80 58 84 48L90 42Z" fill="#92400E" />
            {/* Eyes */}
            <circle cx="48" cy="58" r="4" fill="#0F172A" />
            <circle cx="72" cy="58" r="4" fill="#0F172A" />
            {/* Cute Dog Nose */}
            <ellipse cx="60" cy="68" rx="6" ry="4" fill="#0F172A" />
            <path d="M55 74C58 78 62 78 65 74" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'cat':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FFF7ED" />
            <circle cx="60" cy="65" r="32" fill="#FB923C" stroke="#C2410C" strokeWidth="4" />
            {/* Pointy Cat Ears */}
            <polygon points="32,45 28,22 50,38" fill="#FB923C" stroke="#C2410C" strokeWidth="4" strokeLinejoin="round" />
            <polygon points="88,45 92,22 70,38" fill="#FB923C" stroke="#C2410C" strokeWidth="4" strokeLinejoin="round" />
            {/* Eyes */}
            <circle cx="48" cy="60" r="4" fill="#0F172A" />
            <circle cx="72" cy="60" r="4" fill="#0F172A" />
            {/* Nose & Whiskers */}
            <polygon points="60,68 56,64 64,64" fill="#F43F5E" />
            <line x1="28" y1="66" x2="42" y2="68" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
            <line x1="28" y1="74" x2="42" y2="72" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
            <line x1="92" y1="66" x2="78" y2="68" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
            <line x1="92" y1="74" x2="78" y2="72" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'panda':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#F1F5F9" />
            {/* Black Ears */}
            <circle cx="34" cy="36" r="12" fill="#0F172A" />
            <circle cx="86" cy="36" r="12" fill="#0F172A" />
            {/* Head */}
            <circle cx="60" cy="65" r="34" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
            {/* Black Eye Patches */}
            <ellipse cx="46" cy="62" rx="9" ry="12" transform="rotate(-15 46 62)" fill="#0F172A" />
            <ellipse cx="74" cy="62" rx="9" ry="12" transform="rotate(15 74 62)" fill="#0F172A" />
            <circle cx="48" cy="60" r="3" fill="#FFFFFF" />
            <circle cx="72" cy="60" r="3" fill="#FFFFFF" />
            {/* Nose */}
            <ellipse cx="60" cy="74" rx="5" ry="3" fill="#0F172A" />
            <path d="M56 80C58 84 62 84 64 80" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'rabbit':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FDF2F8" />
            {/* Long Bunny Ears */}
            <ellipse cx="45" cy="32" rx="8" ry="24" fill="#FFFFFF" stroke="#DB2777" strokeWidth="3" />
            <ellipse cx="45" cy="32" rx="4" ry="16" fill="#FBCFE8" />
            <ellipse cx="75" cy="32" rx="8" ry="24" fill="#FFFFFF" stroke="#DB2777" strokeWidth="3" />
            <ellipse cx="75" cy="32" rx="4" ry="16" fill="#FBCFE8" />
            {/* Bunny Head */}
            <circle cx="60" cy="72" r="28" fill="#FFFFFF" stroke="#DB2777" strokeWidth="4" />
            <circle cx="50" cy="68" r="3.5" fill="#BE185D" />
            <circle cx="70" cy="68" r="3.5" fill="#BE185D" />
            <polygon points="60,76 56,72 64,72" fill="#F472B6" />
          </svg>
        );

      case 'bird':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#EFF6FF" />
            <path d="M30 65C30 45 48 35 68 35C88 35 95 50 95 65C95 85 75 90 55 90C40 90 30 80 30 65Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="4" />
            <polygon points="92,55 106,60 92,65" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <circle cx="75" cy="50" r="4" fill="#0F172A" />
            <circle cx="77" cy="48" r="1.5" fill="#FFFFFF" />
            {/* Wing */}
            <path d="M42 62C52 56 68 62 62 76C54 84 40 76 42 62Z" fill="#0284C7" />
          </svg>
        );

      case 'duck':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#FEF9C3" />
            {/* Duck Body & Head */}
            <circle cx="50" cy="45" r="18" fill="#FACC15" stroke="#CA8A04" strokeWidth="4" />
            <path d="M36 60C36 55 48 55 58 55C75 55 90 65 90 78C90 88 78 92 60 92C45 92 36 84 36 60Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="4" />
            {/* Duck Beak */}
            <path d="M64 42C75 42 84 46 80 52C74 54 62 52 64 42Z" fill="#FB923C" stroke="#EA580C" strokeWidth="3" />
            <circle cx="55" cy="40" r="3.5" fill="#0F172A" />
          </svg>
        );

      case 'turn left':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#EFF6FF" />
            <circle cx="60" cy="60" r="45" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="4" />
            <path d="M60 85V55C60 48 55 42 48 42H32" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <polygon points="35,28 18,42 35,56" fill="#FFFFFF" />
          </svg>
        );

      case 'turn right':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="24" fill="#EFF6FF" />
            <circle cx="60" cy="60" r="45" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="4" />
            <path d="M60 85V55C60 48 65 42 72 42H88" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <polygon points="85,28 102,42 85,56" fill="#FFFFFF" />
          </svg>
        );

      default:
        return null;
    }
  };

  const vectorSvg = renderVectorIllustration();
  if (vectorSvg) {
    return <div className={`w-full h-full flex items-center justify-center ${className}`}>{vectorSvg}</div>;
  }

  // 2. Fallback to image url if vector is not defined
  const imageUrl = word?.imageUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80';

  if (imgError) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-[#f0f4ff] text-[#006780] rounded-xl p-3 text-center ${className}`}>
        <span className="text-3xl mb-1">📖</span>
        <span className="text-xs font-bold font-quicksand">{word.word}</span>
        <span className="text-[10px] text-[#514532]/70">{word.translation}</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt || word.word}
      className={`w-full h-full object-cover rounded-xl transition-transform duration-300 ${className}`}
      onError={() => setImgError(true)}
      referrerPolicy="no-referrer"
    />
  );
};
