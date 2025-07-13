import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../Context/CartContext';
import toast from 'react-hot-toast';
import Sppiner from '../Sppiner/Sppiner';
import { WishContext } from '../Context/WishListContext';

export default function ProductDetails() {
    const [relatedProducts, setRelatedProducts] = useState(null);
    const [productDetails, setProductDetails] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const { id, category } = useParams();
    const { addToWish } = useContext(WishContext);
    const { addToCart } = useContext(CartContext);
    const [wishlistStatus, setWishlistStatus] = useState({});
    const [loadingStates, setLoadingStates] = useState({});
    const [mainAddToCartLoading, setMainAddToCartLoading] = useState(false);

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

    async function addProductToCart(productId, isMainProduct = false) {
        if (isMainProduct) {
            setMainAddToCartLoading(true);
        } else {
            setLoadingStates(prev => ({ ...prev, [productId]: true }));
        }

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
            console.error('Error:', error);
            toast.error('An error occurred');
        } finally {
            if (isMainProduct) {
                setMainAddToCartLoading(false);
            } else {
                setLoadingStates(prev => ({ ...prev, [productId]: false }));
            }
        }
    }

    async function fetchAllProducts() {
        try {
            const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/products');
            const related = data?.data.filter(prod => prod.category.name === category);
            setRelatedProducts(related);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    async function fetchProductDetails() {
        try {
            const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
            setProductDetails(data?.data);
            setMainImage(data?.data?.imageCover);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }

    useEffect(() => {
        document.title = "Prodact Ditalis";
        fetchProductDetails();
        fetchAllProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    if (!productDetails) return <Sppiner />;

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
            {/* Product Details Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Product Images */}
                    <div className="lg:w-2/5">
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 mb-6 transition-all duration-300">
                            <img
                                src={mainImage}
                                alt={productDetails.title}
                                className="w-full h-96 object-contain rounded-lg mb-4"
                            />
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {productDetails.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        onClick={() => setMainImage(img)}
                                        className={`h-20 w-20 object-cover rounded-md cursor-pointer transition-all duration-300 ${mainImage === img
                                            ? 'ring-2 ring-green-500 opacity-100'
                                            : 'opacity-70 hover:opacity-100'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:w-3/5">
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                        {productDetails.title}
                                    </h1>
                                    <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm font-medium px-2.5 py-0.5 rounded">
                                        {productDetails.category.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                                        ID: {productDetails.id}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center mb-6">
                                <div className="flex items-center mr-4">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(productDetails.ratingsAverage)
                                                ? 'text-yellow-400'
                                                : 'text-neutral-300 dark:text-neutral-600'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="ml-2 text-neutral-600 dark:text-neutral-300">
                                        {productDetails.ratingsAverage} ({productDetails.ratingsQuantity} reviews)
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {productDetails.price} EGP
                                </span>
                            </div>

                            <p className="text-neutral-700 dark:text-neutral-300 mb-8 leading-relaxed">
                                {productDetails.description}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => addProductToCart(productDetails.id, true)}
                                    disabled={mainAddToCartLoading}
                                    className={`flex items-center justify-center gap-2 ${mainAddToCartLoading
                                        ? 'bg-neutral-500 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700'
                                        } text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg`}
                                >
                                    {mainAddToCartLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addProductToWish(productDetails.id);
                                    }}
                                    className="flex items-center justify-center gap-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                    aria-label="Add to wishlist"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-6 w-6 transition-colors duration-300 ${wishlistStatus[productDetails.id]
                                            ? 'text-red-500 fill-current'
                                            : 'text-neutral-400 dark:text-neutral-300 hover:text-red-500'
                                            }`}
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        fill={wishlistStatus[productDetails.id] ? 'currentColor' : 'none'}
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                    Add to wishlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts?.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                                >
                                    <Link to={`/ProdactDitalis/${product.id}/${product.category.name}`}>
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={product.imageCover}
                                                alt={product.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            />

                                        </div>

                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-1">
                                                {product.title}
                                            </h3>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">{product.category.name}</p>

                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm text-emerald-600 dark:text-emerald-400 font-bold ">
                                                        {product.price} EGP
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="text-sm text-neutral-600 dark:text-neutral-300">
                                                        {product.ratingsAverage}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        addProductToCart(product.id);
                                                    }}
                                                    disabled={loadingStates[product.id]}
                                                    className={`flex-grow flex items-center justify-center ${loadingStates[product.id]
                                                        ? 'bg-neutral-500 cursor-not-allowed'
                                                        : 'bg-black hover:bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600'
                                                        } text-white py-2 rounded-lg transition-colors duration-300`}
                                                >
                                                    {loadingStates[product.id] ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Adding...
                                                        </>
                                                    ) : (
                                                        'Add to Cart'
                                                    )}
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        addProductToWish(product.id);
                                                    }}
                                                    className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors duration-300"
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
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}