"use client";

import { useState, useMemo } from "react";
import { auth, sendPasswordResetEmail } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import funfacts from "@/components/data/funfacts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const router = useRouter();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required.");
      return;
    }

    setLoading2("Sending reset email...");
    setLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email, {
        url: "http://localhost:3000/auth/signin",
        handleCodeInApp: true,
      });
      setShowDialog(true);
    } catch (err) {
      setError("Failed to send password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToSignIn = async () => {
    setLoading2("Redirecting to sign in...");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    router.push("/auth/signin");
  };

  const randomFunfact = useMemo(() => {
    const index = Math.floor(Math.random() * funfacts.length);
    return funfacts[index];
  }, [loading]);

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="rounded-xl shadow-2xl px-8 py-6 text-center space-y-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Reset Email Sent
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm">
              We've sent a password reset link to your email. Please check your inbox and follow the instructions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button
                onClick={() => {
                    setShowDialog(false); 
                    setTimeout(handleRedirectToSignIn, 100); 
                }}
                disabled={loading}
                variant="orange"
                size="sm"
                >
                {loading ? (
                    <LoadingSpinner size={20} text="Redirecting..." />
                ) : (
                    "Back to Sign In"
                )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="w-full min-h-screen flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 aspect-[16/9] md:aspect-auto overflow-hidden">
            <img
              src="/assets/Gambar2.jpg"
              alt="Signin Image"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center md:px-8 py-10 md:py-14 xl:py-20">
            <div className="w-full max-w-[90%] sm:max-w-[400px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px] mx-auto text-center">
              <div className="flex flex-col items-center">
                <LoadingSpinner text={loading2} className="mb-1" />
                <div className="bg-blue-50 rounded-xl px-2 py-2 shadow-md w-full max-w-[350px] sm:max-w-xl mx-auto">
                  <p className="text-xs sm:text-sm text-black italic text-center">
                    💡 {randomFunfact}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full min-h-screen flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 aspect-[16/9] md:aspect-auto overflow-hidden">
            <img
              src="/assets/Gambar2.jpg"
              alt="Register Image"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="w-full md:w-1/2 h-auto flex items-center justify-center md:px-8 pb-10 md:pb-14 xl:pb-20">
            <div className="w-full max-w-[90%] sm:max-w-[400px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px] space-y-6 mx-auto pt-6 md:pt-8 lg: xl:pt-12">
              <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black text-center">
                Forgot Password
              </h1>

              <form
                onSubmit={handleForgotPassword}
                className="border-2 border-mainBlue rounded-[10px] p-4 md:p-6 lg:p-8 xl:p-10 space-y-2 md:space-y-3 lg:space-y-3 xl:space-y-4 shadow-xl"
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-black flex items-center">
                      Email <span className="text-red-500 ml-1">*</span>
                    </label>
                    {error && (
                      <p className="text-red-600 text-xs text-right">{error}</p>
                    )}
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full border rounded-[10px] px-4 py-2 text-xs md:text-sm lg:text-base xl:text-lg
                      focus:outline-none placeholder:text-[#D9D9D9]
                      placeholder:text-[12px] md:placeholder:text-[14px] lg:placeholder:text-[15px] xl:placeholder:text-[16px]
                      shadow-md ${error ? "border-red-500" : "border-[#03649F]"}`}
                  />
                </div>

                <div className="flex justify-center pt-10 md:pt-14 lg:pt-16 xl:pt-20">
                  <Button
                    type="submit"
                    variant="orange"
                    size="sm"
                    disabled={loading}
                    className={`w-[120px] h-8 text-xs font-semibold 
                      md:w-[180px] md:h-[36px] md:text-sm md:font-bold 
                      lg:w-[200px] lg:h-[40px] lg:text-base 
                      xl:w-[220px] xl:h-[44px] xl:text-base
                      ${loading ? "cursor-not-allowed opacity-70" : ""}
                    `}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size={20} text="Sending…" />
                      </div>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </div>

                <p className="text-gray-500 text-center text-sm">
                  Back to{" "}
                  <span
                    className={`text-[#ED7117] font-semibold hover:underline cursor-pointer ${
                      loading ? "pointer-events-none opacity-50" : ""
                    }`}
                    onClick={handleRedirectToSignIn}
                  >
                    Sign In
                  </span>
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
