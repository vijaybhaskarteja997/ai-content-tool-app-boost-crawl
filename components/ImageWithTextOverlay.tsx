import React, { useRef, useEffect, useState } from 'react';
import { DownloadIcon } from './Icons';

interface ImageWithTextOverlayProps {
    imageUrl: string;
    overlayText?: string;
    aspectRatio: string;
    altText: string;
}

export const ImageWithTextOverlay: React.FC<ImageWithTextOverlayProps> = ({ imageUrl, overlayText, aspectRatio, altText }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [downloadUrl, setDownloadUrl] = useState<string>('#');
    const [isDrawing, setIsDrawing] = useState(true);

    useEffect(() => {
        if (!imageUrl) return;
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;

        img.onload = () => {
            const containerWidth = canvas.parentElement?.clientWidth || 600;
            const originalAspectRatio = img.width / img.height;
            
            canvas.width = containerWidth;
            canvas.height = containerWidth / originalAspectRatio;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            if (overlayText) {
                // --- Text drawing logic ---
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                const padding = canvas.width * 0.05;
                
                // Dynamic font size
                let fontSize = Math.floor(canvas.width / 15);
                ctx.font = `bold ${fontSize}px sans-serif`;
                
                // Adjust font size if text is too wide
                while (ctx.measureText(overlayText).width > canvas.width - (padding * 2) && fontSize > 12) {
                    fontSize--;
                    ctx.font = `bold ${fontSize}px sans-serif`;
                }
                
                const textMetrics = ctx.measureText(overlayText);
                const textWidth = textMetrics.width;
                const textHeight = fontSize;
                
                // Centered position
                const rectX = (canvas.width - textWidth) / 2 - padding;
                const rectY = (canvas.height - textHeight) / 2 - padding;
                const rectWidth = textWidth + (padding * 2);
                const rectHeight = textHeight + (padding * 2);
                const cornerRadius = 10;
                
                // Draw semi-transparent background with rounded corners
                ctx.beginPath();
                ctx.moveTo(rectX + cornerRadius, rectY);
                ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
                ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + cornerRadius);
                ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
                ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - cornerRadius, rectY + rectHeight);
                ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
                ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - cornerRadius);
                ctx.lineTo(rectX, rectY + cornerRadius);
                ctx.quadraticCurveTo(rectX, rectY, rectX + cornerRadius, rectY);
                ctx.closePath();
                ctx.fill();

                // Draw text
                ctx.fillStyle = '#FFFFFF';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(overlayText, canvas.width / 2, canvas.height / 2);
            }

            setDownloadUrl(canvas.toDataURL('image/jpeg'));
            setIsDrawing(false);
        };
        
        img.onerror = () => {
            setIsDrawing(false);
            console.error("Failed to load image for canvas.");
        }

    }, [imageUrl, overlayText, aspectRatio]);
    
    return (
        <div className="relative group">
            {isDrawing && <div className={`w-full bg-base-300 rounded-lg animate-pulse ${aspectRatio}`}></div>}
            <canvas ref={canvasRef} className={`w-full rounded-lg object-cover ${aspectRatio} ${isDrawing ? 'hidden' : 'block'}`} />
            {!isDrawing && downloadUrl !== '#' && (
                 <a 
                    href={downloadUrl} 
                    download={`${altText.replace(/\s+/g, '_')}_with_text.jpeg`} 
                    title="Click to download image"
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                    <DownloadIcon className="w-10 h-10 text-white" />
                </a>
            )}
        </div>
    );
};
