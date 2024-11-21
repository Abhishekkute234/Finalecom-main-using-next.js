import React from 'react';
import ReactLoading from 'react-loading';

const Loading: React.FC = () => {
    return (
        <div className="loading-container container flex justify-center items-center min-h-screen">
            <ReactLoading type="spin" color="#000" height={50} width={50} />
        </div>
    );
};

export default Loading;
