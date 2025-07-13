import React, { useEffect } from 'react';
import { useState } from 'react';
import Slider from "react-slick";
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AboutMe from '../AboutMe/AboutMe';

export default function CategorySlider() {
    const [categories, setCategories] = useState(null);

    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 8,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/categories');
            setCategories(data?.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* <div className="font-bold text-neutral-800  mb-6 text-center">
              <AboutMe/>
            </div> */}

            <div className="relative group">
                <Slider {...settings} className="px-2">
                    {categories?.map((category) => (
                        <div key={category._id} className=" outline-none cursor-grab active:cursor-grabbing">
                            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="relative pb-[100%] overflow-hidden">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="absolute h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                        loading="lazy"
                                    />

                                </div>
                                <div className="p-2 text-center dark:text-white">
                                    {category.name}

                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}