import React, { useState } from "react";
import { Input, Button } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import images from "../../images/images";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

interface SignupValues {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  password2: string;
}

const Signup = () => {
  const { register } = useAuth();
  const { syncCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string().min(2, "At least 2 chars").required("Required"),
    lastName: Yup.string().min(2, "At least 2 chars").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    username: Yup.string().min(3, "At least 3 chars").required("Required"),
    password: Yup.string().min(8, "Min 8 chars").required("Required"),
    password2: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  const handleSubmit = async (values: SignupValues, helpers: FormikHelpers<SignupValues>) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await register({
        email: values.email,
        username: values.username,
        password: values.password,
        password2: values.password2,
        first_name: values.firstName,
        last_name: values.lastName,
      });
      // Merge guest cart with user cart after registration
      await syncCart();
      // Redirect to home
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen">
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
    className="block md:hidden w-full mt-8 md:mt-0 h-auto object-contain rounded-lg"
  />
</div>


      {/* Signup Section – mirror Login section */}
      <div className="col-span-12 md:col-span-6 flex flex-col items-center md:justify-center order-1 md:order-1">
        <h1 className="text-2xl font-semibold underline mb-2">Register</h1>
        <p>
          Already a user?
          <Link to="/my-account" className="text-blue-800 mx-2 underline">
            Login
          </Link>
        </p>

        {error && (
          <div className="w-10/12 md:w-6/12 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
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
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }: { handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void }) => (
            <Form
              onSubmit={handleSubmit}
              className="flex flex-col w-10/12 md:w-6/12 mt-6 space-y-4"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-6/12">
                  <label>First Name</label>
                  <Field name="firstName" as={Input} placeholder="First Name" />
                  <ErrorMessage
                    name="firstName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="w-full md:w-6/12">
                  <label>Last Name</label>
                  <Field name="lastName" as={Input} placeholder="Last Name" />
                  <ErrorMessage
                    name="lastName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label>Email</label>
                <Field name="email" as={Input} placeholder="Email" />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label>Username</label>
                <Field name="username" as={Input} placeholder="Username" />
                <ErrorMessage
                  name="username"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label>Password</label>
                <Field
                  name="password"
                  as={Input}
                  placeholder="Password"
                  type="password"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label>Confirm Password</label>
                <Field
                  name="password2"
                  as={Input}
                  placeholder="Confirm Password"
                  type="password"
                />
                <ErrorMessage
                  name="password2"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <Button
                type="submit"
                variant="filled"
                color="#162031"
                radius="md"
                className="mt-4"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
