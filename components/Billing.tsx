import React, { useState, useMemo, useEffect } from 'react';
import { User, Invoice, PaymentMethod } from '../types';
import { DownloadIcon, GooglePayIcon, PaytmIcon, PhonePeIcon } from './Icons';

interface BillingProps {
    user: User;
    onNavigate: (page: 'app') => void;
}

const PRICING = {
    monthly: {
        price: 29,
        originalPrice: 39,
        features: ["All AI Content Tools", "50 Generations per Month", "Personal Content History", "Standard Support"],
    },
    yearly: {
        price: 299,
        originalPrice: 468,
        features: ["All AI Content Tools", "Unlimited Generations", "Personal Content History", "Priority Support", "Early Access to New Features"],
    }
};

type PlanCycle = 'monthly' | 'yearly';
type PaymentStep = 'form' | 'processing' | 'success';

export const Billing: React.FC<BillingProps> = ({ user }) => {
    const [planCycle, setPlanCycle] = useState<PlanCycle>('yearly');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Modal State
    const [paymentStep, setPaymentStep] = useState<PaymentStep>('form');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [formError, setFormError] = useState('');
    const [latestInvoice, setLatestInvoice] = useState<Invoice | null>(null);

    // Payment History State
    const historyKey = useMemo(() => `paymentHistory_${user.email}`, [user.email]);
    const [paymentHistory, setPaymentHistory] = useState<Invoice[]>(() => {
        try {
            const savedHistory = localStorage.getItem(historyKey);
            return savedHistory ? JSON.parse(savedHistory) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(historyKey, JSON.stringify(paymentHistory));
    }, [paymentHistory, historyKey]);

    const handleSelectPlan = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Reset modal state after a short delay to allow for animations
        setTimeout(() => {
            setPaymentStep('form');
            setPhoneNumber('');
            setSelectedPaymentMethod(null);
            setFormError('');
            setLatestInvoice(null);
        }, 300);
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!phoneNumber || !selectedPaymentMethod) {
            setFormError('Please enter your phone number and select a payment method.');
            return;
        }

        setPaymentStep('processing');
        
        // Simulate API call
        setTimeout(() => {
            const planDetails = planCycle === 'monthly' ? { name: 'Monthly', price: PRICING.monthly.price } : { name: 'Yearly', price: PRICING.yearly.price };
            
            const newInvoice: Invoice = {
                id: `INV-${Date.now()}`,
                plan: planDetails.name as 'Monthly' | 'Yearly',
                amount: planDetails.price,
                date: new Date().toISOString(),
                paymentMethod: selectedPaymentMethod,
                phoneNumber: phoneNumber,
            };
            
            setLatestInvoice(newInvoice);
            setPaymentHistory(prev => [newInvoice, ...prev]);
            setPaymentStep('success');

        }, 2000);
    };

    const handleDownloadReceipt = (invoice: Invoice) => {
        const content = `
BOOST CRAWL - PAYMENT RECEIPT
==============================

Invoice ID: ${invoice.id}
Date: ${new Date(invoice.date).toLocaleString()}
Billed to: ${user.name} (${user.email})

---

ITEM: Boost Crawl Subscription - ${invoice.plan} Plan
PAYMENT METHOD: ${invoice.paymentMethod}
PHONE NUMBER: ${invoice.phoneNumber}

---

AMOUNT PAID: $${invoice.amount.toFixed(2)} USD

Thank you for your subscription!
`;
        const blob = new Blob([content.trim()], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt_${invoice.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };


    const PlanCard: React.FC<{ cycle: PlanCycle }> = ({ cycle }) => {
        const details = PRICING[cycle];
        const isSelected = planCycle === cycle;

        return (
            <div className={`border-2 rounded-2xl p-8 transition-all duration-300 ${isSelected ? 'border-brand-secondary scale-105 bg-base-300' : 'border-base-300 bg-base-200'}`}>
                <h3 className="text-2xl font-bold text-white capitalize">{cycle} Plan</h3>
                {cycle === 'yearly' && <span className="text-xs font-bold bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full">SAVE 35%</span>}
                <p className="mt-4">
                    <span className="text-5xl font-extrabold text-white">${details.price}</span>
                    <span className="text-base-content">/{cycle === 'monthly' ? 'mo' : 'yr'}</span>
                    <span className="text-base-content line-through ml-2">${details.originalPrice}</span>
                </p>
                <ul className="mt-6 space-y-3 text-base-content">
                    {details.features.map(feature => (
                        <li key={feature} className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
                <button onClick={handleSelectPlan} className="w-full mt-8 py-3 px-6 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 disabled:bg-base-300">
                    Choose {cycle.charAt(0).toUpperCase() + cycle.slice(1)} Plan
                </button>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto my-10">
            <header className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Pricing Plans</h1>
                <p className="mt-4 text-lg text-base-content/80 max-w-2xl mx-auto">Choose the plan that's right for you and unlock the full power of AI content creation.</p>
                
                <div className="mt-8 inline-flex bg-base-200 p-1 rounded-full">
                    <button onClick={() => setPlanCycle('monthly')} className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${planCycle === 'monthly' ? 'bg-brand-secondary text-white' : 'text-base-content'}`}>Monthly</button>
                    <button onClick={() => setPlanCycle('yearly')} className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${planCycle === 'yearly' ? 'bg-brand-secondary text-white' : 'text-base-content'}`}>Yearly (Save 35%)</button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PlanCard cycle="monthly" />
                <PlanCard cycle="yearly" />
            </div>

            {/* Payment History */}
            <div className="mt-20">
                <h2 className="text-3xl font-bold text-white mb-6">Payment History</h2>
                <div className="bg-base-200 rounded-2xl shadow-lg overflow-hidden">
                    {paymentHistory.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-base-content">
                                <thead className="text-xs text-base-content/70 uppercase bg-base-300">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Invoice ID</th>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                        <th scope="col" className="px-6 py-3">Plan</th>
                                        <th scope="col" className="px-6 py-3">Amount</th>
                                        <th scope="col" className="px-6 py-3">Method</th>
                                        <th scope="col" className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentHistory.map(invoice => (
                                        <tr key={invoice.id} className="border-b border-base-300">
                                            <td className="px-6 py-4 font-mono text-white">{invoice.id.split('-')[1]}</td>
                                            <td className="px-6 py-4">{new Date(invoice.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">{invoice.plan}</td>
                                            <td className="px-6 py-4 font-semibold text-white">${invoice.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4">{invoice.paymentMethod}</td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => handleDownloadReceipt(invoice)} title="Download Receipt" className="p-2 text-base-content/70 hover:text-white hover:bg-base-300 rounded-full">
                                                    <DownloadIcon className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center p-8 text-base-content/70">You have no payment history.</p>
                    )}
                </div>
            </div>


            {/* Payment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity" onClick={handleCloseModal}>
                    <div className="bg-base-200 rounded-2xl shadow-xl w-full max-w-md transition-transform transform scale-95" onClick={(e) => e.stopPropagation()}>
                        
                        {paymentStep === 'form' && (
                             <form onSubmit={handlePaymentSubmit}>
                                <div className="p-8">
                                    <h2 className="text-2xl font-bold text-white">Complete Your Payment</h2>
                                    <p className="text-base-content mt-2">You've selected the <strong className="text-white capitalize">{planCycle}</strong> plan for <strong className="text-white">${planCycle === 'monthly' ? PRICING.monthly.price : PRICING.yearly.price}</strong>.</p>
                                    
                                    <div className="mt-6">
                                        <label htmlFor="phone" className="block text-sm font-medium text-base-content">Phone Number</label>
                                        <input type="tel" id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required placeholder="Enter your phone number" className="w-full mt-1 p-3 bg-base-300 rounded-lg border-transparent focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" />
                                    </div>
                                    
                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium text-base-content mb-2">Select Payment Method</h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            {/* FIX: Cast Object.values(PaymentMethod) to ensure it is typed as an array that can be mapped over. */}
                                            {(Object.values(PaymentMethod) as PaymentMethod[]).map(method => (
                                                <button key={method} type="button" onClick={() => setSelectedPaymentMethod(method)} className={`flex items-center justify-center p-3 border-2 rounded-lg transition-colors ${selectedPaymentMethod === method ? 'border-brand-secondary bg-base-300' : 'border-transparent bg-base-300 hover:border-base-100'}`}>
                                                    {method === PaymentMethod.GooglePay && <GooglePayIcon />}
                                                    {method === PaymentMethod.Paytm && <PaytmIcon />}
                                                    {method === PaymentMethod.PhonePe && <PhonePeIcon />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {formError && <p className="text-red-400 text-sm text-center mt-4">{formError}</p>}
                                </div>
                                <div className="bg-base-300/50 px-8 py-4 flex justify-end gap-3 rounded-b-2xl">
                                    <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-semibold rounded-lg bg-base-100 hover:bg-base-300 text-white transition-colors">Cancel</button>
                                    <button type="submit" className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-primary hover:bg-brand-dark text-white transition-colors">Pay Now</button>
                                </div>
                             </form>
                        )}

                        {paymentStep === 'processing' && (
                            <div className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
                                <svg className="animate-spin h-10 w-10 text-brand-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <h3 className="text-xl font-bold text-white mt-4">Processing Payment...</h3>
                                <p className="text-base-content">Please do not close this window.</p>
                            </div>
                        )}

                        {paymentStep === 'success' && latestInvoice && (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white mt-4">Payment Successful!</h2>
                                <p className="text-base-content mt-2">Your subscription is now active. Thank you!</p>
                                
                                <div className="bg-base-300/50 p-4 rounded-lg text-left mt-6 text-sm space-y-2">
                                    <p><strong>Invoice ID:</strong> <span className="font-mono">{latestInvoice.id}</span></p>
                                    <p><strong>Amount:</strong> <span className="font-mono">${latestInvoice.amount.toFixed(2)}</span></p>
                                    <p><strong>Plan:</strong> <span className="font-mono">{latestInvoice.plan}</span></p>
                                </div>

                                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                                    <button onClick={() => handleDownloadReceipt(latestInvoice)} className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-secondary hover:bg-brand-dark text-white transition-colors flex items-center justify-center gap-2">
                                        <DownloadIcon className="w-4 h-4" />
                                        Download Receipt
                                    </button>
                                     <button onClick={handleCloseModal} className="px-4 py-2 text-sm font-semibold rounded-lg bg-base-100 hover:bg-base-300 text-white transition-colors">Close</button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};