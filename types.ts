export enum Tone {
  Professional = 'Professional',
  Witty = 'Witty',
  Urgent = 'Urgent',
  Persuasive = 'Persuasive',
  Friendly = 'Friendly',
}

// Social Post Generator Types
export enum Platform {
  LinkedIn = 'LinkedIn',
  Twitter = 'Twitter',
  Instagram = 'Instagram',
}

export interface GeneratedContent {
  text: string;
  imageUrl: string;
}

export type AllGeneratedContent = {
  [key in Platform]?: GeneratedContent;
};

export interface PostSchedule {
  status: 'Draft' | 'Scheduled' | 'Published';
  date: string | null;
}


// Ad Generator Types
export enum AdPlatform {
  Google = 'Google Ads',
  Facebook = 'Facebook Ads',
  LinkedIn = 'LinkedIn Ads',
}

export interface AdContent {
  title: string;
  description: string;
  cta: string;
  targetKeyword: string;
  imageUrl: string;
}

export type AllAdContent = {
  [key in AdPlatform]?: AdContent;
};

// Blog Post Generator Types
export interface BlogPost {
  title: string;
  content: string; // Markdown content
  imageUrl: string;
  metaDescription: string;
  tableOfContents: string[];
}

// Email Newsletter Generator Types
export interface EmailNewsletter {
    subject: string;
    body: string; // Markdown content
}

// Twitter Thread Generator Types
export type TwitterThread = string[];

// YouTube Video Package Generator Types
export interface YouTubeVideoPackage {
    channelNameIdeas: string[];
    channelDescription: string;
    logo: {
        prompt: string;
        aspectRatio: '1:1';
        svgIconIdea: string;
    };
    coverImage: {
        prompt: string;
        aspectRatio: '16:9';
    };
    videoTitleIdeas: string[];
    videoHashtags: string[];
    videoDescription: string;
    targetKeywords: string[];
    videoScript: string;
}

// New Prompt Builder Types
export enum PromptTarget {
    SocialPost = "Social Media Post",
    AdCopy = "Ad Copy Image",
    BlogPost = "Blog Post Header",
    BrandLogo = "Brand Logo",
    LinkedInBanner = "LinkedIn Cover Banner",
    Merchandise = "Merchandise Mockup Quote",
    YouTubeThumbnail = "YouTube Thumbnail"
}

export enum ImageStyle {
    Photographic = "Photographic",
    Portrait = "Portrait",
    Anime = "Anime",
    ThreeD = "3D Animation",
    TwoD = "2D Animation",
}

export interface PromptBuilderOutputs {
    detailedPrompt: string;
    imageUrl: string;
}

// General Types
export type AspectRatio = '1:1' | '16:9' | '4:3' | '3:4' | '9:16';


// History Entry Union Type
type SocialHistoryEntry = {
  type: 'social';
  id: string;
  timestamp: string;
  isFavorite?: boolean;
  inputs: {
    idea: string;
    tone: Tone;
    schedule: PostSchedule;
    overlayText: string;
    aspectRatio: AspectRatio;
  };
  outputs: AllGeneratedContent;
}

type AdHistoryEntry = {
  type: 'ads';
  id: string;
  timestamp: string;
  isFavorite?: boolean;
  inputs: {
    idea: string;
    tone: Tone;
    overlayText: string;
    aspectRatio: AspectRatio;
  };
  outputs: AllAdContent;
}

type BlogHistoryEntry = {
  type: 'blog';
  id:string;
  timestamp: string;
  isFavorite?: boolean;
  inputs: {
    keyword: string;
    overlayText: string;
    aspectRatio: AspectRatio;
  };
  outputs: BlogPost;
}

type EmailHistoryEntry = {
    type: 'email';
    id: string;
    timestamp: string;
    isFavorite?: boolean;
    inputs: {
        keyword: string;
        tone: Tone;
        description: string;
    };
    outputs: EmailNewsletter;
}

type TwitterThreadHistoryEntry = {
    type: 'twitterThread';
    id: string;
    timestamp: string;
    isFavorite?: boolean;
    inputs: {
        title: string;
    };
    outputs: TwitterThread;
}

type YouTubeVideoPackageHistoryEntry = {
    type: 'youtubeVideo';
    id: string;
    timestamp: string;
    isFavorite?: boolean;
    inputs: {
        keyword: string;
    };
    outputs: YouTubeVideoPackage;
}

type PromptBuilderHistoryEntry = {
    type: 'promptBuilder';
    id: string;
    timestamp: string;
    isFavorite?: boolean;
    inputs: {
        target: PromptTarget;
        style: ImageStyle;
        subject: string;
        overlayText: string;
        aspectRatio: AspectRatio;
    };
    outputs: PromptBuilderOutputs;
}

export interface User {
  name: string;
  email: string;
}

export type HistoryEntry = SocialHistoryEntry | AdHistoryEntry | BlogHistoryEntry | EmailHistoryEntry | TwitterThreadHistoryEntry | YouTubeVideoPackageHistoryEntry | PromptBuilderHistoryEntry;

// Billing and Payment Types
export enum PaymentMethod {
    GooglePay = 'Google Pay',
    Paytm = 'Paytm',
    PhonePe = 'PhonePe',
}

export interface Invoice {
    id: string; // e.g., INV-2024-12345
    plan: 'Monthly' | 'Yearly';
    amount: number;
    date: string; // ISO string
    paymentMethod: PaymentMethod;
    phoneNumber: string;
}