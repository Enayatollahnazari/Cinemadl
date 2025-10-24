import React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Icon: a rounded square with a play triangle */}
        <g>
            <rect x="0" y="0" width="40" height="40" rx="8" fill="#FBBF24" />
            <path d="M15 12 L15 28 L28 20 Z" fill="#1E293B" />
        </g>
        
        {/* Text */}
        <text 
            x="50" 
            y="28" 
            fontFamily="Vazirmatn, sans-serif" 
            fontSize="24" 
            fontWeight="700" 
            fill="#E2E8F0"
        >
            سینما
        </text>
    </svg>
);