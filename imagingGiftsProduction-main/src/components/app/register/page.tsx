"use client";
import { useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Home/Heading";
import { TriangleAlert } from "lucide-react";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."
      );
      setPending(false);
      return;
    }

    try {
      // Send registration request
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setPending(false);
        toast.success("User created.");
        toast.success("Please Verify Your Email.");

        // Save the user's email to localStorage
        localStorage.setItem("userEmail", data.email);

        router.push("/verify-email");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
        setPending(false);
      }
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred.");
      setPending(false);
    }
  };

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb heading="Create An Account" subHeading="Create An Account" />
      </div>
      <div className="register-block md:py-20 py-10">
        <div className="container">
          <div className="content-main flex gap-y-8 max-md:flex-col">
            <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
              <div className="heading4">Register</div>
              {!!error && (
                <div className="bg-destructive/15 p-3 mt-3 rounded-md flex items-center gap-x-2 text-sm text-destructive bg-red bg-opacity-10 mb-6">
                  <TriangleAlert />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="md:mt-7 mt-4">
                <div className="name">
                  <input
                    className="border-line px-4 pt-3 pb-3 mb-4 w-full rounded-lg"
                    id="name"
                    type="text"
                    placeholder="Enter Your Name"
                    disabled={pending}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="email">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="email"
                    type="email"
                    placeholder="Enter Your Email Address *"
                    disabled={pending}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="pass mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="password"
                    type="password"
                    placeholder="Password *"
                    disabled={pending}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="confirm-pass mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password *"
                    disabled={pending}
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex items-center mt-5">
                  <div className="block-input">
                    <input
                      type="checkbox"
                      name="terms"
                      id="terms"
                      disabled={pending}
                      checked={form.agreeToTerms}
                      onChange={(e) =>
                        setForm({ ...form, agreeToTerms: e.target.checked })
                      }
                      required
                    />
                    <Icon.CheckSquare
                      size={20}
                      weight="fill"
                      className="icon-checkbox"
                    />
                  </div>
                  <label
                    htmlFor="terms"
                    className="pl-2 cursor-pointer text-secondary2"
                  >
                    I agree to the
                    <Link href="#!" className="text-black hover:underline pl-1">
                      Terms of Service
                    </Link>
                  </label>
                </div>
                <div className="block-button md:mt-7 mt-4">
                  <button
                    disabled={pending}
                    className="button-main flex items-center justify-center gap-x-2"
                  >
                    {pending ? "Registering..." : "Register"}
                  </button>
                </div>
              </form>
            </div>
            <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
              <div className="text-content">
                <div className="heading4">Already have an account?</div>
                <div className="mt-2 text-secondary">
                  Welcome back. Sign in to access your personalized experience,
                  saved preferences, and more. We{"'"}re thrilled to have you
                  with us again!
                </div>
                <div className="block-button md:mt-7 mt-4">
                  <Link href="/login" className="button-main">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
