import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
// import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import useApi from '../../hooks/useApi';
import Sppiner from '../Sppiner/Sppiner';

export default function Categories() {
    const subCategoryRef = useRef(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // Fetch main categories
    const {
        data: categoriesData,
        isLoading: isLoadingCategories,
        error: categoriesError
    } = useApi('categories');

    // Fetch subcategories
    const fetchSubCategories = async () => {
        if (!selectedCategoryId) return { data: [] };
        const { data } = await axios.get(
            `https://ecommerce.routemisr.com/api/v1/categories/${selectedCategoryId}/subcategories`
        );
        return data;
    };

    const {
        data: subCategoriesData,
        isLoading: isLoadingSubCategories,
        error: subCategoriesError
    } = useQuery({
        queryKey: ['subCategories', selectedCategoryId],
        queryFn: fetchSubCategories,
        enabled: !!selectedCategoryId,
    });

    useEffect(() => {
        document.title = "Categories";

        if (selectedCategoryId && subCategoryRef.current) {
            setTimeout(() => {
                subCategoryRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 300);
        }
    }, [selectedCategoryId, subCategoriesData]);

    if (isLoadingCategories) {
        return <Sppiner />;
    }

    if (categoriesError) {
        return (
            <div className="text-center py-12 text-red-500 dark:text-red-400">
                Failed to load categories. Please try again later.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6f3f4] dark:bg-neutral-900 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-neutral-900 dark:text-white mb-12">
                    Browse Our Categories
                </h1>

                {/* Main Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categoriesData?.data?.data?.map((category) => (
                        <div
                            key={category._id}
                            className={`relative group overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${selectedCategoryId === category._id
                                    ? 'ring-2 ring-green-500 dark:ring-green-400'
                                    : ''
                                }`}
                            onClick={() => setSelectedCategoryId(category._id)}
                        >
                            <div className="relative h-60 w-full">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                                <h2 className="text-xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">
                                    {category.name}
                                </h2>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Subcategories */}
                {selectedCategoryId && (
                    <div ref={subCategoryRef} className="mt-16">
                        <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white mb-8">
                            Subcategories
                        </h2>

                        {isLoadingSubCategories ? (
                            <Sppiner />
                        ) : subCategoriesError ? (
                            <div className="text-center text-red-500 dark:text-red-400">
                                Failed to load subcategories
                            </div>
                        ) : subCategoriesData?.data?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-5 pb-7">
                                {subCategoriesData.data.map((subCategory) => (
                                    <div
                                        key={subCategory._id}
                                        className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-neutral-200 dark:border-neutral-700 hover:border-green-500 dark:hover:border-green-400 text-center"
                                    >
                                        <h3 className="font-medium text-neutral-800 dark:text-neutral-200">
                                            {subCategory.name}
                                        </h3>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
                                No subcategories found for this category
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}