import React from "react";
import { Input, Button } from "@mantine/core";
import { Link } from "react-router-dom";
import images from "../../images/images";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Signup = () => {
  const validationSchema = Yup.object({
    firstName: Yup.string().min(2, "At least 2 chars").required("Required"),
    lastName: Yup.string().min(2, "At least 2 chars").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    pincode: Yup.string().min(6, "Min 6 digits").required("Required"),
    password: Yup.string().min(8, "Min 8 chars").required("Required"),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 h-screen">
      {/* Image Section */}
      <div className="col-span-12 md:col-span-6 flex justify-center order-1 md:order-2">
        <img
          src={images.offerImage}
          alt="Offer"
          className="w-10/12 md:w-full object-cover h-48 md:h-full"
        />
      </div>

      {/* Form Section */}
      <div className="col-span-12 md:col-span-6 flex flex-col items-center justify-center order-2 md:order-1">
        <h1 className="text-2xl font-semibold underline mb-2">Register</h1>
        <p>
          Already a user?
          <Link to="/login" className="text-blue-800 mx-2 underline">
            Login
          </Link>
        </p>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            pincode: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            alert(JSON.stringify(values, null, 2));
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col w-10/12 md:w-6/12 mt-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-6/12">
                  <label>First Name</label>
                  <Field name="firstName" as={Input} placeholder="First Name" />
                  <ErrorMessage name="firstName" component="p" className="text-red-500 text-sm" />
                </div>

                <div className="w-6/12">
                  <label>Last Name</label>
                  <Field name="lastName" as={Input} placeholder="Last Name" />
                  <ErrorMessage name="lastName" component="p" className="text-red-500 text-sm" />
                </div>
              </div>

              <div>
                <label>Email</label>
                <Field name="email" as={Input} placeholder="Email" />
                <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
              </div>

              <div>
                <label>Pincode</label>
                <Field name="pincode" as={Input} placeholder="Pincode" />
                <ErrorMessage name="pincode" component="p" className="text-red-500 text-sm" />
              </div>

              <div>
                <label>Password</label>
                <Field name="password" as={Input} placeholder="Password" type="password" />
                <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
              </div>

              <Button type="submit" variant="filled" color="#162031" radius="md" className="mt-4">
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
