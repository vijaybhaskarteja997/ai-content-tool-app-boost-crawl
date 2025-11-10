import { GoogleGenAI, Type } from "@google/genai";
import { AllGeneratedContent, Tone, Platform, AllAdContent, AdPlatform, BlogPost, EmailNewsletter, YouTubeVideoPackage, AdContent, TwitterThread, PromptBuilderOutputs, PromptTarget, ImageStyle, AspectRatio } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateText = (model: string, prompt: string) => {
  return ai.models.generateContent({ model, contents: prompt });
};

const generateImage = (prompt: string, aspectRatio: AspectRatio) => {
    return ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio,
        },
    });
};


export const generateSocialMediaContent = async (
    idea: string,
    tone: Tone,
    aspectRatio: AspectRatio
): Promise<AllGeneratedContent> => {
  try {
    const linkedInPrompt = `Based on the idea "${idea}", write a long-form, insightful, and engaging post for LinkedIn. The tone should be ${tone}. Include a clear call-to-action or a thought-provoking question to encourage discussion. Use paragraphs for readability.`;
    const twitterPrompt = `Based on the idea "${idea}", craft a short, punchy, and attention-grabbing tweet for Twitter/X. The tone should be ${tone}. Keep it well under 280 characters and include 1-2 relevant hashtags.`;
    const instagramPrompt = `Based on the idea "${idea}", generate a visually-focused and engaging caption for an Instagram post. The tone should be ${tone}. Describe an accompanying image and include 3-5 popular and relevant hashtags at the end.`;

    const imagePrompt = `A visually stunning, high-quality, professional photograph representing the concept: "${idea}". The image should be clean, modern, and eye-catching. Minimalist style.`;

    const [
      linkedInTextResponse,
      twitterTextResponse,
      instagramTextResponse,
      imageResponse,
    ] = await Promise.all([
      generateText('gemini-2.5-pro', linkedInPrompt),
      generateText('gemini-2.5-flash', twitterPrompt),
      generateText('gemini-2.5-flash', instagramPrompt),
      generateImage(imagePrompt, aspectRatio),
    ]);
    
    const imageUrl = `data:image/jpeg;base64,${imageResponse.generatedImages[0].image.imageBytes}`;
    
    const results: AllGeneratedContent = {
      [Platform.LinkedIn]: {
        text: linkedInTextResponse.text.trim(),
        imageUrl,
      },
      [Platform.Twitter]: {
        text: twitterTextResponse.text.trim(),
        imageUrl,
      },
      [Platform.Instagram]: {
        text: instagramTextResponse.text.trim(),
        imageUrl,
      }
    };

    return results;

  } catch (error) {
    console.error("Error generating social media content:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate content: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating content.");
  }
};

export const generateAdCopy = async (
  idea: string,
  tone: Tone,
  aspectRatio: AspectRatio
): Promise<AllAdContent> => {
  try {
    const adPrompt = `Generate compelling ad copy for Google Ads, Facebook Ads, and LinkedIn Ads based on the following product/service idea: "${idea}". The desired tone is ${tone}. For each platform, provide a catchy title, a persuasive description, a clear call-to-action (CTA), one primary target keyword, and a descriptive prompt for an AI to generate a relevant image.`;

    const adPlatformSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'A short, catchy title for the ad.' },
        description: { type: Type.STRING, description: 'The main body text of the ad, persuasive and concise.' },
        cta: { type: Type.STRING, description: 'A clear call-to-action, like "Learn More" or "Shop Now".' },
        targetKeyword: { type: Type.STRING, description: 'The single most important keyword for targeting this ad.' },
        imagePrompt: { type: Type.STRING, description: 'A descriptive prompt for an AI image generator to create a relevant and eye-catching ad image.' },
      },
      required: ['title', 'description', 'cta', 'targetKeyword', 'imagePrompt'],
    };

    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: adPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            [AdPlatform.Google]: { ...adPlatformSchema, description: "Ad copy optimized for Google Search Ads." },
            [AdPlatform.Facebook]: { ...adPlatformSchema, description: "Ad copy optimized for Facebook's news feed." },
            [AdPlatform.LinkedIn]: { ...adPlatformSchema, description: "Ad copy optimized for a professional LinkedIn audience." },
          },
        },
      },
    });

    // FIX: Add explicit type assertion to JSON.parse to prevent type inference issues.
    const textJsonResponse = JSON.parse(textResponse.text.trim()) as Record<AdPlatform, Omit<AdContent, 'imageUrl'> & { imagePrompt: string }>;

    const imageGenerationPromises = (Object.values(AdPlatform) as AdPlatform[]).map(async (platform) => {
      const platformContent = textJsonResponse[platform];
      if (platformContent && platformContent.imagePrompt) {
        const imageResponse = await generateImage(platformContent.imagePrompt, aspectRatio);
        return { platform, imageUrl: `data:image/jpeg;base64,${imageResponse.generatedImages[0].image.imageBytes}` };
      }
      return { platform, imageUrl: '' };
    });

    const generatedImages = await Promise.all(imageGenerationPromises);

    const finalAdContent: AllAdContent = {};
    for (const { platform, imageUrl } of generatedImages) {
        if(textJsonResponse[platform]){
            finalAdContent[platform] = {
                ...textJsonResponse[platform],
                imageUrl,
            };
        }
    }

    return finalAdContent;

  } catch (error) {
    console.error("Error generating ad copy:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate ad copy: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating ad copy.");
  }
};


export const generateBlogPost = async (
  keyword: string,
  aspectRatio: AspectRatio,
): Promise<BlogPost> => {
  try {
    const blogPrompt = `You are an expert SEO content writer. Generate a comprehensive, human-like blog post about "${keyword}".
    The output must be a JSON object that includes:
    1. A compelling, SEO-friendly H1 title.
    2. An SEO-optimized meta description (around 150 characters).
    3. A table of contents as an array of strings, based on the main H2 headings in the content.
    4. The full blog post content in Markdown format (at least 800 words), structured with H2/H3 subheadings, lists, bold text, and a concluding summary.
    The primary keyword should be naturally integrated throughout the content. The tone should be authoritative yet accessible.`;

    const imagePrompt = `A high-quality, professional blog header image representing the concept of "${keyword}". It should be visually appealing, relevant, and suitable for a web article.`;
    
    const textPromise = ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: blogPrompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING, description: "The full blog post in Markdown format." },
                    metaDescription: { type: Type.STRING, description: "An SEO-optimized meta description, around 150 characters." },
                    tableOfContents: {
                        type: Type.ARRAY,
                        description: "An array of strings for the main headings (H2) for a table of contents.",
                        items: { type: Type.STRING }
                    }
                },
                required: ['title', 'content', 'metaDescription', 'tableOfContents']
            }
        }
    });

    const imagePromise = generateImage(imagePrompt, aspectRatio);

    const [textResponse, imageResponse] = await Promise.all([textPromise, imagePromise]);

    // FIX: Add explicit type assertion to JSON.parse to prevent type inference issues.
    const textContent = JSON.parse(textResponse.text.trim()) as Omit<BlogPost, 'imageUrl'>;
    const imageUrl = `data:image/jpeg;base64,${imageResponse.generatedImages[0].image.imageBytes}`;

    return { ...textContent, imageUrl };
  } catch (error) {
    console.error("Error generating blog post:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate blog post: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating blog post.");
  }
};

export const generateEmailNewsletter = async (
    keyword: string,
    tone: Tone,
    description: string
): Promise<EmailNewsletter> => {
    try {
        const prompt = `Generate an engaging email newsletter.
        Main Topic/Keyword: "${keyword}"
        Tone: ${tone}
        Brief Description of Purpose: "${description}"
        
        The newsletter should have a catchy subject line and a body formatted in Markdown. 
        The body should be well-structured with headings, bullet points, and a clear call-to-action.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        subject: { type: Type.STRING, description: 'A compelling, short subject line for the email.' },
                        body: { type: Type.STRING, description: 'The full content of the newsletter, formatted in Markdown.' },
                    },
                    required: ['subject', 'body'],
                }
            }
        });

        // FIX: Explicitly cast the parsed JSON to the expected type to ensure correct type inference.
        const jsonResponse = JSON.parse(response.text.trim()) as EmailNewsletter;
        return jsonResponse;
    } catch (error) {
        console.error("Error generating email newsletter:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate email newsletter: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the email newsletter.");
    }
};

export const generateTwitterThread = async (
    title: string
): Promise<TwitterThread> => {
    try {
        const prompt = `Create a compelling and engaging Twitter thread based on the topic: "${title}".
        The thread must consist of exactly 6 tweets.
        Each tweet must be under 280 characters.
        The first tweet should be a strong hook.
        The subsequent tweets should build upon the topic, providing value, insights, or a narrative.
        The last tweet should provide a concluding thought or a call to action.
        Use hashtags where appropriate.
        The output must be a JSON object containing a list of strings, where each string is a tweet.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        thread: {
                            type: Type.ARRAY,
                            description: 'A list of exactly 6 strings, where each string is a tweet for the thread.',
                            items: {
                                type: Type.STRING
                            }
                        }
                    },
                    required: ['thread'],
                }
            }
        });
        
        // FIX: Explicitly cast the parsed JSON to ensure correct type inference.
        const jsonResponse = JSON.parse(response.text.trim()) as { thread: TwitterThread };
        return jsonResponse.thread;

    } catch (error) {
        console.error("Error generating Twitter thread:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate Twitter thread: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the Twitter thread.");
    }
};


export const generateYouTubeVideoPackage = async (
    keyword: string
): Promise<YouTubeVideoPackage> => {
    try {
        const prompt = `Based on the video topic keyword "${keyword}", generate a complete YouTube content package. The output must be a well-structured JSON object.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        channelNameIdeas: {
                            type: Type.ARRAY,
                            description: 'A list of 3-5 creative and catchy names for a new YouTube channel related to the keyword.',
                            items: { type: Type.STRING },
                        },
                        channelDescription: { type: Type.STRING, description: 'A compelling, SEO-friendly "About" section description for the channel.' },
                        logo: {
                            type: Type.OBJECT,
                            properties: {
                                prompt: { type: Type.STRING, description: 'A descriptive prompt for an AI image generator to create a channel logo/icon.' },
                                aspectRatio: { type: Type.STRING, description: 'Must be "1:1".' },
                                svgIconIdea: { type: Type.STRING, description: 'A conceptual idea for a simple SVG icon representing the channel brand.' },
                            },
                            required: ['prompt', 'aspectRatio', 'svgIconIdea'],
                        },
                        coverImage: {
                             type: Type.OBJECT,
                             properties: {
                                prompt: { type: Type.STRING, description: 'A descriptive prompt for an AI image generator to create a visually appealing YouTube channel banner/cover image.' },
                                aspectRatio: { type: Type.STRING, description: 'Must be "16:9".' },
                             },
                             required: ['prompt', 'aspectRatio'],
                        },
                        videoTitleIdeas: {
                            type: Type.ARRAY,
                            description: 'A list of exactly 10 engaging and SEO-friendly video titles based on the keyword.',
                            items: { type: Type.STRING },
                        },
                        videoHashtags: {
                            type: Type.ARRAY,
                            description: 'A list of 10-15 relevant hashtags for the video.',
                            items: { type: Type.STRING },
                        },
                        videoDescription: { type: Type.STRING, description: 'A well-structured, SEO-optimized video description template, using Markdown for formatting. Include placeholders like [Link to X].' },
                        targetKeywords: {
                            type: Type.ARRAY,
                            description: 'A list of 5-10 primary and secondary keywords to target for the video.',
                            items: { type: Type.STRING },
                        },
                        videoScript: { type: Type.STRING, description: 'A complete, ready-to-read video script. The script should be formatted in Markdown with sections like "[Intro]", "[Main Content]", "[Outro]", and include timestamps (e.g., 00:15). It should be engaging and conversational.' },
                    },
                    required: ['channelNameIdeas', 'channelDescription', 'logo', 'coverImage', 'videoTitleIdeas', 'videoHashtags', 'videoDescription', 'targetKeywords', 'videoScript'],
                },
            },
        });

        // FIX: Directly cast the parsed JSON to the YouTubeVideoPackage type for better type safety.
        const youtubePackage = JSON.parse(response.text.trim()) as YouTubeVideoPackage;
        return youtubePackage;
    } catch (error) {
        console.error("Error generating YouTube video package:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate YouTube video package: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the YouTube video package.");
    }
};

export const generatePromptAndImagePreview = async (
    target: PromptTarget,
    style: ImageStyle,
    subject: string,
    overlayText: string,
    aspectRatio: AspectRatio
): Promise<PromptBuilderOutputs> => {
    try {
        const promptGenerationPrompt = `
        You are an expert prompt engineer for AI image generation models like Imagen.
        Your task is to create a single, detailed, and effective prompt based on the user's request.
        The prompt should be a single paragraph. Do not use lists or bullet points.
        Describe the scene, subject, style, composition, lighting, and any specific details to ensure a high-quality, visually stunning result.

        User Request:
        - Generation Target: ${target}
        - Desired Style: ${style}
        - Main Subject: "${subject}"
        ${overlayText ? `- Crucially, the image must contain the following text, rendered clearly and accurately: "${overlayText}"` : ''}

        Generate the prompt now.
        `;

        const promptResponse = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: promptGenerationPrompt });
        const detailedPrompt = promptResponse.text.trim();

        const imageResponse = await generateImage(detailedPrompt, aspectRatio);
        const imageUrl = `data:image/jpeg;base64,${imageResponse.generatedImages[0].image.imageBytes}`;

        return { detailedPrompt, imageUrl };

    } catch (error) {
        console.error("Error in prompt builder:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to build prompt and image: ${error.message}`);
        }
        throw new Error("An unknown error occurred in the prompt builder.");
    }
};