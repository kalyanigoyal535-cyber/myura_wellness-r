import React, { useState, useEffect } from "react";
import { Input, Button } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import images from "../../images/images";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Eye, EyeOff } from "lucide-react";
import GoogleButton from 'react-google-button';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

interface SignupValues {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  password2: string;
  phoneNumber: string;
  otp: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

const Signup = () => {
  const { register, googleLogin, sendOTP } = useAuth();
  const { syncCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSendOTP = async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address first.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSendingOTP(true);
    try {
      await sendOTP(email);
      setOtpSent(true);
      setOtpTimer(60); // 60 seconds cooldown
      setSuccess("Verification code sent to your email!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().min(2, "At least 2 chars").required("Required"),
    lastName: Yup.string().min(2, "At least 2 chars").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    username: Yup.string().min(3, "At least 3 chars").required("Required"),
    phoneNumber: Yup.string().matches(/^[0-9+\s-]{10,15}$/, "Invalid phone number").required("Required"),
    otp: otpSent 
      ? Yup.string().length(6, "Code must be 6 digits").required("Required")
      : Yup.string().optional(),
    password: Yup.string().min(8, "Min 8 chars").required("Required"),
    password2: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
    address: Yup.string().optional(),
    city: Yup.string().optional(),
    state: Yup.string().optional(),
    postalCode: Yup.string().optional(),
  });

  const handleSubmit = async (values: SignupValues,
    helpers: FormikHelpers<SignupValues>): Promise<void> => {
    
    if (!otpSent) {
      await handleSendOTP(values.email);
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      await register({
        email: values.email,
        username: values.username,
        password: values.password,
        password2: values.password2,
        first_name: values.firstName,
        last_name: values.lastName,
        phone_number: values.phoneNumber,
        otp: values.otp,
        address: values.address,
        city: values.city,
        state: values.state,
        postal_code: values.postalCode,
      });
      helpers.resetForm();
      // Merge guest cart with user cart after registration
      await syncCart();
      // Redirect to home
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      helpers.setSubmitting(false);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse: any) => {
      try {
        await googleLogin(tokenResponse.credential);
        await syncCart();
        navigate("/");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Google login failed. Please try again.");
      }
    },
    onError: () => {
      setError("Google login failed. Please try again.");
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen bg-stone-50 overflow-x-hidden">
      {/* Image Section – EXACT same layout as Login */}
      <div className="col-span-12 md:col-span-6 flex justify-center order-2 md:order-2">
        <img
          src={images.LoginImage}
          alt="Offer desktop"
          className="hidden md:block w-full h-auto md:h-[85vh] object-cover md:object-contain md:rounded-lg rounded-lg"
        />
        <img
          src={images.MobileLoginImage}
          alt="Offer mobile"
          className="block md:hidden w-full mt-8 md:mt-0 h-auto object-contain rounded-lg shadow-xl"
        />
      </div>

      {/* Signup Section – mirror Login section */}
      <div className="col-span-12 md:col-span-6 flex flex-col items-center md:justify-center order-1 md:order-1 py-12">
        <div className="w-10/12 md:w-8/12 lg:w-7/12">
          <h1 className="text-3xl font-black text-slate-900 mb-2 font-display uppercase tracking-tight">Register</h1>
          <p className="text-slate-500 mb-8 font-medium">
            Already a user?
            <Link to="/my-account" className="text-slate-900 mx-2 underline font-bold hover:text-blue-700 transition-colors">
              Login
            </Link>
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-sm animate-in fade-in slide-in-from-top-1">
              <p className="font-bold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-r-lg shadow-sm animate-in fade-in slide-in-from-top-1">
              <p className="font-bold">Success</p>
              <p className="text-sm">{success}</p>
            </div>
          )}

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              username: "",
              password: "",
              password2: "",
              phoneNumber: "",
              otp: "",
              address: "",
              city: "",
              state: "",
              postalCode: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              handleSubmit,
            }: {
              values: SignupValues;
              handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
            }) => (
              <Form
                onSubmit={handleSubmit}
                className="flex flex-col space-y-5"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">First Name</label>
                    <Field name="firstName" as={Input} placeholder="First Name" radius="md" size="md" />
                    <ErrorMessage
                      name="firstName"
                      component="p"
                      className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Last Name</label>
                    <Field name="lastName" as={Input} placeholder="Last Name" radius="md" size="md" />
                    <ErrorMessage
                      name="lastName"
                      component="p"
                      className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Email Address</label>
                  <Field name="email" as={Input} placeholder="Email" radius="md" size="md" />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase"
                  />
                </div>

                {otpSent && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Verification Code</label>
                    <Field name="otp" as={Input} placeholder="6-digit code" radius="md" size="md" maxLength={6} />
                    <p className="text-[10px] text-slate-500 mt-1.5 ml-1 font-medium">
                      Check email and enter OTP to complete registration.
                    </p>
                    <ErrorMessage
                      name="otp"
                      component="p"
                      className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase"
                    />
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Username</label>
                    <Field name="username" as={Input} placeholder="Username" radius="md" size="md" />
                    <ErrorMessage
                      name="username"
                      component="p"
                      className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Phone Number</label>
                    <Field name="phoneNumber" as={Input} placeholder="Phone Number" radius="md" size="md" />
                    <ErrorMessage
                      name="phoneNumber"
                      component="p"
                      className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Address (Optional)</label>
                  <Field name="address" as={Input} placeholder="Street Address" radius="md" size="md" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">City</label>
                    <Field name="city" as={Input} placeholder="City" radius="md" size="md" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">State</label>
                    <Field name="state" as={Input} placeholder="State" radius="md" size="md" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Zip Code</label>
                    <Field name="postalCode" as={Input} placeholder="Zip Code" radius="md" size="md" />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Password</label>
                    <Field name="password">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          radius="md"
                          size="md"
                          rightSection={
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="cursor-pointer text-gray-600 p-2"
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          }
                          rightSectionPointerEvents="all"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Confirm Password</label>
                    <Field name="password2">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          radius="md"
                          size="md"
                          rightSection={
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                              className="cursor-pointer text-gray-600 p-2"
                              aria-label={
                                showConfirmPassword
                                  ? "Hide password"
                                  : "Show password"
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          }
                          rightSectionPointerEvents="all"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="password2"
                      component="p"
                      className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="filled"
                    color="#162031"
                    radius="md"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    className="font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>

                <div className="flex flex-col items-center pt-6">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6 bg-stone-50 px-4 relative z-10">OR CONTINUE WITH</span>
                  <div className="w-full h-[1px] bg-slate-200 -mt-[3.25rem] mb-6"></div>
                  
                  <div className="flex justify-center w-full">
                    <div className="inline-block transform hover:scale-105 transition-transform">
                      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                        <GoogleButton
                          label="Sign up with Google"
                          onClick={() => googleLoginHandler()}
                          style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                        />
                      </GoogleOAuthProvider>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Signup;
