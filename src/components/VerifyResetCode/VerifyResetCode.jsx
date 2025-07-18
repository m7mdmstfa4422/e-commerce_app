import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ResendCodeButton = ({ email }) => {
    const [isResending, setIsResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const handleResendCode = async () => {
        if (cooldown > 0) return;

        setIsResending(true);

        try {
            const { data } = await axios.post(
                'https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords',
                { email }
            );

            if (data.statusMsg === 'success') {
                toast.success('New verification code sent to your email!', {
                    duration: 4000,
                    position: 'top-center'
                });

                // Start 60-second cooldown
                setCooldown(60);
                const timer = setInterval(() => {
                    setCooldown(prev => {
                        if (prev <= 1) clearInterval(timer);
                        return prev - 1;
                    });
                }, 1000);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message;

            if (errorMsg.includes('no user registered')) {
                toast.error('No user registered with this email address', {
                    duration: 4000,
                    position: 'top-center'
                });
            } else {
                toast.error('Failed to resend verification code', {
                    duration: 4000,
                    position: 'top-center'
                });
            }
        } finally {
            setIsResending(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending || cooldown > 0}
            className={`text-emerald-600 dark:text-emerald-400 hover:underline font-medium ${(isResending || cooldown > 0) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
        >
            {isResending ? (
                <>
                    <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-emerald-600 dark:text-emerald-400 inline"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                </>
            ) : cooldown > 0 ? (
                `Resend in ${cooldown}s`
            ) : (
                'Resend Code'
            )}
        </button>
    );
};

export default function VerifyResetCode() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const validationSchema = Yup.object().shape({
        resetCode: Yup.string()
            .required('Verification code is required')
            .matches(/^\d{6}$/, 'Must be a 6-digit code')
    });

    const formik = useFormik({
        initialValues: {
            resetCode: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode', {
                    resetCode: values.resetCode
                });

                if (data.status === 'Success') {
                    toast.success('Code verified successfully!', {
                        duration: 4000,
                        position: 'top-center'
                    });
                    navigate('/reset-password', { state: { email } });
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Invalid verification code', {
                    duration: 4000,
                    position: 'top-center'
                });
            } finally {
                setIsLoading(false);
            }
        }
    });

    useEffect(() => {
        document.title = "Verify Reset Code";
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-100 dark:from-neutral-900 dark:to-neutral-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-center">
                        <h2 className="text-3xl font-bold text-white">Verify Reset Code</h2>
                        <p className="text-emerald-100 mt-2">Enter the code sent to your email</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
                        <div className="relative">
                            <input
                                type="text"
                                id="resetCode"
                                name="resetCode"
                                value={formik.values.resetCode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`peer h-12 w-full border-b-2 ${formik.errors.resetCode && formik.touched.resetCode
                                    ? 'border-red-500'
                                    : 'border-neutral-300 dark:border-neutral-600'
                                    } bg-transparent text-neutral-900 dark:text-white placeholder-transparent focus:outline-none focus:border-emerald-600`}
                                placeholder=" "
                                inputMode="numeric"
                                maxLength="6"
                            />
                            <label
                                htmlFor="resetCode"
                                className="absolute left-0 -top-3.5 text-neutral-600 dark:text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-emerald-600"
                            >
                                Verification Code
                            </label>
                            {formik.errors.resetCode && formik.touched.resetCode && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formik.errors.resetCode}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !formik.isValid}
                            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                'Verify Code'
                            )}
                        </button>


                    </form>
                </div>
            </div>
        </div>
    );
}