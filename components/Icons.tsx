import React from 'react';
import { Platform, AdPlatform } from '../types';

interface IconProps {
  platform: Platform | AdPlatform;
  className?: string;
}

export const PlatformIcon: React.FC<IconProps> = ({ platform, className = 'w-6 h-6' }) => {
  switch (platform) {
    case Platform.LinkedIn:
    case AdPlatform.LinkedIn:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    case Platform.Twitter:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.627l-5.21-6.815-6.041 6.815h-3.308l7.73-8.805-7.994-10.69h6.797l4.632 6.205 5.545-6.205zm-2.75 18.25h1.57l-12.74-17.06h-1.68l12.85 17.06z"/>
        </svg>
      );
    case Platform.Instagram:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
    case AdPlatform.Google:
      return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={className} 
            viewBox="0 0 24 24" 
            fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.16c1.61 0 3.06.55 4.18 1.58l3.15-3.15C17.45 1.99 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.59L5.84 9.43c.87-2.6 3.3-4.27 6.16-4.27z" fill="#EA4335"/>
        </svg>
      );
    case AdPlatform.Facebook:
      return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33V21.878C18.343 21.128 22 16.991 22 12z"></path>
        </svg>
      )
    default:
      return null;
  }
};

export const StarIcon: React.FC<{className?: string, isFilled: boolean}> = ({ className = 'w-5 h-5', isFilled }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        viewBox="0 0 24 24" 
        fill={isFilled ? 'currentColor' : 'none'}
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

export const DownloadIcon: React.FC<{className?: string}> = ({ className = 'w-5 h-5' }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

export const GoogleIcon: React.FC<{className?: string}> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.16c1.61 0 3.06.55 4.18 1.58l3.15-3.15C17.45 1.99 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.59L5.84 9.43c.87-2.6 3.3-4.27 6.16-4.27z" fill="#EA4335"/>
    </svg>
);

export const LogoutIcon: React.FC<{className?: string}> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export const BillingIcon: React.FC<{className?: string}> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

export const PromptBuilderIcon: React.FC<{className?: string}> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4-2.4 3 3 0 001.128-5.78 2.25 2.25 0 012.4-2.4 3 3 0 005.78-1.128 2.25 2.25 0 012.4 2.4 3 3 0 00-1.128 5.78 2.25 2.25 0 01-2.4 2.4zM13.5 9.75l-1.5-1.5-1.5 1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5l-1.5-1.5-1.5 1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 17.25l-1.5-1.5-1.5 1.5" />
    </svg>
);

export const GooglePayIcon: React.FC<{className?: string}> = ({ className = 'w-12 h-auto' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 74.3 46.8">
        <path fill="#4285F4" d="M63.1 19.3V18c0-5-3.5-8.5-8.5-8.5h-9.9v18.3h7.4v-6.9h2.5c4.9 0 8.5-3 8.5-6.9zm-8.5-2.2h-2.5v-4.7h2.5c2.1 0 3.6 1.4 3.6 3.6.1 2.1-1.5 3.5-3.6 3.5z"/>
        <path fill="#34A853" d="M30.6 9.5h-6.3c-2.8 0-4.9 2.1-4.9 4.9v10.8c0 2.8 2.1 4.9 4.9 4.9h6.3c2.8 0 4.9-2.1 4.9-4.9V14.4c0-2.8-2.2-4.9-4.9-4.9zm-1.1 13.9c0 .8-.7 1.5-1.5 1.5h-2.6c-.8 0-1.5-.7-1.5-1.5V16c0-.8.7-1.5 1.5-1.5h2.6c.8 0 1.5.7 1.5 1.5v7.4z"/>
        <path fill="#FBBC05" d="M12.4 20.9l-2.9-4.4V30H5.6V9.5h3.9l6.3 9.4-2.2 3.3z"/>
        <path fill="#EA4335" d="M74.3 22.3c0-3.3-2.1-4.7-4.8-4.7-2.1 0-4.1 1.3-4.1 3.2 0 2.2 2.7 2.7 4.9 3.4 3.1.9 4.3 2.1 4.3 4.1 0 3-3.1 4.5-5.9 4.5-3.4 0-6.1-1.9-6.1-4.8h3.8c0 1.3 1.2 2.1 2.4 2.1 1.3 0 2.1-.6 2.1-1.6 0-1.8-2.2-2.3-4.7-3.1-3.2-.9-4.5-2.3-4.5-4.3 0-2.7 2.7-4.6 5.6-4.6 3.1 0 5.3 1.7 5.3 4.3h-3.8z"/>
    </svg>
);

export const PaytmIcon: React.FC<{className?: string}> = ({ className = 'w-12 h-auto' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 64 21">
        <path fill="#00baf2" d="M11.6.4H0v20.2h11.6c5.2 0 9.4-4.2 9.4-9.4v-1.4c0-5.2-4.2-9.4-9.4-9.4z"/>
        <path fill="#002e6e" d="M38.1.4h-9.2L25 10.9l-3.9-10.5h-9.2v20.2h5.8V6.3l5.8 14.3h6.3l5.8-14.3v14.3h5.8V.4zM64 .4h-5.8v20.2H64V.4zM49.6 20.6c5.2 0 9.4-4.2 9.4-9.4v-1.4c0-5.2-4.2-9.4-9.4-9.4h-5.8v20.2h5.8z"/>
    </svg>
);

export const PhonePeIcon: React.FC<{className?: string}> = ({ className = 'w-12 h-auto' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 200 52">
        <path fill="#5f259f" d="M136.2 32.3c-2.2-2.2-2.2-5.6 0-7.7 2.2-2.2 5.6-2.2 7.7 0l11 11c2.2 2.2 2.2 5.6 0 7.7-2.2 2.2-5.6 2.2-7.7 0l-11-11zm-21.7-16.2c-1.3-3.2-4-5.3-7.2-5.3-4.5 0-8.1 3.7-8.1 8.2 0 4.5 3.7 8.2 8.2 8.2 3.1 0 5.8-1.8 7.1-4.4h9.9c-2 6.9-8.4 12-16.1 12-9.5 0-17.2-7.7-17.2-17.2S98.6 1.8 108.1 1.8c7.8 0 14.4 5.2 16.3 12.3l-10.1-.1zm-48.4 3.7h8.8v26.4h9.8V19.8h8.8V10.9H66.1v.1zm-27.7 9.8c-2.3 0-4.1-1.8-4.1-4.1s1.8-4.1 4.1-4.1 4.1 1.8 4.1 4.1-1.9 4.1-4.1 4.1zm0-12.2c-4.5 0-8.2 3.7-8.2 8.2s3.7 8.2 8.2 8.2 8.2-3.7 8.2-8.2-3.7-8.2-8.2-8.2zm-2.4 20.4h-4.1v-14h-5.9v-8.8h15.9v8.8h-5.9v14zm51.4 1.8h9.8V10.9h-9.8v31.2zm64.9 0h9.8V10.9h-9.8v31.2zM172.6 16c-3.1 0-5.8 1.6-7.2 4.1h-8.8V10.9h-9.8v31.2h9.8V28.7c0-4.5 3.7-8.2 8.2-8.2 4.5 0 8.2 3.7 8.2 8.2v13.4h9.8V24.2c-.1-4.5-3.7-8.2-8.2-8.2z"/>
    </svg>
);