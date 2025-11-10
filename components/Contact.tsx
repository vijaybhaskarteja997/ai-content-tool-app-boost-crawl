import React, { useState } from 'react';

interface ContactProps {
    onNavigate: (page: 'app') => void;
}

export const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would handle form submission here
        setSubmitted(true);
    };

    return (
        <div className="max-w-4xl mx-auto bg-base-200 rounded-2xl shadow-lg p-8 sm:p-12 my-10">
            <h1 className="text-4xl font-extrabold text-white mb-2">Contact Us</h1>
            <p className="text-base-content mb-8">We'd love to hear from you! Please fill out the form below to get in touch.</p>
            
            {submitted ? (
                <div className="text-center p-10 bg-base-300/50 rounded-lg">
                    <h2 className="text-2xl font-bold text-green-400">Thank You!</h2>
                    <p className="text-base-content mt-2">Your message has been received. We'll get back to you shortly.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-base-content">Full Name</label>
                            <input type="text" name="name" id="name" required className="mt-1 block w-full p-3 bg-base-300 rounded-lg border-transparent focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-base-content">Email Address</label>
                            <input type="email" name="email" id="email" required className="mt-1 block w-full p-3 bg-base-300 rounded-lg border-transparent focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-base-content">Phone Number</label>
                            <input type="tel" name="phone" id="phone" className="mt-1 block w-full p-3 bg-base-300 rounded-lg border-transparent focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" />
                        </div>
                        <div>
                            <label htmlFor="website" className="block text-sm font-medium text-base-content">Website URL</label>
                            <input type="url" name="website" id="website" className="mt-1 block w-full p-3 bg-base-300 rounded-lg border-transparent focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="country" className="block text-sm font-medium text-base-content">Country</label>
                        <select id="country" name="country" className="mt-1 block w-full p-3 bg-base-300 rounded-lg border-transparent focus:ring-2 focus:ring-brand-secondary focus:outline-none transition">
                            <option>United States</option>
                            <option>Canada</option>
                            <option>Mexico</option>
                             <option>United Kingdom</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <button type="submit" className="w-full py-3 px-4 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-lg shadow-md transition-all">
                            Submit
                        </button>
                    </div>
                </form>
            )}

            <div className="mt-10 text-center">
                 <button onClick={() => onNavigate('app')} className="text-sm text-brand-light hover:underline">
                    &larr; Back to App
                </button>
            </div>
        </div>
    );
};
