import React, { useState, useCallback } from 'react';
import { Platform, GeneratedContent } from '../types';
import { PlatformIcon } from './Icons';
import { ImageWithTextOverlay } from './ImageWithTextOverlay';

interface ContentCardProps {
  platform: Platform;
  content: GeneratedContent | undefined;
  isLoading: boolean;
  aspectRatio: string;
  overlayText: string;
}

const SkeletonLoader: React.FC<{aspectRatio: string}> = ({ aspectRatio }) => (
  <div className="animate-pulse space-y-4">
    <div className={`bg-base-300 rounded-lg ${aspectRatio}`}></div>
    <div className="space-y-2">
      <div className="h-4 bg-base-300 rounded w-full"></div>
      <div className="h-4 bg-base-300 rounded w-5/6"></div>
      <div className="h-4 bg-base-300 rounded w-3/4"></div>
    </div>
  </div>
);

export const ContentCard: React.FC<ContentCardProps> = ({ platform, content, isLoading, aspectRatio, overlayText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (content?.text) {
      navigator.clipboard.writeText(content.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [content]);

  const getShareUrl = useCallback(() => {
    if (!content?.text) return null;
    const encodedText = encodeURIComponent(content.text);
    switch (platform) {
      case Platform.Twitter:
        return `https://twitter.com/intent/tweet?text=${encodedText}`;
      case Platform.LinkedIn:
        // This opens the share dialog. The user must paste the text.
        return `https://www.linkedin.com/sharing/share-offsite/`;
      case Platform.Instagram:
      default:
        return null;
    }
  }, [content, platform]);

  const shareUrl = getShareUrl();
  const canShare = shareUrl !== null;

  const handleShareClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!canShare) {
      e.preventDefault();
      return;
    }
    // For LinkedIn, automatically copy the text to make posting easier
    if (platform === Platform.LinkedIn) {
      handleCopy();
    }
  };
  
  const getShareTitle = () => {
    if (platform === Platform.LinkedIn) return 'Open LinkedIn to post (text copied!)';
    if (canShare) return `Post to ${platform}`;
    return `Direct posting to ${platform} is not supported via web.`;
  }

  return (
    <div className="bg-base-200 rounded-2xl shadow-lg p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <PlatformIcon platform={platform} className="w-8 h-8 text-base-content" />
          <h3 className="text-2xl font-bold text-white">{platform}</h3>
        </div>
        {content && !isLoading && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-2 text-sm font-semibold rounded-full bg-brand-secondary hover:bg-brand-dark transition-colors text-white flex items-center gap-2 disabled:opacity-50"
              title="Copy post text"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
             <a
              href={shareUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleShareClick}
              title={getShareTitle()}
              className={`px-3 py-2 text-sm font-semibold rounded-full transition-colors text-white flex items-center gap-2 ${
                canShare
                  ? 'bg-brand-light hover:bg-brand-secondary'
                  : 'bg-base-300 cursor-not-allowed opacity-50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              <span>Post</span>
            </a>
          </div>
        )}
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
                altText={`${platform} post image`}
            />
            <p className="text-base-content whitespace-pre-wrap font-mono text-sm leading-relaxed">{content.text}</p>
          </div>
        ) : (
            <div className={`w-full rounded-lg bg-base-300 flex items-center justify-center text-base-content/50 ${aspectRatio}`}>
                Generate content to see results
            </div>
        )}
      </div>
    </div>
  );
};