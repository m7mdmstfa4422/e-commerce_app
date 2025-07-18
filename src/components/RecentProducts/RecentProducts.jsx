import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../Context/CartContext';
import { WishContext } from '../Context/WishListContext';
import toast from 'react-hot-toast';
import Sppiner from '../Sppiner/Sppiner';

export default function RecentProducts() {
    const { addToWish } = useContext(WishContext);
    const { addToCart } = useContext(CartContext);
    const [allProducts, setAllProducts] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [wishlistStatus, setWishlistStatus] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [cartLoadingStates, setCartLoadingStates] = useState({}); // حالة جديدة لتتبع تحميل الأزرار

    async function addProductToWish(productId) {
        try {
            const response = await addToWish(productId);
            if (response?.data?.status === 'success') {
                toast.success(response?.data?.message, {
                    duration: 4000,
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
                setWishlistStatus(prev => ({ ...prev, [productId]: true }));
            }
        } catch (error) {
            toast.error('Error adding to wishlist', {
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            });
        }
    }

    async function addProductToCart(productId) {
        setCartLoadingStates(prev => ({ ...prev, [productId]: true })); // تفعيل حالة التحميل للزر المحدد

        try {
            const response = await addToCart(productId);
            if (response?.status === 'success') {
                toast.success(response?.message, {
                    duration: 4000,
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
            } else {
                toast.error('Error adding product to cart', {
                    style: {
                        background: '#EF4444',
                        color: '#fff',
                    },
                });
            }
        } catch (error) {
            toast.error('Error adding product to cart', {
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            });
        } finally {
            setCartLoadingStates(prev => ({ ...prev, [productId]: false })); // تعطيل حالة التحميل للزر المحدد
        }
    }

    async function fetchAllProducts() {
        try {
            setIsLoading(true);
            const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/products');
            setAllProducts(data?.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const filteredProducts = allProducts?.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <Sppiner />;

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-12">
                {/* Search Bar - بدون تغيير */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-3 rounded-full border border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white transition-all duration-300 shadow-sm"
                        />
                        <svg
                            className="absolute right-4 top-3.5 h-5 w-5 text-neutral-400 dark:text-neutral-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Products Grid */}
                {filteredProducts?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                            >
                                {/* محتوى المنتج - بدون تغيير */}
                                <Link
                                    to={`/ProdactDitalis/${product.id}/${product.category.name}`}
                                    className="flex-grow flex flex-col"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={product.imageCover}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>

                                    <div className="p-5 flex-grow">
                                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-2">
                                            {product.title}
                                        </h3>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                                            {product.category.name}
                                        </p>

                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                                {product.price} EGP
                                            </span>
                                            <div className="flex items-center">
                                                <svg
                                                    className="w-4 h-4 text-yellow-400 mr-1"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-sm text-neutral-600 dark:text-neutral-300">
                                                    {product.ratingsAverage}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* أزرار الإجراءات */}
                                <div className="p-4 pt-0 flex gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addProductToCart(product.id);
                                        }}
                                        disabled={cartLoadingStates[product.id]}
                                        className={`flex-grow ${cartLoadingStates[product.id]
                                                ? 'bg-neutral-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-emerald-400 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold'
                                            } text-white py-2.5 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2`}
                                    >
                                        {cartLoadingStates[product.id] ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                                Add to Cart
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addProductToWish(product.id);
                                        }}
                                        className="p-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors duration-300"
                                        aria-label="Add to wishlist"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-6 w-6 transition-colors duration-300 ${wishlistStatus[product.id]
                                                    ? 'text-red-500 fill-current'
                                                    : 'text-neutral-400 dark:text-neutral-300 hover:text-red-500'
                                                }`}
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            fill={wishlistStatus[product.id] ? 'currentColor' : 'none'}
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <svg
                            className="mx-auto h-16 w-16 text-neutral-400 dark:text-neutral-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
                            No products found
                        </h3>
                        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                            Try adjusting your search or filter to find what you're looking for.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}