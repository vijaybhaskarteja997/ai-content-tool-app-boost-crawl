import React from 'react';

export const Logo: React.FC<{className?: string}> = ({ className }) => (
    <svg 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#60a5fa', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
            </linearGradient>
        </defs>
        
        <path 
            d="M71.1,53.4 C77.2,46.5 79.5,37 76.2,28.8 C72.9,20.6 64.6,15.8 56.1,17.4 L44.7,19.7 L49.9,30.3 L61.3,28 C66.1,27.1 70,29.3 72,33.5 C74,37.7 72.3,42.5 68.3,46 L50,65.8 L30.6,46.4 C26.7,42.5 25,37.7 27,33.5 C29,29.3 32.9,27.1 37.7,28 L49.1,30.3 L54.3,19.7 L42.9,17.4 C34.4,15.8 26.1,20.6 22.8,28.8 C19.5,37 21.8,46.5 27.9,53.4 L46.5,72.1 L35,84 C33.3,86.2 34.1,89.5 36.5,90.8 L40,92.9 C42.4,94.2 45.5,93.4 46.9,91.1 L59.4,70.5 L67,78.2 C68.7,79.9 71.3,80 73.1,78.4 L78.4,73.1 C80,71.3 79.9,68.7 78.2,67 L71.1,59.8 L71.1,53.4 Z"
            fill="url(#logoGradient)"
        />
    </svg>
);
