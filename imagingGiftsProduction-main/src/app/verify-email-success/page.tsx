import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-blue-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
                <h1 className="text-4xl font-bold text-green-600 mb-4">🎉 Email Verified!</h1>
                <p className="text-gray-600 mb-6">
                    Your email has been successfully verified. Please login to access your account.
                </p>
                <Link
                    href="/login"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-500 text-white font-semibold rounded-full  hover:scale-105 transition-transform duration-200"
                >
                    Login
                </Link>
            </div>
        </div>
    )
}

export default page