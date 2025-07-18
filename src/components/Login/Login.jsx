import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

export default function Login() {
    let { setUserLogin } = useContext(UserContext);
    const [errmsg, seterrmsg] = useState(null);
    const [IsLoading, setIsLoading] = useState(false);
    let Navigate = useNavigate();

    function supmitForm(val) {
        setIsLoading(true);
        axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, val)
            .then(({ data }) => {
                setIsLoading(false);
                console.log(data?.token);
                if (data?.message === 'success') {
                    setUserLogin(data?.token);
                    Navigate('/');
                    localStorage.setItem('usreToken', data?.token);
                }
            }).catch((error) => {
                setIsLoading(false);
                console.log(error?.response?.data?.message);
                seterrmsg(error?.response?.data?.message);
            });
    }

    useEffect(() => {
        document.title = "Login";
    }, []);

    let validation = Yup.object().shape({
        email: Yup.string().required('Email is required').email('Invalid email'),
        password: Yup.string().required('Password is required')
    });

    let formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: validation,
        onSubmit: supmitForm
    });

    return (
        <div className="min-h-screen  dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Decorative Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600  p-6 text-center">
                        <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                        <p className="text-emerald-100 mt-2">Sign in to your account</p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="p-6 space-y-5">
                        {/* Floating Label Inputs */}
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="peer h-12 w-full border-b-2 border-neutral-300 dark:border-neutral-600 bg-transparent text-neutral-900 dark:text-white placeholder-transparent focus:outline-none focus:border-emerald-600"
                                placeholder=" "
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-0 -top-3.5 text-neutral-600 dark:text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-emerald-600"
                            >
                                Email Address
                            </label>
                            {formik.errors.email && formik.touched.email && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formik.errors.email}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="peer h-12 w-full border-b-2 border-neutral-300 dark:border-neutral-600 bg-transparent text-neutral-900 dark:text-white placeholder-transparent focus:outline-none focus:border-emerald-600"
                                placeholder=" "
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-0 -top-3.5 text-neutral-600 dark:text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-emerald-600"
                            >
                                Password
                            </label>
                            {formik.errors.password && formik.touched.password && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formik.errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">


                            <div className="text-sm">
                                <Link
                                    to="/forgotpassword"
                                    className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-300 cursor-pointer"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={IsLoading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center"
                        >
                            {IsLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        {errmsg && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-200 rounded">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <p>{errmsg}</p>
                                </div>
                            </div>
                        )}

                        <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}