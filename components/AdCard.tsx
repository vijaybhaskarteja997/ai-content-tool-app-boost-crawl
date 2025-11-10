import React, { useState, useCallback } from 'react';
import { AdPlatform, AdContent } from '../types';
import { PlatformIcon } from './Icons';
import { ImageWithTextOverlay } from './ImageWithTextOverlay';

interface AdCardProps {
  platform: AdPlatform;
  content: AdContent | undefined;
  isLoading: boolean;
  overlayText: string;
  aspectRatio: string;
}

const SkeletonLoader: React.FC<{aspectRatio: string}> = ({ aspectRatio }) => (
  <div className="animate-pulse space-y-5">
    <div className={`bg-base-300 rounded-lg ${aspectRatio}`}></div>
    {[...Array(4)].map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-3 bg-base-300 rounded w-1/4"></div>
        <div className="h-4 bg-base-300 rounded w-full"></div>
      </div>
    ))}
  </div>
);

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-0 right-0 p-1.5 text-base-content/60 hover:text-white bg-base-300/50 hover:bg-brand-secondary rounded-bl-md rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity"
      title="Copy text"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      {copied && <span className="absolute -top-7 right-0 text-xs bg-brand-dark text-white px-2 py-1 rounded">Copied!</span>}
    </button>
  );
};

const InfoRow: React.FC<{ label: string, value: string | undefined }> = ({ label, value }) => (
    <div className="relative group">
        <label className="text-sm font-semibold text-base-content/70">{label}</label>
        <p className="text-white bg-base-300/50 p-3 rounded-lg mt-1 text-sm font-mono whitespace-pre-wrap">{value || '...'}</p>
        {value && <CopyButton text={value} />}
    </div>
);


export const AdCard: React.FC<AdCardProps> = ({ platform, content, isLoading, overlayText, aspectRatio }) => {
  return (
    <div className="bg-base-200 rounded-2xl shadow-lg p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <PlatformIcon platform={platform} className="w-8 h-8 text-base-content" />
        <h3 className="text-2xl font-bold text-white">{platform}</h3>
      </div>
      <div className="mt-2">
        {isLoading ? (
          <SkeletonLoader aspectRatio={aspectRatio} />
        ) : content ? (
          <div className="space-y-4">
             <ImageWithTextOverlay 
                imageUrl={content.imageUrl}
                overlayText={overlayText}
                aspectRatio={aspectRatio}
                altText={`${platform} ad image`}
            />
            <InfoRow label="Target Keyword" value={content.targetKeyword} />
            <InfoRow label="Ad Title" value={content.title} />
            <InfoRow label="Description" value={content.description} />
            <InfoRow label="Call to Action (CTA)" value={content.cta} />
          </div>
        ) : (
            <div className={`w-full h-96 rounded-lg bg-base-300 flex items-center justify-center text-base-content/50`}>
                Generate ad copy to see results
            </div>
        )}
      </div>
    </div>
  );
};