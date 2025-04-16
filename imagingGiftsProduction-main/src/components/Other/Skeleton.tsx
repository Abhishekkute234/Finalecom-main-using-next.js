import React from 'react';

const Skeleton = () => {
  return (
    <div className="flex flex-col items-center w-full h-screen bg-gray-100 px-4 py-6">
      {/* Header Skeleton */}
      <div className="w-full max-w-5xl h-12 bg-gray-300 rounded-lg mb-6 animate-pulse"></div>

      {/* Main Content Skeleton */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        {/* Left Section */}
        <div className="w-full md:w-2/3 bg-gray-300 h-80 rounded-lg animate-pulse"></div>

        {/* Right Section */}
        <div className="flex flex-col w-full md:w-1/3 gap-4">
          <div className="w-full bg-gray-300 h-16 rounded-lg animate-pulse"></div>
          <div className="w-full bg-gray-300 h-16 rounded-lg animate-pulse"></div>
          <div className="w-full bg-gray-300 h-16 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="w-full max-w-5xl mt-8 space-y-4">
        <div className="w-full bg-gray-300 h-10 rounded-lg animate-pulse"></div>
        <div className="w-full bg-gray-300 h-10 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
};

export default Skeleton;
