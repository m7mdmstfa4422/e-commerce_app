import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Sppiner from '../Sppiner/Sppiner';

export default function Brands() {
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        document.title = "Brand";
    }, []);
    const { data, isError, isLoading } = useQuery({
        queryKey: ['brands'],
        queryFn: () => axios.get('https://ecommerce.routemisr.com/api/v1/brands'),
        select: (response) => response?.data?.data,
    });

    const handleBrandClick = (brand) => {
        setSelectedBrand(brand);
        setIsModalOpen(true);
    };

    if (isLoading) return <Sppiner />;
    if (isError) return <h3 className="text-center text-red-500 dark:text-red-400 py-10">Error fetching brands...</h3>;

    return (
        <div className="min-h-screen bg-[#f6f3f4] dark:bg-neutral-900 transition-colors duration-300 py-12 px-4">
            <h1 className='text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 text-center mb-12'>
                Our Brands
            </h1>

            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {data.map((brand) => (
                    <motion.div
                        key={brand._id}
                        className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        whileHover={{ y: -5 }}
                        onClick={() => handleBrandClick(brand)}
                    >
                        <div className="  flex items-center  justify-center bg-neutral-50 dark:bg-neutral-700">
                            <img
                                src={brand.image}
                                alt={brand.name}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                        <div className="p-3 text-center border-t border-neutral-100 dark:border-neutral-700">
                            <h2 className="font-medium text-neutral-800 dark:text-neutral-200">
                                {brand.name}
                            </h2>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && selectedBrand && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative bg-white dark:bg-neutral-800 rounded-xl shadow-2xl max-w-md w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-1 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                                aria-label="Close"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>

                            <div className="p-6">
                                <div className="flex flex-col items-center gap-6">
                                    <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white">
                                        {selectedBrand.name}
                                    </h2>
                                    <div className="w-full h-64 flex items-center justify-center bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                                        <img
                                            src={selectedBrand.image}
                                            alt={selectedBrand.name}
                                            className="max-h-full max-w-full object-contain p-4"
                                        />
                                    </div>
                                    <button
                                        className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}