'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';

const Brand = () => {
    return (
        <div className="brand-block bg-gradient-to-b  to-white py-10 rounded-lg">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Our Trusted Brands</h2>
                <div className="list-brand">
                    <Swiper
                        spaceBetween={16}
                        slidesPerView={2}
                        loop={true}
                        modules={[Autoplay]}
                        autoplay={{ delay: 4000 }}
                        breakpoints={{
                            500: { slidesPerView: 3, spaceBetween: 20 },
                            680: { slidesPerView: 4, spaceBetween: 20 },
                            992: { slidesPerView: 5, spaceBetween: 20 },
                            1200: { slidesPerView: 6, spaceBetween: 20 },
                        }}
                    >
                        {[...Array(6)].map((_, index) => (
                            <SwiperSlide key={index}>
                                <div className="brand-item flex items-center justify-center h-[60px] bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                    <Image
                                        src={`/images/brand/${index + 1}.png`}
                                        width={150}
                                        height={150}
                                        alt={`Brand ${index + 1}`}
                                        className="h-full w-auto object-contain"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default Brand;
