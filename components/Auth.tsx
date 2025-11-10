import React, { useState } from 'react';
import { User } from '../types';
import { Logo } from './Logo';
import { GoogleIcon } from './Icons';

interface AuthProps {
    onAuthSuccess: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password || (!isLogin && !name)) {
            setError('Please fill in all fields.');
            return;
        }
        // Dummy authentication
        onAuthSuccess({ name: isLogin ? 'Existing User' : name, email });
    };

    const handleGoogleSignIn = () => {
        // Dummy Google sign-in
        onAuthSuccess({ name: 'Google User', email: 'user@google.com' });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-md mx-auto bg-base-200 rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <Logo className="w-16 h-16 mx-auto" />
                    <h2 className="mt-4 text-3xl font-extrabold text-white">
                        {isLogin ? 'Welcome Back!' : 'Create an Account'}
                    </h2>
                    <p className="mt-2 text-base-content">
                        {isLogin ? 'Sign in to access your content suite.' : 'Join to start generating AI content.'}
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-base-content">Full Name</label>
                            <div className="mt-1">
                                <input id="name" name="name" type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-base-300 rounded-lg border-transparent focus:ring-2 focus:ring-brand-secondary focus:outline-none transition"/>
                            </div>
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-base-content">Email address</label>
                        <div className="mt-1">
                            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 bg-base-300 rounded-lg border-transparent focus:ring-2 focus:ring-brand-secondary focus:outline-none transition"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-base-content">Password</label>
                        <div className="mt-1">
                            <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-base-300 rounded-lg border-transparent focus:ring-2 focus:ring-brand-secondary focus:outline-none transition"/>
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <div>
                        <button type="submit" className="w-full py-3 px-4 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105">
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-base-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-base-200 text-base-content">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button onClick={handleGoogleSignIn} className="w-full inline-flex justify-center py-3 px-4 border border-base-300 rounded-lg shadow-sm bg-base-100 text-sm font-medium text-white hover:bg-base-300 transition">
                            <GoogleIcon className="w-5 h-5" />
                            <span className="ml-2">Sign in with Google</span>
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-base-content">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-brand-light hover:text-brand-secondary ml-1">
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};
