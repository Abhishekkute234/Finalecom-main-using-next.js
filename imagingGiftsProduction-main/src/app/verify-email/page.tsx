"use client";

import { useState } from "react";

const Page = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleResendEmail = async () => {
        const email = localStorage.getItem("userEmail");
        if (!email) {
            setMessage("Email not found. Please register first.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/auth/resend-email", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            setMessage(result.message);
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gradient-to-r flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-10 max-w-md text-center transform scale-105">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">🎉 Registration Successful!</h1>
                <p className="text-gray-700 mb-6 text-lg">
                    We are almost there! Please verify your email to complete your registration.
                </p>
                <button
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
                    onClick={handleResendEmail}
                    disabled={loading}
                >
                    {loading ? "Resending..." : "Resend Email"}
                </button>
                {message && <p className="text-gray-500 text-sm mt-4">{message}</p>}
            </div>
        </div>
    );
};

export default Page;
