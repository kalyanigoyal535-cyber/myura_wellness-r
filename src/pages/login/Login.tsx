import React, { useState } from "react";
import { Input, Button } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import images from "../../images/images";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

interface LoginValues {
  email: string;
  password: string;
}

const Login = () => {
  const { login } = useAuth();
  const { syncCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (
    values: LoginValues,
    helpers: FormikHelpers<LoginValues>
  ) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email: values.email, password: values.password });
      await syncCart();
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Centered container */}
      <div className="flex-1 flex flex-col items-center justify-center ">
        {/* Top image like Minimalist bottle */}
        <div className="flex flex-col items-center mb-2">
          <img
            src={images.MainLoginImage}
            alt="Login visual"
            className="w-40 md:w-48 mb-4"
          />
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-gray-500">
            Welcome 
          </p>
        </div>

        {/* Card */}
        <div className="w-full max-w-md border border-gray-100 rounded-2xl shadow-sm md:shadow-md px-6 py-7 md:px-8 md:py-9">
          {/* Title + link */}
          <div className="text-center mb-4">
            <h1 className="text-xl md:text-2xl font-semibold mb-1">
              Login with Email
            </h1>
            <p className="text-sm text-gray-600">
              New user?{" "}
              <Link
                to="/signup"
                className="text-black underline underline-offset-2"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Error box */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleSubmit,
            }: {
              handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
            }) => (
              <Form
                onSubmit={handleSubmit}
                className="flex flex-col space-y-4"
              >
                {/* Email */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-800">
                    Email ID
                  </label>
                  <Field
                    name="email"
                    as={Input}
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-800">
                    Password
                  </label>
                  <Field
                    name="password"
                    as={Input}
                    type="password"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Login button */}
                <Button
                  type="submit"
                  variant="filled"
                  radius="lg"
                  color="#1F283B"
                  className="mt-2 w-full bg-black hover:bg-black/90"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Form>
            )}
          </Formik>

          {/* Forgot password */}
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-xs md:text-sm text-gray-700 underline underline-offset-2"
            >
              Forgot password?
            </Link>
          </div>

          {/* Terms text */}
          <p className="mt-5 text-[10px] text-center text-gray-500 leading-relaxed">
            By continuing, you confirm that you have read and agreed to our{" "}
            <span className="underline">Privacy Policy</span> and{" "}
            <span className="underline">Terms & Conditions</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
