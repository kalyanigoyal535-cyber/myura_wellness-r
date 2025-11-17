import React from "react";
import { Input, Button } from "@mantine/core";
import { Link } from "react-router-dom";
import images from "../../images/images";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Login = () => {
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 h-screen">
      {/* Image Section */}
      <div className="col-span-12 md:col-span-6 flex justify-center order-1 md:order-2">
        <img
          src={images.offerImage}
          alt="Offer"
          className="w-10/12 md:w-full object-cover h-48 md:h-full mt-20 md:mt-0 "
        />
      </div>

      {/* Login Section */}
      <div className="col-span-12 md:col-span-6 flex flex-col items-center justify-center order-2 md:order-1">
        <h1 className="text-2xl font-semibold underline mb-2">Login</h1>
        <p>
          New User?
          <Link to="/signup" className="text-blue-800 ml-2 underline">
            Sign-up
          </Link>
        </p>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            alert(JSON.stringify(values, null, 2));
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col w-10/12 md:w-6/12 mt-6 space-y-4">
              <div>
                <label>Email-id</label>
                <Field name="email" as={Input} placeholder="Email Id" />
                <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
              </div>

              <Button type="submit" variant="filled" color="#162031" radius="md" className="mt-2">
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
