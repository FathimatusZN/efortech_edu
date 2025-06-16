"use client";

import { useState, useMemo } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
import { SuccessDialog } from "@/components/ui/SuccessDialog";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [successDialog, setSuccessDialog] = useState(false);
  const [failedDialog, setFailedDialog] = useState(false);

  const router = useRouter();

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const validateInputs = () => {
    let valid = true;

    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!fullName.trim()) {
      setFullNameError("Full name is required.");
      valid = false;
    }

    if (!email.includes("@")) {
      setEmailError("Please enter a valid email.");
      valid = false;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    }

    return valid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email, password }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.success === false) {
        setDialogMessage(data.message || "Registration failed.");
        setFailedDialog(true);
        return;
      }

      setDialogMessage("Registration successful! Redirecting to Sign In...");
      setSuccessDialog(true);

      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (e) {
      setLoading(false);
      setDialogMessage(e.message);
      setFailedDialog(true);
    }
  };

  const inputClass = (error) => `
        w-full border rounded-[10px] px-4 py-2 shadow-md
        text-xs md:text-sm lg:text-base xl:text-lg
        focus:outline-none placeholder:text-[#D9D9D9]
        placeholder:text-[12px] md:placeholder:text-[14px] lg:placeholder:text-[15px] xl:placeholder:text-[16px] 
        ${error ? "border-red-500" : "border-[#03649F]"}`;

  const handleRedirectToSignIn = async () => {
    setLoading2("Redirecting to sign in...");
    await new Promise((r) => setTimeout(r, 300));
    router.push("/auth/signin");
  };

  const randomFunfact = useMemo(() => {
    const index = Math.floor(Math.random() * funfacts.length);
    return funfacts[index];
  }, [loading]);

  return (
    <>
      <SuccessDialog
        open={successDialog}
        onOpenChange={(open) => {
          setSuccessDialog(open);
          if (!open) {
            router.push("/auth/signin");
          }
        }}
        title="Registration successful!"
        messages={["Now you can sign in to your account."]}
        buttonText="OK"
      />

      <Dialog open={failedDialog} onOpenChange={setFailedDialog}>
        <DialogContent className="rounded-xl shadow-2xl px-8 py-6 text-center space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-red-600">
              ⚠️ Registration Failed
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button
              onClick={() => setFailedDialog(false)}
              variant="orange"
              size="sm"
              className="w-[120px]"
            >
              {loading ? <LoadingSpinner size="sm" /> : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="w-full min-h-screen flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 aspect-[4/1] md:aspect-auto overflow-hidden">
            <img
              src="/assets/Gambar2.jpg"
              alt="Signin Image"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center md:px-8 py-10 md:py-14 xl:py-20">
            <div className="w-full max-w-[90%] sm:max-w-[400px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px] mx-auto text-center">
              <div className="flex flex-col items-center space-y-3">
                <LoadingSpinner text="Registering your account..." />
                <div className="bg-blue-50 rounded-xl px-4 py-3 shadow-md w-full max-w-[350px] sm:max-w-xl mx-auto">
                  <p className="text-xs sm:text-sm text-black italic text-center">
                    💡 {randomFunfact}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full md:min-h-screen flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 aspect-[16/9] md:aspect-auto overflow-hidden">
            <img
              src="/assets/Gambar2.jpg"
              alt="Register Image"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-grow items-center justify-center md:px-8 pb-10 md:pb-14 xl:pb-20">
            <div className="w-full max-w-[90%] sm:max-w-[400px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px] space-y-6 mx-auto pt-6 md:pt-10 xl:pt-16">
              <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black text-center">
                Register Form
              </h1>
              <form
                onSubmit={handleRegister}
                className="border-2 border-mainBlue rounded-[10px] p-4 md:p-6 lg:p-8 xl:p-10 space-y-2 md:space-y-3 lg:space-y-3 xl:space-y-4 shadow-xl"
              >
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-end">
                      <label className="text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-black flex items-center">
                        Full Name <span className="text-red-500 ml-1">*</span>
                      </label>
                      {fullNameError && (
                        <p className="text-red-600 text-xs text-right mb-1">
                          {fullNameError}
                        </p>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your name here"
                      className={inputClass(fullNameError)}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-end">
                      <label className="text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-black flex items-center">
                        Email <span className="text-red-500 ml-1">*</span>
                      </label>
                      {emailError && (
                        <p className="text-red-600 text-xs text-right mb-1">
                          {emailError}
                        </p>
                      )}
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className={inputClass(emailError)}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-end">
                      <label className="text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-black flex items-center">
                        Password <span className="text-red-500 ml-1">*</span>
                      </label>
                      {passwordError && (
                        <p className="text-red-600 text-xs text-right mb-1">
                          {passwordError}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={inputClass(passwordError)}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                      >
                        {showPassword ? (
                          <FaEye size={20} />
                        ) : (
                          <FaEyeSlash size={20} />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end">
                      <label className="text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-black flex items-center">
                        Confirm Password{" "}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      {confirmPasswordError && (
                        <p className="text-red-600 text-xs text-right mb-1">
                          {confirmPasswordError}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className={inputClass(confirmPasswordError)}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <div
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                      >
                        {showConfirmPassword ? (
                          <FaEye size={20} />
                        ) : (
                          <FaEyeSlash size={20} />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-10 md:pt-14 lg:pt-16 xl:pt-20">
                    <Button
                      type="submit"
                      variant="orange"
                      size="sm"
                      className="w-[120px] h-8 text-xs font-semibold 
                                        md:w-[180px] md:h-[36px] md:text-sm md:font-bold 
                                        lg:w-[200px] lg:h-[40px] lg:text-base 
                                        xl:w-[220px] xl:h-[44px] xl:text-base"
                    >
                      Register
                    </Button>
                  </div>

                  <p className="text-gray-500 text-center text-xs md:text-sm lg:text-base xl:text-lg">
                    Already have an account?{" "}
                    <span
                      className={`text-[#ED7117] font-semibold hover:underline cursor-pointer ${loading ? "pointer-events-none opacity-50" : ""
                        }`}
                      onClick={handleRedirectToSignIn}
                    >
                      Sign In
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterPage;
