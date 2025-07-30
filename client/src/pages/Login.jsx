import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { loginUser, verifyOtp } from "../store/userSlice.js";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Email is required.");
      return;  
    }
    const response = await dispatch(loginUser({email}));
    if (loginUser.fulfilled.match(response)) {
        toast.success("OTP sent to your email for Login.");
        setOtpSent(true);
        setEmailForOtp(email);
    }
  }

  const onVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Otp are required.");
      return;  
    }
    const response = await  dispatch(verifyOtp({ email: emailForOtp, otp }))
    if( verifyOtp.fulfilled.match(response) ){
        toast.success("WELCOME");
        navigate("/welcome")
     }
  }

  return (
    <section className="flex items-center justify-center py-8 min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl py-7 px-8 shadow-lg">
        <h2 className="text-center text-2xl text-primary-700 font-bold leading-tight mb-4">
          {otpSent ? "Verify OTP" : "Sign in to your account"}
        </h2>
          
        {!otpSent ? (
          <div>
            <p className="mb-5 text-center text-primary-500 text-base">
              Don&apos;t have any account?&nbsp;
              <Link to="/" className="hover:underline hover:text-primary-700 font-semibold">
                Sign up
              </Link>
            </p>

            <form onSubmit={onLogin} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-3 py-2 rounded-lg text-neutral-700 bg-blue-100 outline-none placeholder:text-neutral-500 focus:ring-1"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                className="w-full rounded-lg px-4 py-2 font-semibold cursor-pointer transition-all duration-200 bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Sign in"}
              </button>
            </form>
          </div>
        ) : (
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
                className="w-full rounded-lg px-4 py-2 font-semibold cursor-pointer transition-all duration-200 bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>

            <button
              onClick={() => {
                setOtpSent(false);
                setOtp('');
                setEmailForOtp('');
              }}
              className="mt-4 w-full text-center text-blue-600 hover:underline"
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
