import React from 'react';

interface PersonalLogoProps {
  className?: string;
  size?: number | string;
  withBackground?: boolean;
}

export const PersonalLogo: React.FC<PersonalLogoProps> = ({
  className = 'w-10 h-10',
  withBackground = false,
}) => {
  const navyColor = '#002166';

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 overflow-hidden ${
        withBackground ? 'bg-white rounded-xl shadow-xs border border-slate-200/80 p-1' : ''
      } ${className}`}
      title="Logo cá nhân - Lê Ngọc Long"
    >
      <svg
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain"
      >
        <g id="le-ngoc-long-personal-logo">
          {/* Main Monogram Shape */}
          <path
            fill={navyColor}
            fillRule="evenodd"
            d="
              M 88 78
              L 172 78
              L 172 268
              C 236 168, 370 110, 526 110
              C 750 110, 936 292, 936 516
              C 936 740, 750 922, 526 922
              L 88 922
              Z

              M 526 194
              C 348 194, 204 338, 204 516
              C 204 694, 348 838, 526 838
              C 704 838, 848 694, 848 516
              C 848 338, 704 194, 526 194
              Z
            "
          />

          {/* Center Hook (G / L geometric structure) */}
          <path
            fill={navyColor}
            d="
              M 308 500
              L 516 500
              L 516 922
              L 432 922
              L 432 576
              L 308 576
              Z
            "
          />

          {/* Bottom-Left N Block */}
          <path
            fill={navyColor}
            d="
              M 172 500
              L 432 768
              L 432 922
              L 172 922
              Z
            "
          />

          {/* White Ribbon Cutouts for the 'N' Monogram */}
          <path
            fill="#ffffff"
            d="
              M 172 846
              L 172 922
              L 272 922
              Z
            "
          />

          <path
            fill="#ffffff"
            d="
              M 204 658
              C 220 682, 274 756, 362 822
              C 368 827, 362 836, 348 834
              C 268 768, 212 698, 194 666
              C 190 660, 198 654, 204 658
              Z
            "
          />

          <path
            fill="#ffffff"
            d="
              M 252 588
              C 272 616, 340 706, 422 780
              L 432 780
              L 432 766
              C 346 678, 282 594, 258 574
              C 252 568, 246 578, 252 588
              Z
            "
          />
        </g>
      </svg>
    </div>
  );
};
