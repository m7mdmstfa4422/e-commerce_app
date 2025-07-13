import React, { useContext, useEffect, useState } from 'react';
import { WishContext } from '../Context/WishListContext';
import { useNavigate } from 'react-router-dom';
import Sppiner from '../Sppiner/Sppiner';

export default function WishList() {
    const navigate = useNavigate();
    const { getWishList, removeFromWish } = useContext(WishContext);
    const [wishItems, setWishItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);

    console.log(wishItems);

    // تحميل قائمة الأمنيات من localStorage عند التحميل الأولي
    useEffect(() => {
        document.title = "WishList";

        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            setWishItems(JSON.parse(savedWishlist));
        }
        fetchWishlist();
    }, []);

    async function fetchWishlist() {
        try {
            const response = await getWishList();
            if (response?.data) {
                setWishItems(response.data);
                // حفظ في localStorage عند جلب البيانات
                localStorage.setItem('wishlist', JSON.stringify(response.data));
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleRemove(id) {
        setRemovingId(id);
        try {
            await removeFromWish(id);
            // تحديث القائمة المحلية و localStorage بعد الحذف
            const updatedWishlist = wishItems.filter(item => item.id !== id);
            setWishItems(updatedWishlist);
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        } catch (error) {
            console.error("Error removing item:", error);
        } finally {
            setRemovingId(null);
        }
    }

    if (loading) {
        return <Sppiner />;
    }

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">
                        My Wishlist
                    </h2>
                    <p className="mt-3 text-xl text-neutral-500 dark:text-neutral-400">
                        {wishItems.length === 0
                            ? "Your curated collection of favorites awaits"
                            : `You have ${wishItems.length} item${wishItems.length !== 1 ? 's' : ''} in your wishlist`}
                    </p>
                </div>

                {wishItems.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto h-24 w-24 text-neutral-400 dark:text-neutral-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-neutral-900 dark:text-white">No items in wishlist</h3>
                        <p className="mt-1 text-neutral-500 dark:text-neutral-400">Start adding items you love to see them here</p>
                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/products')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                            >
                                Browse Products
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {wishItems.map((item) => (
                            <div
                                key={item.id}
                                className="group relative bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-xl hover:shadow-md transition-shadow duration-300 border border-neutral-300 dark:border-neutral-700"
                            >
                                <div className="w-full min-h-60 bg-neutral-200 dark:bg-neutral-700 rounded-lg overflow-hidden aspect-w-1 aspect-h-1 group-hover:opacity-75">
                                    <img
                                        src={item.imageCover}
                                        alt={item.title}
                                        className="w-full h-full object-center object-cover"
                                    />
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-neutral-900 dark:text-white line-clamp-1">
                                            {item.title}
                                        </h3>
                                        <p className="mt-1 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                                            {item.price} EGP
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-between space-x-2">
                                    <button
                                        onClick={() => navigate(`/ProdactDitalis/${item.id}/${item.category?.name || 'default'}`)}
                                        className="flex-1 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md py-2 px-4 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        disabled={removingId === item.id}
                                        className="flex-1 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900 rounded-md py-2 px-4 text-sm font-medium text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center"
                                    >
                                        {removingId === item.id ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Removing...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}