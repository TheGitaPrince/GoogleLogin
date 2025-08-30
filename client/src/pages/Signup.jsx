import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { createUser, verifyOtp, googleLogin } from "../store/userSlice.js";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, otpSent, authMethod } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailForOtp, setEmailForOtp] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSignup = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and Email are required.");
      return;
    }
    const response = await dispatch(createUser({ name, email }));
    if (createUser.fulfilled.match(response)) {
      toast.success("OTP sent to your email for signup.");
      setEmailForOtp(email);
    }
  };

  const onVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Otp are required.");
      return;
    }
    const response = await dispatch(verifyOtp({ email: emailForOtp, otp }));
    if (verifyOtp.fulfilled.match(response)) {
      toast.success("WELCOME!");
      navigate("/welcome");
    }
  };

  const onGoogleSuccess = async (res) => {
    const response = await dispatch(googleLogin(res.credential));
    if (googleLogin.fulfilled.match(response)) {
      toast.success("Google login successful. Welcome!");
      navigate("/welcome");
    }
  };

  const onGoogleFailure = () => {
    toast.error("Google Sign In Failed");
  };

  const handleBackToSignup = () => {
    setEmailForOtp("");
    setOtp("");
  };

  return (
    <section className="flex items-center justify-center py-8 min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl py-7 px-8 shadow-lg">
        <h2 className="text-center text-2xl text-primary-700 font-bold leading-tight mb-4">
          {!otpSent ? "Sign up to your account" : "Verify OTP"}
        </h2>

        {authMethod !== "google" && !otpSent &&  (
          <>
            <p className="mb-5 text-center text-primary-500 text-base">
              Already have an account?&nbsp;
              <Link
                to="/login"
                className="hover:underline hover:text-primary-700 font-semibold"
              >
                Sign in
              </Link>
            </p>

            <form onSubmit={onSignup} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-3 py-2 rounded-lg text-neutral-700 bg-blue-100 outline-none placeholder:text-neutral-500 focus:ring-1"
                placeholder="Enter your name"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-3 py-2 rounded-lg text-neutral-700 bg-blue-100 outline-none placeholder:text-neutral-500 focus:ring-1"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                className="w-full rounded-lg px-4 py-2 font-semibold cursor-pointer transition-all duration-200 bg-blue-950/90 hover:bg-blue-950/100 text-white"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Create Account"}
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-200" />
              <span className="mx-2 text-gray-400">OR</span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>

            <div className="w-full">
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={onGoogleFailure}
                useOneTap
                text="signup_with"
                shape="pill"
                size="large"
              />
            </div>
          </>
        )}
        
        { otpSent && authMethod !== "google" && (
          <>
            <p className="mb-4 text-gray-700 text-center">
              Enter the OTP sent to <strong>{emailForOtp}</strong>
            </p>

            <form onSubmit={onVerifyOtp} className="space-y-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full pl-3 py-2 rounded-lg text-neutral-700 bg-blue-100 outline-none placeholder:text-neutral-500 focus:ring-1"
              />
              <button
                type="submit"
                className="w-full rounded-lg px-4 py-2 font-semibold cursor-pointer transition-all duration-200 bg-blue-950/90 hover:bg-blue-950/100 text-white"
                disabled={loading}
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>

            <button
              onClick={ handleBackToSignup }
              className="mt-4 w-full text-center text-blue-950 hover:underline"
              type="button"
            >
              &larr; Back to Signup
            </button>
          </>
        )}
      </div>
    </section>
  );
}
