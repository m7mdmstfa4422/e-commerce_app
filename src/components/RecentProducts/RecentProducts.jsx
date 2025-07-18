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
    const [cartLoadingStates, setCartLoadingStates] = useState({});
    const [wishLoadingStates, setWishLoadingStates] = useState({}); // New state for wishlist loading

    async function addProductToWish(productId) {
        setWishLoadingStates(prev => ({ ...prev, [productId]: true })); // Set loading state

        try {
            const response = await addToWish(productId);
            if (response?.data?.status === 'success') {
                toast.success(response?.data?.message, {
                    duration: 4000,
                    position: 'top-right',
                    style: {
                        marginTop: '50px',
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
                    marginTop: '50px',
                    background: '#EF4444',
                    color: '#fff',
                },
            });
        } finally {
            setWishLoadingStates(prev => ({ ...prev, [productId]: false })); // Reset loading state
        }
    }

    async function addProductToCart(productId) {
        setCartLoadingStates(prev => ({ ...prev, [productId]: true }));

        try {
            const response = await addToCart(productId);
            if (response?.status === 'success') {
                toast.success(response?.message, {
                    duration: 4000,
                    position: 'top-right',
                    style: {
                        marginTop: '50px',
                        background: '#10B981',
                        color: '#fff',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#10B981',
                    },
                });
            } else {
                toast.error('Error adding product to cart , please Reload Page', {
                    style: {
                        marginTop: '50px',
                        background: '#EF4444',
                        color: '#fff',
                    },
                });
            }
        } catch (error) {
            toast.error('Error adding product to cart , please Reload Page', {
                style: {
                    marginTop: '50px',
                    background: '#EF4444',
                    color: '#fff',
                },
            });
        } finally {
            setCartLoadingStates(prev => ({ ...prev, [productId]: false }));
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

                {filteredProducts?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all duration-200 flex flex-col h-full"
                            >
                                <Link
                                    to={`/ProdactDitalis/${product.id}/${product.category.name}`}
                                    className="flex-grow flex flex-col"
                                >
                                    <div className="relative w-full aspect-square overflow-hidden rounded-t-lg">
                                        <img
                                            src={product.imageCover}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                                        />
                                        {product.ratingsAverage && (
                                            <div className="absolute top-2 left-2 bg-white dark:bg-neutral-900 px-2 py-1 rounded-full flex items-center shadow-sm">
                                                <svg
                                                    className="w-4 h-4 text-yellow-400 mr-1"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                                    {product.ratingsAverage}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 flex-grow">
                                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                                            {product.category.name}
                                        </p>
                                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-2">
                                            {product.title}
                                        </h3>

                                        <div className="mt-4 flex justify-between items-center">
                                            <span className="text-lg font-bold text-neutral-900 dark:text-white">
                                                {product.price} EGP
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                <div className="p-4 pt-0 flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addProductToCart(product.id);
                                        }}
                                        disabled={cartLoadingStates[product.id]}
                                        className={`flex-grow ${cartLoadingStates[product.id]
                                            ? 'bg-neutral-300 dark:bg-neutral-600 cursor-not-allowed'
                                            : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white'
                                            } py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2`}
                                    >
                                        {cartLoadingStates[product.id] ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="text-sm">Adding...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    />
                                                </svg>
                                                <span className="text-sm">Add to Cart</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addProductToWish(product.id);
                                        }}
                                        disabled={wishLoadingStates[product.id]}
                                        className={`p-2 rounded-md transition-colors duration-200 ${wishlistStatus[product.id]
                                            ? 'bg-red-50 dark:bg-red-900/30 text-red-500'
                                            : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-500 dark:text-neutral-300'
                                            }`}
                                        aria-label="Add to wishlist"
                                    >
                                        {wishLoadingStates[product.id] ? (
                                            <svg
                                                className="animate-spin h-5 w-5 text-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
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
                                        )}
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