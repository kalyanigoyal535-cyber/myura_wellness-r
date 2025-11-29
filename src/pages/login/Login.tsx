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

  const handleSubmit = async (values: LoginValues, helpers: FormikHelpers<LoginValues>) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email: values.email, password: values.password });
      // Merge guest cart with user cart after login
      await syncCart();
      // Redirect to home or previous page
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" grid grid-cols-1 md:grid-cols-12 min-h-screen">
      {/* Image Section */}
      <div className="col-span-12 md:col-span-6 flex justify-center order-2 md:order-2">
        {/* Desktop */}
        <img
          src={images.LoginImage}
          alt="Offer desktop"
          className="hidden md:block w-full h-auto md:h-[85vh] object-cover md:object-contain md:rounded-lg rounded-lg"
        />

        {/* Mobile */}
        <img
          src={images.MobileLoginImage}
          alt="Offer mobile"
          className="block md:hidden w-full h-auto object-contain rounded-lg -mt-60 md:m-0"
        />
      </div>

      {/* Login Section */}
      <div className="col-span-12 md:col-span-6 flex flex-col items-center md:justify-center order-1 md:order-1">
        <h1 className="text-2xl font-semibold underline mb-2">Login</h1>
        <p>
          New User?
          <Link to="/signup" className="text-blue-800 ml-2 underline">
            Sign-up
          </Link>
        </p>

        {error && (
          <div className="w-10/12 md:w-6/12 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }: { handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void }) => (
            <Form
              onSubmit={handleSubmit}
              className="flex flex-col w-10/12 md:w-6/12 mt-6 space-y-4"
            >
              {/* Email */}
              <div>
                <label className="block mb-1 font-medium">Email ID</label>
                <Field name="email" as={Input} placeholder="Email Id" />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 font-medium">Password</label>
                <Field
                  name="password"
                  as={Input}
                  type="password"
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Button */}
              <Button
                type="submit"
                variant="filled"
                color="#162031"
                radius="md"
                className="mt-2"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </Form>
          )}
        </Formik>
        <Link to="/forgot-password" className="text-sm text-blue-800 underline my-2">
          Forgot password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
