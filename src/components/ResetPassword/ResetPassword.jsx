import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function ResetPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    useEffect(() => {
        document.title = "Reset Password";
        const savedEmail = localStorage.getItem('resetPasswordEmail');
        if (!savedEmail) {
            toast.error('You need to start the reset process from the beginning', {
                duration: 4000,
                position: 'top-center'
            });
            navigate('/forgot-password');
        } else {
            setEmail(savedEmail);
        }
    }, [navigate]);

    const validationSchema = Yup.object().shape({
        newPassword: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters')
            .matches(/[A-Z]/, 'Must contain at least one uppercase letter'),
        confirmPassword: Yup.string()
            .required('Please confirm your password')
            .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
    });

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            if (!email) {
                toast.error('Email not found, please try again', {
                    duration: 4000,
                    position: 'top-center'
                });
                return;
            }

            setIsLoading(true);
            try {
                const { data } = await axios.put('https://ecommerce.routemisr.com/api/v1/auth/resetPassword', {
                    email,
                    newPassword: values.newPassword
                });

                if (data.token) {
                    toast.success('Password reset successfully!', {
                        duration: 4000,
                        position: 'top-center'
                    });
                    localStorage.removeItem('resetPasswordEmail');
                    navigate('/login');
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to reset password';

                if (errorMessage.includes('no user with this email address')) {
                    toast.error('No account registered with this email', {
                        duration: 4000,
                        position: 'top-center'
                    });
                    navigate('/forgotpassword');
                } else {
                    toast.error(errorMessage, {
                        duration: 4000,
                        position: 'top-center'
                    });
                }
            } finally {
                setIsLoading(false);
            }
        }
    });

    return (
        <div className="min-h-screen from-blue-50 to-indigo-100 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-center">
                        <h2 className="text-3xl font-bold text-white">Reset Password</h2>
                        <p className="text-emerald-100 mt-2">For email: {email}</p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="p-6 space-y-5">
                        <div className="relative">
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                onBlur={formik.handleBlur}
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                className={`peer h-12 w-full border-b-2 ${formik.errors.newPassword && formik.touched.newPassword ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'} bg-transparent text-neutral-900 dark:text-white placeholder-transparent focus:outline-none focus:border-emerald-600`}
                                placeholder=" "
                            />
                            <label
                                htmlFor="newPassword"
                                className="absolute left-0 -top-3.5 text-neutral-600 dark:text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-emerald-600"
                            >
                                New Password
                            </label>
                            {formik.errors.newPassword && formik.touched.newPassword && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formik.errors.newPassword}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`peer h-12 w-full border-b-2 ${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'} bg-transparent text-neutral-900 dark:text-white placeholder-transparent focus:outline-none focus:border-emerald-600`}
                                placeholder=" "
                            />
                            <label
                                htmlFor="confirmPassword"
                                className="absolute left-0 -top-3.5 text-neutral-600 dark:text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-emerald-600"
                            >
                                Confirm Password
                            </label>
                            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formik.errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <div className="text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
                            <p className="font-medium">Password Requirements:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li className={formik.values.newPassword.length >= 6 ? 'text-emerald-500' : ''}>
                                    At least 6 characters
                                </li>
                                <li className={/[A-Z]/.test(formik.values.newPassword) ? 'text-emerald-500' : ''}>
                                    At least one uppercase letter
                                </li>
                                <li className={formik.values.newPassword === formik.values.confirmPassword && formik.values.confirmPassword ? 'text-emerald-500' : ''}>
                                    Passwords must match
                                </li>
                            </ul>
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
                                    Processing...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>

                        <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                            Remember your password?{' '}
                            <button
                                onClick={() => {
                                    localStorage.removeItem('resetPasswordEmail');
                                    navigate('/login');
                                }}
                                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}