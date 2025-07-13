import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../Context/CartContext';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CheckOut() {
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [isLoading, setIsLoading] = useState(false);
    const { CardId, resetCart } = useContext(CartContext);
    
    const headers = {
        token: localStorage.getItem('usreToken')
    };

    // Regex للتحقق من رقم الهاتف المصري
    const validatePhone = (phone) => {
        const regex = /^01[0125][0-9]{8}$/;
        if (!regex.test(phone)) {
            return ' ( must be start 010، 011، 012، 015)';
        }
    };

    async function processPayment(values) {
        setIsLoading(true);
        try {
            if (paymentMethod === 'online') {
                await payOnline(values);
            } else {
                await payCash(values);
            }
        } catch (error) {
            console.error(error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    async function payCash(values) {
        const response = await axios.post(
            `https://ecommerce.routemisr.com/api/v1/orders/${CardId}`,
            { shippingAddress: values },
            { headers }
        );
        
        if (response?.data.status === "success") {
            toast.success('Order placed successfully!');
            resetCart();
        }
    }

    async function payOnline(values) {
        const response = await axios.post(
            `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${CardId}?url=http://localhost:5173/`,
            { shippingAddress: values },
            { headers }
        );
        
        if (response?.data.status === "success") {
            window.location.href = response.data.session.url;
        }
    }

    const formik = useFormik({
        initialValues: {
            city: "",
            phone: "",
            details: ""
        },
        validate: (values) => {
            const errors = {};
            if (!values.city) errors.city = 'Requird';
            if (!values.details) errors.details = 'Requird';
            
            const phoneError = validatePhone(values.phone);
            if (phoneError) errors.phone = phoneError;
            
            return errors;
        },
        onSubmit: processPayment
    });

    useEffect(() => {
        document.title = "Check Out";
    }, []);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-md mx-auto bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl transition-colors duration-300">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Complete Your Order</h2>
                        <p className="mt-2 text-neutral-600 dark:text-neutral-300">Please fill in your shipping details</p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    City
                                </label>
                                <input
                                    required
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    id="city"
                                    name="city"
                                    type="text"
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        formik.touched.city && formik.errors.city 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-neutral-300 dark:border-neutral-600 focus:ring-emerald-500'
                                    } focus:ring-2 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white transition duration-200`}
                                    placeholder="Enter your city"
                                />
                                {formik.touched.city && formik.errors.city && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.city}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Phone Number (Egypt)
                                </label>
                                <input
                                    required
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        formik.touched.phone && formik.errors.phone 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-neutral-300 dark:border-neutral-600 focus:ring-emerald-500'
                                    } focus:ring-2 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white transition duration-200`}
                                    placeholder="e.g. 01012345678"
                                />
                                {formik.touched.phone && formik.errors.phone && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.phone}</p>
                                )}
                                {!formik.errors.phone && (
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400"> must be start  010، 011، 012، 015</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="details" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Shipping Address
                                </label>
                                <input
                                    required
                                    value={formik.values.details}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    id="details"
                                    name="details"
                                    type="text"
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        formik.touched.details && formik.errors.details 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-neutral-300 dark:border-neutral-600 focus:ring-emerald-500'
                                    } focus:ring-2 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white transition duration-200`}
                                    placeholder="Enter your full address"
                                />
                                {formik.touched.details && formik.errors.details && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.details}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Payment Method</h3>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('online')}
                                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition duration-200 ${
                                        paymentMethod === 'online'
                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                            : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 bg-white dark:bg-neutral-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        <span>Online Payment</span>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition duration-200 ${
                                        paymentMethod === 'cash'
                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                            : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 bg-white dark:bg-neutral-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span>Cash on Delivery</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || Object.keys(formik.errors).length > 0}
                            className={`w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white font-medium transition duration-200 ${
                                isLoading || Object.keys(formik.errors).length > 0 ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                `Pay ${paymentMethod === 'online' ? 'Online' : 'Cash on Delivery'}`
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}