"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Define user data structure
interface User {
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  _id: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // Typing user state with User interface
  const [loading, setLoading] = useState(false);

  // Logout function
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.error("Logout failed:", error.message);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  // Fetch user details from API
  const getUserDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is stored and sent
        },
      });
      console.log("User details fetched:", res.data);
      setUser(res.data.data); // Update user state with API response
    } catch (error: any) {
      console.error("Failed to fetch user details:", error.message);
      toast.error(
        error.response?.data?.message || "Failed to fetch user details"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details on component mount
  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
        <hr className="mb-4" />
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : user ? (
          <>
            <h2 className="text-lg font-semibold text-center">
              Welcome, {user.username}
            </h2>
            <div className="mt-4">
              <p className="text-gray-700">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-gray-700">
                <strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}
              </p>
              <p className="text-gray-700">
                <strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}
              </p>
            </div>
            <div className="mt-6">
              <Link
                href={`/profile/${user._id}`}
                className="block text-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                View Profile Details
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">No user data available</p>
        )}
        <hr className="mt-6" />
        <button
          onClick={logout}
          className="w-full bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 mt-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
