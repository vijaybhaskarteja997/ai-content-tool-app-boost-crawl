import React, { useState, useCallback, useEffect, useMemo } from 'react';
// Types
import { Tone, Platform, AllGeneratedContent, HistoryEntry, AdPlatform, AllAdContent, BlogPost, PostSchedule, EmailNewsletter, YouTubeVideoPackage, TwitterThread, User, Invoice, PromptTarget, ImageStyle, PromptBuilderOutputs, AspectRatio } from './types';
// Services
import { generateSocialMediaContent, generateAdCopy, generateBlogPost, generateEmailNewsletter, generateTwitterThread, generateYouTubeVideoPackage, generatePromptAndImagePreview } from './services/geminiService';
// Components
import { ContentCard } from './components/ContentCard';
import { AdCard } from './components/AdCard';
import { DownloadIcon, StarIcon, PlatformIcon, LogoutIcon, BillingIcon, PromptBuilderIcon } from './components/Icons';
import { Logo } from './components/Logo';
import { Auth } from './components/Auth';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { Contact } from './components/Contact';
import { Billing } from './components/Billing';
import { ImageWithTextOverlay } from './components/ImageWithTextOverlay';
import { ScheduleView } from './components/ScheduleView';

type Tool = 'social' | 'ads' | 'blog' | 'email' | 'twitterThread' | 'youtube' | 'promptBuilder' | 'schedule';
type Page = 'app' | 'privacy' | 'contact' | 'billing';


// Main App component
const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const savedUser = localStorage.getItem('boostCrawlUser');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });
    
    const [currentPage, setCurrentPage] = useState<Page>('app');

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash === 'privacy' || hash === 'contact' || hash === 'billing') {
                setCurrentPage(hash as Page);
            } else {
                setCurrentPage('app');
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Check on initial load
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    const handleNavigate = (page: Page) => {
        setCurrentPage(page);
        window.location.hash = page === 'app' ? '' : page;
         window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAuthSuccess = (authedUser: User) => {
        setUser(authedUser);
        localStorage.setItem('boostCrawlUser', JSON.stringify(authedUser));
    };
    
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('boostCrawlUser');
        window.location.hash = '';
        setCurrentPage('app');
    };

    return (
        <div className="min-h-screen font-sans text-base-content p-4 sm:p-6 lg:p-8 flex flex-col">
            <AppHeader user={user} onLogout={handleLogout} onNavigate={handleNavigate}/>
            <main className="flex-grow">
                 {!user ? (
                    <Auth onAuthSuccess={handleAuthSuccess} />
                ) : currentPage === 'privacy' ? (
                    <PrivacyPolicy user={user} onNavigate={handleNavigate} />
                ) : currentPage === 'contact' ? (
                    <Contact onNavigate={handleNavigate} />
                ) : currentPage === 'billing' ? (
                    <Billing user={user} onNavigate={handleNavigate} />
                ) : (
                    <ContentSuite user={user} />
                )}
            </main>
            <AppFooter onNavigate={handleNavigate} />
        </div>
    );
};

// Header Component
const AppHeader: React.FC<{ user: User | null; onLogout: () => void; onNavigate: (page: Page) => void; }> = ({ user, onLogout, onNavigate }) => (
    <header className="max-w-7xl mx-auto w-full mb-8">
        <div className="flex justify-between items-center">
            <a href="#app" onClick={(e) => { e.preventDefault(); onNavigate('app');}} className="flex items-center gap-3">
                <Logo className="w-10 h-10" />
                <h1 className="text-2xl font-bold text-white tracking-tight hidden sm:block">Boost Crawl</h1>
            </a>
            <div>
                {user ? (
                    <div className="flex items-center gap-4">
                        <a href="#billing" onClick={(e) => {e.preventDefault(); onNavigate('billing')}} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-base-200 hover:bg-base-300 text-white transition-colors">
                            <BillingIcon />
                            <span className="hidden sm:inline">Billing</span>
                        </a>
                        <span className="text-base-content hidden md:inline">Welcome, {user.name}!</span>
                        <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-base-200 hover:bg-base-300 text-white transition-colors">
                            <LogoutIcon />
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <span className="text-base-content">Please sign in to continue</span>
                )}
            </div>
        </div>
    </header>
);

// Footer Component
const AppFooter: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <footer className="max-w-7xl mx-auto w-full text-center mt-16 pt-8 border-t border-base-300/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
             <div className="col-span-1">
                <div className="flex items-center gap-3 mb-4">
                    <Logo className="w-10 h-10" />
                    <h3 className="text-xl font-bold text-white">Boost Crawl</h3>
                </div>
                <p className="text-sm text-base-content/60">&copy; 2047 Boost Crawl. All Rights Reserved.</p>
            </div>
            <div className="col-span-1">
                <h4 className="font-semibold text-white mb-3">Tools</h4>
                <ul className="space-y-2 text-sm text-base-content/80">
                    <li><a href="#app" onClick={(e) => { e.preventDefault(); onNavigate('app'); }} className="hover:text-brand-light">Social Posts</a></li>
                    <li><a href="#app" onClick={(e) => { e.preventDefault(); onNavigate('app'); }} className="hover:text-brand-light">Twitter Threads</a></li>
                    <li><a href="#app" onClick={(e) => { e.preventDefault(); onNavigate('app'); }} className="hover:text-brand-light">Ad Copy</a></li>
                    <li><a href="#app" onClick={(e) => { e.preventDefault(); onNavigate('app'); }} className="hover:text-brand-light">Blog Posts</a></li>
                    <li><a href="#app" onClick={(e) => { e.preventDefault(); onNavigate('app'); }} className="hover:text-brand-light">Email Newsletter</a></li>
                    <li><a href="#app" onClick={(e) => { e.preventDefault(); onNavigate('app'); }} className="hover:text-brand-light">YouTube Video</a></li>
                </ul>
            </div>
             <div className="col-span-1">
                <h4 className="font-semibold text-white mb-3">Company</h4>
                 <ul className="space-y-2 text-sm text-base-content/80">
                     <li><a href="#privacy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="hover:text-brand-light">Privacy Policy</a></li>
                    <li><a href="#contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="hover:text-brand-light">Contact Us</a></li>
                     <li><a href="#billing" onClick={(e) => { e.preventDefault(); onNavigate('billing'); }} className="hover:text-brand-light">Billing</a></li>
                </ul>
            </div>
        </div>
    </footer>
);

// Main content generator suite
const ContentSuite: React.FC<{ user: User }> = ({ user }) => {
  // Global State
  const [activeTool, setActiveTool] = useState<Tool>('social');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const historyKey = useMemo(() => `contentHistory_${user.email}`, [user.email]);

  // Social Post State
  const [socialIdea, setSocialIdea] = useState<string>('A new AI-powered productivity tool that automatically organizes your daily schedule.');
  const [socialTone, setSocialTone] = useState<Tone>(Tone.Professional);
  const [schedule, setSchedule] = useState<PostSchedule>({ status: 'Draft', date: null });
  const [socialOverlayText, setSocialOverlayText] = useState<string>('');
  const [socialAspectRatio, setSocialAspectRatio] = useState<AspectRatio>('4:3');
  const [generatedSocialContent, setGeneratedSocialContent] = useState<AllGeneratedContent | null>(null);
  
  // Ad Copy State
  const [adIdea, setAdIdea] = useState<string>('A local, eco-friendly house cleaning service that uses only natural products.');
  const [adTone, setAdTone] = useState<Tone>(Tone.Persuasive);
  const [adOverlayText, setAdOverlayText] = useState<string>('');
  const [adAspectRatio, setAdAspectRatio] = useState<AspectRatio>('16:9');
  const [generatedAdContent, setGeneratedAdContent] = useState<AllAdContent | null>(null);
  
  // Blog Post State
  const [blogKeyword, setBlogKeyword] = useState<string>('The benefits of remote work for small businesses');
  const [blogOverlayText, setBlogOverlayText] = useState<string>('');
  const [blogAspectRatio, setBlogAspectRatio] = useState<AspectRatio>('16:9');
  const [generatedBlogPost, setGeneratedBlogPost] = useState<BlogPost | null>(null);

  // Email Newsletter State
  const [emailKeyword, setEmailKeyword] = useState('New features in our SaaS product');
  const [emailTone, setEmailTone] = useState<Tone>(Tone.Friendly);
  const [emailDescription, setEmailDescription] = useState('Announce the launch of AI-powered analytics and team collaboration tools.');
  const [generatedEmail, setGeneratedEmail] = useState<EmailNewsletter | null>(null);

  // Twitter Thread State
  const [twitterThreadTitle, setTwitterThreadTitle] = useState('10 little-known tricks to boost your productivity instantly');
  const [generatedTwitterThread, setGeneratedTwitterThread] = useState<TwitterThread | null>(null);

  // YouTube State
  const [youtubeKeyword, setYoutubeKeyword] = useState<string>('How to start a successful podcast in 2024');
  const [generatedYouTubePackage, setGeneratedYouTubePackage] = useState<YouTubeVideoPackage | null>(null);

  // Prompt Builder State
  const [promptTarget, setPromptTarget] = useState<PromptTarget>(PromptTarget.SocialPost);
  const [promptStyle, setPromptStyle] = useState<ImageStyle>(ImageStyle.Photographic);
  const [promptSubject, setPromptSubject] = useState<string>('A Shiba Inu dog wearing cool sunglasses at the beach');
  const [promptOverlayText, setPromptOverlayText] = useState<string>('Summer Vibes');
  const [promptAspectRatio, setPromptAspectRatio] = useState<AspectRatio>('4:3');
  const [generatedPrompt, setGeneratedPrompt] = useState<PromptBuilderOutputs | null>(null);


  // History State
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const savedHistory = localStorage.getItem(historyKey);
      // FIX: Add a type guard to ensure the parsed history is an array.
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          return parsed as HistoryEntry[];
        }
      }
      return [];
    } catch (e) { return []; }
  });
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
  
  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(historyKey, JSON.stringify(history));
  }, [history, historyKey]);
  
  const addToHistory = (entry: Omit<HistoryEntry, 'id' | 'timestamp' | 'isFavorite'>) => {
    const newEntry = {
      ...entry,
      id: new Date().toISOString() + Math.random(),
      timestamp: new Date().toLocaleString(),
      isFavorite: false,
    } as HistoryEntry;
    setHistory(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50
  };

  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(entry => entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry));
  };

  // Generation Handlers
  const handleGenerateSocial = useCallback(async () => {
    if (!socialIdea.trim()) { setError('Please enter an idea.'); return; }
    setIsLoading(true); setError(null); setGeneratedSocialContent(null);
    try {
      const content = await generateSocialMediaContent(socialIdea, socialTone, socialAspectRatio);
      setGeneratedSocialContent(content);
      addToHistory({ type: 'social', inputs: { idea: socialIdea, tone: socialTone, schedule, overlayText: socialOverlayText, aspectRatio: socialAspectRatio }, outputs: content });
    } catch (err) { setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally { setIsLoading(false); }
  }, [socialIdea, socialTone, schedule, socialOverlayText, socialAspectRatio]);
  
  const handleGenerateAds = useCallback(async () => {
    if (!adIdea.trim()) { setError('Please enter a product/service idea.'); return; }
    setIsLoading(true); setError(null); setGeneratedAdContent(null);
    try {
      const content = await generateAdCopy(adIdea, adTone, adAspectRatio);
      setGeneratedAdContent(content);
      addToHistory({ type: 'ads', inputs: { idea: adIdea, tone: adTone, overlayText: adOverlayText, aspectRatio: adAspectRatio }, outputs: content });
    } catch (err) { setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally { setIsLoading(false); }
  }, [adIdea, adTone, adOverlayText, adAspectRatio]);
  
  const handleGenerateBlog = useCallback(async () => {
    if (!blogKeyword.trim()) { setError('Please enter a target keyword.'); return; }
    setIsLoading(true); setError(null); setGeneratedBlogPost(null);
    try {
      const content = await generateBlogPost(blogKeyword, blogAspectRatio);
      setGeneratedBlogPost(content);
      addToHistory({ type: 'blog', inputs: { keyword: blogKeyword, overlayText: blogOverlayText, aspectRatio: blogAspectRatio }, outputs: content });
    } catch (err) { setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally { setIsLoading(false); }
  }, [blogKeyword, blogOverlayText, blogAspectRatio]);

   const handleGenerateEmail = useCallback(async () => {
    if (!emailKeyword.trim() || !emailDescription.trim()) { setError('Please provide a keyword and description.'); return; }
    setIsLoading(true); setError(null); setGeneratedEmail(null);
    try {
        const content = await generateEmailNewsletter(emailKeyword, emailTone, emailDescription);
        setGeneratedEmail(content);
        addToHistory({ type: 'email', inputs: { keyword: emailKeyword, tone: emailTone, description: emailDescription }, outputs: content });
    } catch (err) { setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally { setIsLoading(false); }
  }, [emailKeyword, emailTone, emailDescription]);

  const handleGenerateTwitterThread = useCallback(async () => {
    if (!twitterThreadTitle.trim()) { setError('Please provide a topic/title for the thread.'); return; }
    setIsLoading(true); setError(null); setGeneratedTwitterThread(null);
    try {
        const content = await generateTwitterThread(twitterThreadTitle);
        setGeneratedTwitterThread(content);
        addToHistory({ type: 'twitterThread', inputs: { title: twitterThreadTitle }, outputs: content });
    } catch (err) { setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally { setIsLoading(false); }
  }, [twitterThreadTitle]);


  const handleGenerateYouTubePackage = useCallback(async () => {
    if (!youtubeKeyword.trim()) { setError('Please provide a topic/keyword for your video.'); return; }
    setIsLoading(true); setError(null); setGeneratedYouTubePackage(null);
    try {
        const content = await generateYouTubeVideoPackage(youtubeKeyword);
        setGeneratedYouTubePackage(content);
        addToHistory({ type: 'youtubeVideo', inputs: { keyword: youtubeKeyword }, outputs: content });
    } catch (err) { setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally { setIsLoading(false); }
  }, [youtubeKeyword]);

  const handleGeneratePromptAndImage = useCallback(async () => {
    if (!promptSubject.trim()) { setError('Please provide a subject for the prompt.'); return; }
    setIsLoading(true); setError(null); setGeneratedPrompt(null);
    try {
        const content = await generatePromptAndImagePreview(promptTarget, promptStyle, promptSubject, promptOverlayText, promptAspectRatio);
        setGeneratedPrompt(content);
        addToHistory({ type: 'promptBuilder', inputs: { target: promptTarget, style: promptStyle, subject: promptSubject, overlayText: promptOverlayText, aspectRatio: promptAspectRatio }, outputs: content });
    } catch (err) { setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally { setIsLoading(false); }
  }, [promptTarget, promptStyle, promptSubject, promptOverlayText, promptAspectRatio]);


  // UI Handlers
  const loadFromHistory = (entry: HistoryEntry) => {
    setError(null);
    if (entry.type === 'social') {
      setSocialIdea(entry.inputs.idea);
      setSocialTone(entry.inputs.tone);
      setSchedule(entry.inputs.schedule || { status: 'Draft', date: null });
      setSocialOverlayText(entry.inputs.overlayText || '');
      setSocialAspectRatio(entry.inputs.aspectRatio || '4:3');
      setGeneratedSocialContent(entry.outputs);
      setActiveTool('social');
    } else if (entry.type === 'ads') {
      setAdIdea(entry.inputs.idea);
      setAdTone(entry.inputs.tone);
      setAdOverlayText(entry.inputs.overlayText || '');
      setAdAspectRatio(entry.inputs.aspectRatio || '16:9');
      setGeneratedAdContent(entry.outputs);
      setActiveTool('ads');
    } else if (entry.type === 'blog') {
      setBlogKeyword(entry.inputs.keyword);
      setBlogOverlayText(entry.inputs.overlayText || '');
      setBlogAspectRatio(entry.inputs.aspectRatio || '16:9');
      setGeneratedBlogPost(entry.outputs);
      setActiveTool('blog');
    } else if (entry.type === 'email') {
      setEmailKeyword(entry.inputs.keyword);
      setEmailTone(entry.inputs.tone);
      setEmailDescription(entry.inputs.description);
      setGeneratedEmail(entry.outputs);
      setActiveTool('email');
    } else if (entry.type === 'twitterThread') {
      setTwitterThreadTitle(entry.inputs.title);
      setGeneratedTwitterThread(entry.outputs);
      setActiveTool('twitterThread');
    } else if (entry.type === 'youtubeVideo') {
      setYoutubeKeyword(entry.inputs.keyword);
      setGeneratedYouTubePackage(entry.outputs);
      setActiveTool('youtube');
    } else if (entry.type === 'promptBuilder') {
      setPromptTarget(entry.inputs.target);
      setPromptStyle(entry.inputs.style);
      setPromptSubject(entry.inputs.subject);
      setPromptOverlayText(entry.inputs.overlayText);
      setPromptAspectRatio(entry.inputs.aspectRatio || '4:3');
      setGeneratedPrompt(entry.outputs);
      setActiveTool('promptBuilder');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmClearHistory = () => {
    setHistory([]);
    setShowClearHistoryConfirm(false);
  };

  const handleDownloadYouTubePackage = () => {
    if (!generatedYouTubePackage) return;

    const { channelNameIdeas, channelDescription, logo, coverImage, videoTitleIdeas, videoHashtags, videoDescription, targetKeywords, videoScript } = generatedYouTubePackage;

    const content = `
BOOST CRAWL - YOUTUBE CONTENT PACKAGE
=======================================

VIDEO TOPIC: ${youtubeKeyword}
GENERATED AT: ${new Date().toLocaleString()}

--- CHANNEL BRANDING ---

### CHANNEL NAME IDEAS:
${channelNameIdeas.map(name => `- ${name}`).join('\n')}

### CHANNEL DESCRIPTION:
${channelDescription}

### LOGO / ICON:
- Prompt: ${logo.prompt}
- Aspect Ratio: ${logo.aspectRatio}
- SVG Icon Idea: ${logo.svgIconIdea}

### COVER IMAGE / BANNER:
- Prompt: ${coverImage.prompt}
- Aspect Ratio: ${coverImage.aspectRatio}


--- VIDEO CONTENT ---

### VIDEO TITLE IDEAS:
${videoTitleIdeas.map((title, i) => `${i + 1}. ${title}`).join('\n')}

### TARGET KEYWORDS:
${targetKeywords.join(', ')}

### HASHTAGS:
${videoHashtags.join(' ')}

### VIDEO DESCRIPTION:
${videoDescription}


--- VIDEO SCRIPT ---
${videoScript}
`;
    
    const blob = new Blob([content.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube_package_${youtubeKeyword.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
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
        className="p-1.5 text-base-content/60 hover:text-white"
        title={copied ? 'Copied!' : 'Copy'}
        >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        </button>
    );
    };

    const groupedHistory = useMemo(() => {
        const groups: { [key: string]: HistoryEntry[] } = {};
        sortedHistory.forEach(entry => {
            const date = new Date(entry.id.split('+')[0]).toDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(entry);
        });
        return groups;
    }, [sortedHistory]);

    const formatDateGroup = (dateString: string) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const inputDate = new Date(dateString);

        if (inputDate.toDateString() === today.toDateString()) return 'Today';
        if (inputDate.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return inputDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    };

  const ASPECT_RATIOS: AspectRatio[] = ['1:1', '16:9', '4:3', '3:4', '9:16'];
  const formatAspectRatioForCss = (ratio: AspectRatio) => {
    const mapping: Record<AspectRatio, string> = {
        '1:1': 'aspect-square',
        '16:9': 'aspect-video',
        '4:3': 'aspect-[4/3]',
        '3:4': 'aspect-[3/4]',
        '9:16': 'aspect-[9/16]',
    };
    return mapping[ratio];
  }
  
  // FIX: Replace Object.values(Enum) with explicit arrays to avoid potential TypeScript typing issues.
  const TONES: Tone[] = [Tone.Professional, Tone.Witty, Tone.Urgent, Tone.Persuasive, Tone.Friendly];
  const PLATFORMS: Platform[] = [Platform.LinkedIn, Platform.Twitter, Platform.Instagram];
  const AD_PLATFORMS: AdPlatform[] = [AdPlatform.Google, AdPlatform.Facebook, AdPlatform.LinkedIn];
  const PROMPT_TARGETS: PromptTarget[] = [
      PromptTarget.SocialPost,
      PromptTarget.AdCopy,
      PromptTarget.BlogPost,
      PromptTarget.BrandLogo,
      PromptTarget.LinkedInBanner,
      PromptTarget.Merchandise,
      PromptTarget.YouTubeThumbnail
  ];
  const IMAGE_STYLES: ImageStyle[] = [
      ImageStyle.Photographic,
      ImageStyle.Portrait,
      ImageStyle.Anime,
      ImageStyle.ThreeD,
      ImageStyle.TwoD
  ];

  const TOOLS: { id: Tool; label: string }[] = [
    { id: 'social', label: 'Social Posts' },
    { id: 'schedule', label: 'Content Schedule' },
    { id: 'promptBuilder', label: 'Prompt Builder' },
    { id: 'ads', label: 'Ad Copy' },
    { id: 'blog', label: 'Blog Post' },
    { id: 'twitterThread', label: 'Twitter Thread' },
    { id: 'email', label: 'Email Newsletter' },
    { id: 'youtube', label: 'YouTube Video' },
  ];
  
  const AspectRatioSelector: React.FC<{
    value: AspectRatio;
    onChange: (value: AspectRatio) => void;
    disabled?: boolean;
    label: string;
  }> = ({ value, onChange, disabled, label }) => (
    <div>
        <label className="font-semibold text-white mb-3">{label}</label>
        <div className="grid grid-cols-5 gap-2 mt-2">
            {ASPECT_RATIOS.map(ratio => (
                <button
                    key={ratio}
                    onClick={() => onChange(ratio)}
                    disabled={disabled}
                    className={`py-2 px-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-secondary ${value === ratio ? 'bg-brand-secondary text-white' : 'bg-base-300 hover:bg-base-300/80'}`}
                >
                    {ratio}
                </button>
            ))}
        </div>
    </div>
  );

  const renderToolUI = () => {
    switch(activeTool) {
      case 'social': return (
        <>
            <div className="bg-base-200 p-6 rounded-2xl shadow-lg mb-8 sticky top-4 z-10 backdrop-blur-sm bg-base-200/80">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <div className="flex flex-col gap-4">
                    <label htmlFor="idea-input" className="font-semibold text-white">Your Content Idea</label>
                    <textarea id="idea-input" value={socialIdea} onChange={(e) => setSocialIdea(e.target.value)} placeholder="e.g., A sustainable coffee brand..." className="w-full h-24 p-3 bg-base-300 rounded-lg text-base-content border border-base-300 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" disabled={isLoading}/>
                  </div>
                  <div className="flex flex-col gap-4">
                     <label className="font-semibold text-white">Choose a Tone</label>
                     <div className="grid grid-cols-3 gap-2">
                        {TONES.map((t) => (<button key={t} onClick={() => setSocialTone(t)} className={`py-2 px-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-secondary ${socialTone === t ? 'bg-brand-secondary text-white' : 'bg-base-300 hover:bg-base-300/80'}`} disabled={isLoading}>{t}</button>))}
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 items-start">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="social-overlay-text" className="font-semibold text-white">Text Overlay (Optional)</label>
                        <input id="social-overlay-text" value={socialOverlayText} onChange={(e) => setSocialOverlayText(e.target.value)} placeholder="e.g., Summer Sale!" className="w-full p-3 bg-base-300 rounded-lg text-base-content border border-base-300 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" disabled={isLoading}/>
                        <div className="pt-1">
                            <h4 className="font-semibold text-white mb-3">Scheduling</h4>
                            <div className="flex items-center gap-2 flex-wrap">
                            {(['Draft', 'Scheduled', 'Published'] as const).map(status => (
                                <button key={status} onClick={() => setSchedule(s => ({...s, status}))} className={`px-3 py-1.5 text-xs font-semibold rounded-full ${schedule.status === status ? 'bg-brand-light text-white' : 'bg-base-300 hover:bg-base-300/80'}`}>{status}</button>
                            ))}
                            <input type="datetime-local" value={schedule.date ? schedule.date.substring(0, 16) : ''} onChange={e => setSchedule(s => ({...s, date: e.target.value || null}))} className="p-1.5 bg-base-300 rounded-md text-base-content border border-base-300/50 focus:ring-1 focus:ring-brand-secondary focus:outline-none transition text-xs" disabled={schedule.status !== 'Scheduled'} />
                            </div>
                        </div>
                    </div>
                    <AspectRatioSelector label="Image Aspect Ratio" value={socialAspectRatio} onChange={setSocialAspectRatio} disabled={isLoading} />
                </div>
                <button onClick={handleGenerateSocial} disabled={isLoading} className="w-full mt-6 py-3 px-6 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 disabled:bg-base-300 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"> {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating...</>) : ('✨ Generate Social Posts')}</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {PLATFORMS.map((platform) => (<ContentCard key={platform} platform={platform} content={generatedSocialContent?.[platform]} isLoading={isLoading} aspectRatio={formatAspectRatioForCss(socialAspectRatio)} overlayText={socialOverlayText} />))}
              </div>
        </>
      );
      case 'schedule':
        return <ScheduleView history={history} onReload={loadFromHistory} />;
      case 'ads': return (
        <>
            <div className="bg-base-200 p-6 rounded-2xl shadow-lg mb-8 sticky top-4 z-10 backdrop-blur-sm bg-base-200/80">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <div className="flex flex-col gap-4">
                    <label htmlFor="ad-idea-input" className="font-semibold text-white">Product/Service Idea</label>
                    <textarea id="ad-idea-input" value={adIdea} onChange={(e) => setAdIdea(e.target.value)} placeholder="e.g., An online course for learning guitar" className="w-full h-24 p-3 bg-base-300 rounded-lg text-base-content border border-base-300 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" disabled={isLoading}/>
                    <label htmlFor="ad-overlay-text" className="font-semibold text-white">Text Overlay (Optional)</label>
                    <input id="ad-overlay-text" value={adOverlayText} onChange={(e) => setAdOverlayText(e.target.value)} placeholder="e.g., 50% OFF!" className="w-full p-3 bg-base-300 rounded-lg text-base-content border border-base-300 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" disabled={isLoading}/>
                  </div>
                  <div className="flex flex-col gap-4">
                     <label className="font-semibold text-white">Choose a Tone</label>
                     <div className="grid grid-cols-3 gap-2">
                         {TONES.map((t) => (<button key={t} onClick={() => setAdTone(t)} className={`py-2 px-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-secondary ${adTone === t ? 'bg-brand-secondary text-white' : 'bg-base-300 hover:bg-base-300/80'}`} disabled={isLoading}>{t}</button>))}
                     </div>
                     <AspectRatioSelector label="Image Aspect Ratio" value={adAspectRatio} onChange={setAdAspectRatio} disabled={isLoading} />
                  </div>
                </div>
                 <button onClick={handleGenerateAds} disabled={isLoading} className="w-full mt-6 py-3 px-6 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 disabled:bg-base-300 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"> {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating...</>) : ('🚀 Generate Ad Copy')}</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {AD_PLATFORMS.map(platform => (<AdCard key={platform} platform={platform} content={generatedAdContent?.[platform]} isLoading={isLoading} overlayText={adOverlayText} aspectRatio={formatAspectRatioForCss(adAspectRatio)} />))}
            </div>
        </>
      );
      case 'blog': return (
         <>
            <div className="bg-base-200 p-6 rounded-2xl shadow-lg mb-8 sticky top-4 z-10 backdrop-blur-sm bg-base-200/80">
                <div className="grid md:grid-cols-2 gap-6 items-start">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="blog-keyword-input" className="font-semibold text-white">Target Keyword</label>
                        <input id="blog-keyword-input" type="text" value={blogKeyword} onChange={(e) => setBlogKeyword(e.target.value)} placeholder="e.g., SEO best practices for 2024" className="w-full p-3 bg-base-300 rounded-lg text-base-content border border-base-300 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" disabled={isLoading}/>
                        <label htmlFor="blog-overlay-text" className="font-semibold text-white">Header Image Text Overlay</label>
                        <input id="blog-overlay-text" type="text" value={blogOverlayText} onChange={(e) => setBlogOverlayText(e.target.value)} placeholder="Optional: Text on image" className="w-full p-3 bg-base-300 rounded-lg text-base-content border border-base-300 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" disabled={isLoading}/>
                    </div>
                    <AspectRatioSelector label="Header Image Aspect Ratio" value={blogAspectRatio} onChange={setBlogAspectRatio} disabled={isLoading} />
                </div>
                <button onClick={handleGenerateBlog} disabled={isLoading} className="w-full mt-6 py-3 px-6 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 disabled:bg-base-300 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"> {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating...</>) : ('✍️ Write Blog Post')}</button>
            </div>
            <div className="bg-base-200 rounded-2xl shadow-lg p-6 lg:p-8">
                 {isLoading ? (<div className="animate-pulse space-y-6">
                    <div className="h-8 bg-base-300 rounded w-3/4 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-4">
                            <div className="h-24 bg-base-300 rounded-lg"></div>
                            <div className="h-32 bg-base-300 rounded-lg"></div>
                        </div>
                        <div className="md:col-span-2">
                             <div className="h-64 bg-base-300 rounded-lg w-full"></div>
                        </div>
                    </div>
                    <div className="space-y-2 mt-6"><div className="h-4 bg-base-300 rounded"></div><div className="h-4 bg-base-300 rounded w-5/6"></div><div className="h-4 bg-base-300 rounded"></div><div className="h-4 bg-base-300 rounded w-4/6"></div></div>
                    </div>)
                 : generatedBlogPost ? (
                    <div className="space-y-8">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-white !mb-4">{generatedBlogPost.title}</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-base-300/50 p-4 rounded-lg">
                                    <h4 className="font-bold text-white mb-2">SEO Preview</h4>
                                    <div className="bg-base-100 p-3 rounded-md space-y-1">
                                        <p className="text-sm text-green-400 truncate">https://yoursite.com/blog/{generatedBlogPost.title.toLowerCase().replace(/\s+/g, '-')}</p>
                                        <h5 className="text-lg text-blue-400 font-medium truncate">{generatedBlogPost.title}</h5>
                                        <p className="text-sm text-base-content">{generatedBlogPost.metaDescription}</p>
                                    </div>
                                    <p className="text-xs text-right mt-2 text-base-content/60">{generatedBlogPost.metaDescription.length} / 160</p>
                                </div>
                                 <div className="bg-base-300/50 p-4 rounded-lg">
                                    <h4 className="font-bold text-white mb-3">Table of Contents</h4>
                                    <ul className="space-y-2">
                                        {generatedBlogPost.tableOfContents.map((item, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-brand-light font-bold">&rarr;</span>
                                                <a href="#" className="text-base-content hover:text-brand-light hover:underline transition-colors">{item}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="lg:col-span-2">
                                <ImageWithTextOverlay imageUrl={generatedBlogPost.imageUrl} overlayText={blogOverlayText} aspectRatio={formatAspectRatioForCss(blogAspectRatio)} altText={generatedBlogPost.title} />
                            </div>
                        </div>
                        <article className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-base-content prose-a:text-brand-light prose-strong:text-white">
                            <p className="whitespace-pre-wrap text-base leading-relaxed">{generatedBlogPost.content}</p>
                        </article>
                    </div>
                 ) : (
                    <div className="text-center py-10"><p className="text-base-content/70">Generate a blog post to see the full SEO-optimized article here.</p></div>
                 )}
            </div>
        </>
      );
      case 'email': return (
        <>
          <div className="bg-base-200 p-6 rounded-2xl shadow-lg mb-8 sticky top-4 z-10 backdrop-blur-sm bg-base-200/80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <label htmlFor="email-keyword" className="font-semibold text-white">Topic/Keyword</label>
                <input id="email-keyword" type="text" value={emailKeyword} onChange={(e) => setEmailKeyword(e.target.value)} className="w-full p-3 bg-base-300 rounded-lg" disabled={isLoading} />
                <label htmlFor="email-desc" className="font-semibold text-white">Purpose/Description</label>
                <textarea id="email-desc" value={emailDescription} onChange={(e) => setEmailDescription(e.target.value)} className="w-full h-24 p-3 bg-base-300 rounded-lg" disabled={isLoading} />
              </div>
              <div className="flex flex-col gap-4">
                <label className="font-semibold text-white">Choose a Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {TONES.map((t) => (<button key={t} onClick={() => setEmailTone(t)} className={`py-2 px-3 text-sm font-medium rounded-lg ${emailTone === t ? 'bg-brand-secondary text-white' : 'bg-base-300 hover:bg-base-300/80'}`} disabled={isLoading}>{t}</button>))}
                </div>
                <button onClick={handleGenerateEmail} disabled={isLoading} className="w-full mt-4 py-3 px-6 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-lg"> {isLoading ? 'Generating...' : '📧 Generate Email'}</button>
              </div>
            </div>
          </div>
          <div className="bg-base-200 rounded-2xl shadow-lg p-6 lg:p-8">
            {isLoading && <p>Loading...</p>}
            {generatedEmail && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-white">{generatedEmail.subject}</h3>
                  <CopyButton text={generatedEmail.subject} />
                </div>
                <hr className="border-base-300/50" />
                <article className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{generatedEmail.body}</p>
                </article>
              </div>
            )}
          </div>
        </>
      );
       case 'twitterThread': return (
         <>
            <div className="bg-base-200 p-6 rounded-2xl shadow-lg mb-8 sticky top-4 z-10 backdrop-blur-sm bg-base-200/80">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-grow w-full">
                        <label htmlFor="thread-title-input" className="font-semibold text-white">Thread Topic / Title</label>
                        <input id="thread-title-input" type="text" value={twitterThreadTitle} onChange={(e) => setTwitterThreadTitle(e.target.value)} placeholder="e.g., 5 mistakes to avoid when learning React" className="w-full mt-2 p-3 bg-base-300 rounded-lg text-base-content border border-base-300 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" disabled={isLoading}/>
                    </div>
                    <button onClick={handleGenerateTwitterThread} disabled={isLoading} className="w-full md:w-auto py-3 px-6 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 disabled:bg-base-300 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"> {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating...</>) : (<>🧵 Generate Thread</>)}</button>
                </div>
            </div>
            <div className="bg-base-200 rounded-2xl shadow-lg p-6 lg:p-8">
                 {isLoading ? (<div className="animate-pulse space-y-4">{[...Array(6)].map((_,i) => (<div key={i} className="space-y-2"><div className="h-4 bg-base-300 rounded w-full"></div><div className="h-4 bg-base-300 rounded w-5/6"></div></div>))}</div>)
                 : generatedTwitterThread ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <PlatformIcon platform={Platform.Twitter} className="w-8 h-8 text-white" />
                          <h2 className="text-2xl font-bold text-white">Generated Twitter Thread</h2>
                        </div>
                        {generatedTwitterThread.map((tweet, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-base-300 flex items-center justify-center font-bold text-white">{index + 1}</div>
                            <div className="flex-grow bg-base-300/50 p-4 rounded-lg relative group">
                              <p className="whitespace-pre-wrap text-base leading-relaxed text-base-content">{tweet}</p>
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <CopyButton text={tweet} />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                 ) : (
                    <div className="text-center py-10"><p className="text-base-content/70">Enter a topic to generate a 6-part Twitter thread.</p></div>
                 )}
            </div>
        </>
      );
      case 'youtube': return (
        <>
            <div className="bg-base-200 p-6 rounded-2xl shadow-lg mb-8 sticky top-4 z-10 backdrop-blur-sm bg-base-200/80">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-grow w-full">
                        <label htmlFor="youtube-keyword-input" className="font-semibold text-white">Video Topic / Keyword</label>
                        <input id="youtube-keyword-input" type="text" value={youtubeKeyword} onChange={(e) => setYoutubeKeyword(e.target.value)} placeholder="e.g., How to make sourdough bread" className="w-full mt-2 p-3 bg-base-300 rounded-lg text-base-content border border-base-300 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" disabled={isLoading}/>
                    </div>
                    <button onClick={handleGenerateYouTubePackage} disabled={isLoading} className="w-full md:w-auto py-3 px-6 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 disabled:bg-base-300 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"> {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating...</>) : ('🎬 Generate YouTube Package')}</button>
                </div>
            </div>
            {isLoading && (<div className="text-center py-10"><p className="text-base-content/70">Generating your complete YouTube video package...</p></div>)}
            {generatedYouTubePackage && !isLoading && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                      <button onClick={handleDownloadYouTubePackage} className="px-4 py-2 text-sm font-semibold rounded-full bg-brand-secondary hover:bg-brand-dark text-white transition-colors flex items-center gap-2">
                        <DownloadIcon />
                        <span>Download Content</span>
                      </button>
                    </div>

                    <div className="bg-base-200 p-6 rounded-xl shadow-lg">
                      <h3 className="text-2xl font-bold text-white mb-4">Channel Branding</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-brand-light mb-1">Channel Name Ideas</h4>
                          <ul className="list-disc list-inside text-white">{generatedYouTubePackage.channelNameIdeas.map((name, i) => <li key={i}>{name}</li>)}</ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-brand-light mb-1">Channel Description</h4>
                          <p className="whitespace-pre-wrap text-sm text-base-content">{generatedYouTubePackage.channelDescription}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="bg-base-300/50 p-4 rounded-lg">
                            <h5 className="font-bold text-white">Logo & Icon</h5>
                            <p className="text-xs mt-1"><strong className="text-base-content/80">Prompt:</strong> <span className="font-mono">{generatedYouTubePackage.logo.prompt}</span></p>
                            <p className="text-xs mt-1"><strong className="text-base-content/80">SVG Icon Idea:</strong> <span className="font-mono">{generatedYouTubePackage.logo.svgIconIdea}</span></p>
                            <p className="text-xs mt-1"><strong className="text-base-content/80">Aspect Ratio:</strong> <span className="font-mono">{generatedYouTubePackage.logo.aspectRatio}</span></p>
                          </div>
                          <div className="bg-base-300/50 p-4 rounded-lg">
                            <h5 className="font-bold text-white">Cover Image (Banner)</h5>
                             <p className="text-xs mt-1"><strong className="text-base-content/80">Prompt:</strong> <span className="font-mono">{generatedYouTubePackage.coverImage.prompt}</span></p>
                             <p className="text-xs mt-1"><strong className="text-base-content/80">Aspect Ratio:</strong> <span className="font-mono">{generatedYouTubePackage.coverImage.aspectRatio}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-base-200 p-6 rounded-xl shadow-lg">
                      <h3 className="text-2xl font-bold text-white mb-4">Video Details</h3>
                       <div>
                          <h4 className="font-semibold text-brand-light mb-2">Video Title Ideas</h4>
                          <ol className="list-decimal list-inside space-y-1">{generatedYouTubePackage.videoTitleIdeas.map((title, i) => <li key={i} className="font-semibold">{title}</li>)}</ol>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                         <div>
                            <h4 className="font-semibold text-brand-light mb-2">Target Keywords</h4>
                            <div className="flex flex-wrap gap-2">{generatedYouTubePackage.targetKeywords.map(tag => <span key={tag} className="bg-base-300 text-sm px-3 py-1 rounded-full font-medium">{tag}</span>)}</div>
                         </div>
                         <div>
                            <h4 className="font-semibold text-brand-light mb-2">Hashtags</h4>
                            <div className="flex flex-wrap gap-2">{generatedYouTubePackage.videoHashtags.map(tag => <span key={tag} className="bg-base-300 text-sm px-3 py-1 rounded-full font-mono">{tag}</span>)}</div>
                         </div>
                       </div>
                       <div className="mt-4">
                          <h4 className="font-semibold text-brand-light mb-2">Video Description</h4>
                          <p className="whitespace-pre-wrap text-sm text-base-content bg-base-300/50 p-3 rounded-lg">{generatedYouTubePackage.videoDescription}</p>
                       </div>
                    </div>

                    <div className="bg-base-200 p-6 rounded-xl shadow-lg">
                      <h3 className="text-2xl font-bold text-white mb-4">Video Script</h3>
                      <article className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-base-content prose-strong:text-white prose-code:text-brand-light">
                        <p className="whitespace-pre-wrap">{generatedYouTubePackage.videoScript}</p>
                      </article>
                    </div>
                </div>
            )}
            {!generatedYouTubePackage && !isLoading && (
              <div className="text-center py-10 bg-base-200 rounded-xl">
                <p className="text-base-content/70">Enter a video topic to generate a complete content package.</p>
              </div>
            )}
        </>
      );
      case 'promptBuilder': return (
        <>
            <div className="bg-base-200 p-6 rounded-2xl shadow-lg mb-8 sticky top-4 z-10 backdrop-blur-sm bg-base-200/80">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                     <div className="flex flex-col gap-4">
                        <label htmlFor="prompt-subject" className="font-semibold text-white">Main Subject / Idea</label>
                        <textarea id="prompt-subject" value={promptSubject} onChange={e => setPromptSubject(e.target.value)} placeholder="A majestic lion wearing a crown" className="w-full h-24 p-3 bg-base-300 rounded-lg"/>
                         <label htmlFor="prompt-overlay-text" className="font-semibold text-white">Text to Include in Image (Optional)</label>
                         <input id="prompt-overlay-text" value={promptOverlayText} onChange={e => setPromptOverlayText(e.target.value)} placeholder="e.g., King of the Jungle" className="w-full p-3 bg-base-300 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="prompt-target" className="font-semibold text-white">Generation Target</label>
                            <select id="prompt-target" value={promptTarget} onChange={e => setPromptTarget(e.target.value as PromptTarget)} className="w-full mt-2 p-3 bg-base-300 rounded-lg">
                                {PROMPT_TARGETS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="prompt-style" className="font-semibold text-white">Image/Video Style</label>
                            <select id="prompt-style" value={promptStyle} onChange={e => setPromptStyle(e.target.value as ImageStyle)} className="w-full mt-2 p-3 bg-base-300 rounded-lg">
                                {IMAGE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                         <div className="sm:col-span-2">
                             <AspectRatioSelector label="Image Aspect Ratio" value={promptAspectRatio} onChange={setPromptAspectRatio} disabled={isLoading} />
                         </div>
                    </div>
                </div>
                 <button onClick={handleGeneratePromptAndImage} disabled={isLoading} className="w-full mt-6 py-3 px-6 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"> {isLoading ? 'Building...' : (<><PromptBuilderIcon/> Build Prompt & Preview</>)}</button>
            </div>
            {isLoading && (<div className="text-center py-10"><p className="text-base-content/70">Building your prompt and generating a preview...</p></div>)}
            {generatedPrompt && !isLoading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-base-200 p-6 rounded-xl">
                        <h3 className="text-2xl font-bold text-white mb-4">Generated Prompt</h3>
                        <div className="relative group">
                            <p className="text-base-content bg-base-300/50 p-4 rounded-lg font-mono text-sm leading-relaxed">{generatedPrompt.detailedPrompt}</p>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <CopyButton text={generatedPrompt.detailedPrompt} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-base-200 p-6 rounded-xl">
                        <h3 className="text-2xl font-bold text-white mb-4">Image Preview</h3>
                        <ImageWithTextOverlay imageUrl={generatedPrompt.imageUrl} overlayText={promptOverlayText} aspectRatio={formatAspectRatioForCss(promptAspectRatio)} altText="Prompt preview"/>
                    </div>
                </div>
            )}
        </>
      );
      default: return null;
    }
  }

  const getHistoryEntryText = (entry: HistoryEntry) => {
    switch (entry.type) {
        case 'social': return `Social: ${entry.inputs.idea}`;
        case 'ads': return `Ads: ${entry.inputs.idea}`;
        case 'blog': return `Blog: ${entry.inputs.keyword}`;
        case 'email': return `Email: ${entry.inputs.keyword}`;
        case 'twitterThread': return `Thread: ${entry.inputs.title}`;
        case 'youtubeVideo': return `YouTube: ${entry.inputs.keyword}`;
        case 'promptBuilder': return `Prompt: ${entry.inputs.subject}`;
    }
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
        <header 
            className="text-center mb-8 rounded-2xl p-12 md:p-16 shadow-lg"
            style={{
                backgroundColor: '#1e3a8a',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg stroke='%233b82f6' stroke-width='60' stroke-opacity='0.2' %3E%3Ccircle fill='%231e3a8a' cx='0' cy='0' r='1800'/%3E%3Ccircle fill='%231c3886' cx='0' cy='0' r='1700'/%3E%3Ccircle fill='%231a3682' cx='0' cy='0' r='1600'/%3E%3Ccircle fill='%2319347e' cx='0' cy='0' r='1500'/%3E%3Ccircle fill='%2317327a' cx='0' cy='0' r='1400'/%3E%3Ccircle fill='%23163076' cx='0' cy='0' r='1300'/%3E%3Ccircle fill='%23142e72' cx='0' cy='0' r='1200'/%3E%3Ccircle fill='%23132c6e' cx='0' cy='0' r='1100'/%3E%3Ccircle fill='%23112a6a' cx='0' cy='0' r='1000'/%3E%3Ccircle fill='%23102866' cx='0' cy='0' r='900'/%3E%3Ccircle fill='%230e2662' cx='0' cy='0' r='800'/%3E%3Ccircle fill='%230d245e' cx='0' cy='0' r='700'/%3E%3Ccircle fill='%230b225a' cx='0' cy='0' r='600'/%3E%3Ccircle fill='%230a2056' cx='0' cy='0' r='500'/%3E%3Ccircle fill='%23081e52' cx='0' cy='0' r='400'/%3E%3Ccircle fill='%23071c4e' cx='0' cy='0' r='300'/%3E%3Ccircle fill='%23051a4a' cx='0' cy='0' r='200'/%3E%3Ccircle fill='%23041846' cx='0' cy='0' r='100'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Your Dashboard</h1>
            <p className="mt-2 text-lg text-gray-200 max-w-4xl mx-auto">Welcome, {user.name}! Select a tool to start generating content.</p>
        </header>
        <main>
          <div className="mb-8 flex justify-center border-b border-base-300/50 flex-wrap">
            {TOOLS.map(tool => (
              <button 
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`px-3 py-3 sm:px-4 text-sm sm:text-base font-semibold capitalize transition-colors focus:outline-none -mb-px ${activeTool === tool.id ? 'border-b-2 border-brand-secondary text-white' : 'text-base-content/70 hover:text-white'}`}
              >
                {tool.label}
              </button>
            ))}
          </div>

          {renderToolUI()}

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center my-8" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Your Personal History</h2>
                {history.length > 0 && (
                    <div>
                        {!showClearHistoryConfirm ? (
                            <button onClick={() => setShowClearHistoryConfirm(true)} className="px-4 py-2 text-sm font-semibold rounded-full bg-red-900/50 text-red-300 hover:bg-red-900/80 transition-colors">
                                Clear History
                            </button>
                        ) : (
                            <div className="flex items-center gap-3 bg-base-200 p-2 rounded-lg">
                                <span className="text-sm text-white">Are you sure?</span>
                                <button onClick={handleConfirmClearHistory} className="px-3 py-1 text-sm font-bold rounded-md bg-red-600 hover:bg-red-700 text-white">
                                    Yes, Clear
                                </button>
                                <button onClick={() => setShowClearHistoryConfirm(false)} className="px-3 py-1 text-sm font-semibold rounded-md bg-base-300 hover:bg-base-100 text-white">
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {history.length > 0 ? (
                <div className="space-y-6">
                    {Object.entries(groupedHistory).map(([date, entries]) => (
                        <div key={date}>
                            <h3 className="font-semibold text-lg text-brand-light mb-3 pb-2 border-b-2 border-base-300/50">{formatDateGroup(date)}</h3>
                            <div className="space-y-4">
                                {entries.map(entry => (
                                    <div key={entry.id} className="bg-base-200 p-4 rounded-xl flex justify-between items-center group">
                                        <div onClick={() => loadFromHistory(entry)} className="flex-grow cursor-pointer">
                                            <p className="font-semibold text-white truncate max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-2xl group-hover:text-brand-light transition-colors">{getHistoryEntryText(entry)}</p>
                                            <p className="text-sm text-base-content/60">{entry.timestamp}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => toggleFavorite(entry.id)} 
                                                title={entry.isFavorite ? "Unfavorite" : "Favorite"}
                                                className={`p-2 rounded-full transition-colors ${entry.isFavorite ? 'text-yellow-400 hover:bg-yellow-400/20' : 'text-base-content/60 hover:text-white hover:bg-base-300'}`}
                                            >
                                                <StarIcon isFilled={!!entry.isFavorite} />
                                            </button>
                                            <button onClick={() => loadFromHistory(entry)} className="px-4 py-2 text-sm font-semibold rounded-full bg-brand-secondary hover:bg-brand-dark transition-colors text-white hidden sm:block">Reload</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-base-200 rounded-xl">
                    <p className="text-base-content/70">No history yet. Generate some content to see it here!</p>
                </div>
            )}
          </div>
        </main>
    </div>
  );
};

export default App;