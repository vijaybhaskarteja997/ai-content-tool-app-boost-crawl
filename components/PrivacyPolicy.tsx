import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types';

interface PrivacyPolicyProps {
    user: User;
    onNavigate: (page: 'app') => void;
}

const DEFAULT_POLICY_TEXT = `**Last Updated: 2047**

Welcome to Boost Crawl ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.

## 1. Information We Collect
We may collect personal information that you provide to us directly, such as:
- **Personal Details:** Your name, email address, and password when you register for an account.
- **Usage Data:** Your generation history, which is stored locally in your browser, associated with your account.
- **Contact Information:** Information you provide when you contact us for support.

## 2. How We Use Your Information
We use the information we collect to:
- Create and manage your account.
- Provide, operate, and maintain our services.
- Improve and personalize our services.
- Communicate with you for customer service and updates.
- Process your transactions and maintain a record of your payment history.

## 3. Sharing Your Information
We do not sell or trade your Personally Identifiable Information. We may share information with trusted third-party service providers who assist us in operating our application, so long as those parties agree to keep this information confidential.

## 4. Data Security
We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks.

## 5. Contact Us
If you have any questions about this Privacy Policy, please contact us through the contact form on our application.`;

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ user, onNavigate }) => {
    const policyKey = useMemo(() => `privacyPolicy_${user.email}`, [user.email]);
    
    const [policyText, setPolicyText] = useState<string>(() => {
        return localStorage.getItem(policyKey) || DEFAULT_POLICY_TEXT;
    });
    const [editText, setEditText] = useState<string>(policyText);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        localStorage.setItem(policyKey, policyText);
    }, [policyText, policyKey]);

    const handleSave = () => {
        setPolicyText(editText);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditText(policyText);
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto bg-base-200 rounded-2xl shadow-lg p-8 sm:p-12 my-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-white">Privacy Policy</h1>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm font-semibold rounded-full bg-brand-secondary hover:bg-brand-dark text-white transition-colors"
                    >
                        Edit Policy
                    </button>
                )}
            </div>
            
            {isEditing ? (
                <div className="space-y-4">
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full h-96 p-3 bg-base-300 rounded-lg text-base-content border border-base-300 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition"
                        aria-label="Privacy policy editor"
                    />
                    <div className="flex justify-end gap-3">
                        <button onClick={handleCancel} className="px-4 py-2 text-sm font-semibold rounded-lg bg-base-300 hover:bg-base-100 text-white transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-primary hover:bg-brand-dark text-white transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>
            ) : (
                <article className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-base-content prose-a:text-brand-light prose-strong:text-white">
                    {/* A simple way to render markdown-like text */}
                    {policyText.split('\n').map((paragraph, index) => {
                        if (paragraph.startsWith('## ')) {
                            return <h2 key={index} className="!mt-6 !mb-2">{paragraph.substring(3)}</h2>;
                        }
                        if (paragraph.startsWith('- ')) {
                            return <li key={index} className="ml-5">{paragraph.substring(2)}</li>
                        }
                        if (paragraph.startsWith('**')) {
                             return <p key={index}><strong >{paragraph.replaceAll('**', '')}</strong></p>;
                        }
                        return <p key={index}>{paragraph}</p>;
                    })}
                </article>
            )}

            <div className="mt-10 text-center">
                <button onClick={() => onNavigate('app')} className="px-6 py-2 bg-brand-secondary hover:bg-brand-dark text-white font-bold rounded-lg shadow-md transition-all">
                    Back to App
                </button>
            </div>
        </div>
    );
};