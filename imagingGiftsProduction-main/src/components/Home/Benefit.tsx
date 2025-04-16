import React from 'react';

interface Props {
    props: string;
}

const Benefit: React.FC<Props> = ({ props }) => {
    return (
        <>
            <div className="container py-10 bg-gradient-to-b  to-white rounded-lg">
                <div className={`benefit-block ${props} mx-auto px-4`}>
                    <div className="list-benefit grid items-start lg:grid-cols-4 grid-cols-2 gap-8">
                        <div className="benefit-item flex flex-col items-center justify-center p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition">
                            <i className="icon-phone-call text-blue-600 lg:text-7xl text-5xl"></i>
                            <div className="text-lg font-bold text-gray-800 text-center mt-5">24/7 Customer Service</div>
                            <div className="text-sm text-gray-500 text-center mt-3">We&apos;re here to help you with any questions or concerns you have, 24/7.</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition">
                            <i className="icon-return text-green-600 lg:text-7xl text-5xl"></i>
                            <div className="text-lg font-bold text-gray-800 text-center mt-5">14-Day Money Back</div>
                            <div className="text-sm text-gray-500 text-center mt-3">If you&apos;re not satisfied with your purchase, simply return it within 14 days for a refund.</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition">
                            <i className="icon-guarantee text-yellow-500 lg:text-7xl text-5xl"></i>
                            <div className="text-lg font-bold text-gray-800 text-center mt-5">Our Guarantee</div>
                            <div className="text-sm text-gray-500 text-center mt-3">We stand behind our products and services and guarantee your satisfaction.</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition">
                            <i className="icon-delivery-truck text-red-600 lg:text-7xl text-5xl"></i>
                            <div className="text-lg font-bold text-gray-800 text-center mt-5">Shipping Worldwide</div>
                            <div className="text-sm text-gray-500 text-center mt-3">We ship our products worldwide, making them accessible to customers everywhere.</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Benefit;
