import { Input, Button } from "@mantine/core";
import { Link } from "react-router-dom";
import images from "../../images/images";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

type Props = {};

interface ForgotPasswordValues {
  email: string;
}

const ForgotPassword = (props: Props) => {
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen">
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

      {/* Forgot Password Section */}
      <div className="col-span-12 md:col-span-6 flex flex-col items-center md:justify-center order-1 md:order-1">
        <h1 className="text-2xl font-semibold underline mb-2">
          Forgot Password
        </h1>
        <p>
          Already a user?
          <Link to="/my-account" className="text-blue-800 ml-2 underline">
            Login
          </Link>
        </p>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={(values: ForgotPasswordValues, helpers: FormikHelpers<ForgotPasswordValues>) => {
            alert(`Password reset link sent to: ${values.email}`);
          }}
        >
          {({ handleSubmit }: { handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void }) => (
            <Form
              onSubmit={handleSubmit}
              className="flex flex-col w-10/12 md:w-6/12 mt-6 space-y-4"
            >
              {/* Email */}
              <div>
                <label className="block mb-1 font-medium">Email ID</label>
                <Field
                  name="email"
                  as={Input}
                  placeholder="Enter your registered email"
                />
                <ErrorMessage
                  name="email"
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
              >
                Send Reset Link
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
