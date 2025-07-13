import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Forget Password";
    }, []);
    localStorage.setItem('resetPasswordEmail', email);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', {
                email
            });

            if (data.statusMsg === 'success') {
                toast.success('Reset code sent to your email', {
                    duration: 4000,
                    position: 'top-center'
                });
                navigate('/verify-reset-code');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong', {
                duration: 4000,
                position: 'top-center'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen  from-blue-50 to-emerald-100 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-center">
                        <h2 className="text-3xl font-bold text-white">Reset Your Password</h2>
                        <p className="text-emerald-100 mt-2">Enter your email to receive a reset link</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer h-12 w-full border-b-2 border-neutral-300 dark:border-neutral-600 bg-transparent text-neutral-900 dark:text-white placeholder-transparent focus:outline-none focus:border-emerald-600"
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-0 -top-3.5 text-neutral-600 dark:text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-emerald-600"
                            >
                                Email Address
                            </label>
                        </div>

                        <div className="text-sm text-neutral-600 dark:text-neutral-300">
                            <p>We'll send you a verification code to reset your password. Please check your inbox and spam folder.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Code'
                            )}
                        </button>

                        <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                            Remember your password?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}