import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../Context/CartContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Cart() {
    const {
        NumOfCartItem,
        TotalPrice,
        Products,
        updateCart,
        deleteCartItem,
        deleteAllCartItem
    } = useContext(CartContext);

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        document.title = "Cart";
    }, []);

    async function handleUpdate(prodId, count) {
        if (count < 1) return;
        setLoading(true);
        try {
            await updateCart(prodId, count);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(prodId) {
        setLoading(true);
        try {
            const response = await deleteCartItem(prodId);
            if (response?.data?.status === "success") {
                toast.success('Product removed', {
                    duration: 3000,
                    position: 'top-right',
                    style: {
                        background: '#10B981',
                        color: '#fff',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#10B981',
                    },
                });
            }
        } catch {
            toast.error('Error occurred', {
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            });
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteAll() {
        setLoading(true);
        try {
            const response = await deleteAllCartItem();
            if (response?.data?.message === "success") {
                toast.success('Cart cleared', {
                    duration: 3000,
                    position: 'top-center',
                    style: {
                        background: '#10B981',
                        color: '#fff',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#10B981',
                    },
                });
            }
        } catch {
            toast.error('Error occurred', {
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300 py-4 px-2 sm:px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2">Your Shopping Cart</h1>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-4">
                        <div className="bg-white dark:bg-neutral-800 p-3 sm:p-4 rounded-lg shadow-md w-full sm:w-auto">
                            <h2 className="text-base sm:text-lg text-green-600 dark:text-green-400 font-bold">
                                Items: {NumOfCartItem}
                            </h2>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 p-3 sm:p-4 rounded-lg shadow-md w-full sm:w-auto">
                            <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                                Total: {TotalPrice} EGP
                            </h3>
                        </div>
                    </div>
                    <button
                        onClick={handleDeleteAll}
                        disabled={loading || NumOfCartItem === 0}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                        {loading ? (
                            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                        Clear Cart
                    </button>
                </div>

                {/* Cart Items - Mobile View */}
                {Products && Products.length > 0 ? (
                    <>
                        <div className="sm:hidden space-y-4 mb-6">
                            {Products.map((prod) => (
                                <div key={prod.product._id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={prod.product.imageCover}
                                            alt={prod.product.title}
                                            className="h-16 w-16 object-cover rounded-md"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-neutral-900 dark:text-white line-clamp-1">
                                                {prod.product.title}
                                            </h3>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                {prod.product.category?.name}
                                            </p>
                                            <div className="mt-2 text-sm font-bold text-green-600 dark:text-green-400">
                                                {prod.price} EGP
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleUpdate(prod.product._id, prod.count - 1)}
                                                disabled={loading || prod.count <= 1}
                                                className="p-1 border border-neutral-300 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-600 disabled:opacity-50"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="mx-2 text-neutral-700 dark:text-neutral-300">
                                                {prod.count}
                                            </span>
                                            <button
                                                onClick={() => handleUpdate(prod.product._id, prod.count + 1)}
                                                disabled={loading}
                                                className="p-1 border border-neutral-300 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-600 disabled:opacity-50"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(prod.product._id)}
                                            disabled={loading}
                                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500 disabled:opacity-50 flex items-center gap-1 text-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Items - Desktop View */}
                        <div className="hidden sm:block bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 mb-8">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                                    <thead className="bg-neutral-50 dark:bg-neutral-700">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Image</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Product</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Quantity</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Price</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                                        {Products.map((prod) => (
                                            <tr key={prod.product._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <img
                                                        src={prod.product.imageCover}
                                                        alt={prod.product.title}
                                                        className="h-20 w-20 object-cover rounded-md"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                                        {prod.product.title}
                                                    </div>
                                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                                        {prod.product.category?.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={() => handleUpdate(prod.product._id, prod.count - 1)}
                                                            disabled={loading || prod.count <= 1}
                                                            className="p-1 border border-neutral-300 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-600 disabled:opacity-50"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                            </svg>
                                                        </button>
                                                        <span className="mx-3 text-neutral-700 dark:text-neutral-300">
                                                            {prod.count}
                                                        </span>
                                                        <button
                                                            onClick={() => handleUpdate(prod.product._id, prod.count + 1)}
                                                            disabled={loading}
                                                            className="p-1 border border-neutral-300 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-600 disabled:opacity-50"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm  font-bold text-green-600 dark:text-green-400">
                                                    {prod.price} EGP
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleDelete(prod.product._id)}
                                                        disabled={loading}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500 disabled:opacity-50 flex items-center gap-1"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 sm:py-12">
                        <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-neutral-900 dark:text-white">Your cart is empty</h3>
                        <p className="mt-1 text-neutral-500 dark:text-neutral-400 mb-4">Start shopping to add items to your cart</p>
                        <Link
                            to="/products"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}

                {/* Checkout Section */}
                {Products && Products.length > 0 && (
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-4 sm:p-6 transition-all duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Order Summary</h3>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                {TotalPrice} EGP
                            </span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-300">Subtotal</span>
                                <span className="text-neutral-900 dark:text-white">{TotalPrice} EGP</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-300">Shipping</span>
                                <span className="text-neutral-900 dark:text-white">Free</span>
                            </div>
                            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 flex justify-between">
                                <span className="font-medium text-neutral-900 dark:text-white">Total</span>
                                <span className="font-bold text-green-600 dark:text-green-400">
                                    {TotalPrice} EGP
                                </span>
                            </div>
                        </div>
                        <Link
                            to="/checkout"
                            className="mt-6 w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}