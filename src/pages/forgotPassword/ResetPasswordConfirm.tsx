import { Input, Button } from "@mantine/core";
import { Link, useNavigate, useParams } from "react-router-dom";
import images from "../../images/images";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { authApi } from "../../services/auth";
import { useState, useEffect } from "react";

type Props = {};

interface ResetPasswordValues {
  new_password: string;
  new_password2: string;
}

const ResetPasswordConfirm = (props: Props) => {
  const navigate = useNavigate();
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  useEffect(() => {
    // Validate that uid and token are present
    if (!uid || !token) {
      setSubmitStatus('error');
      setErrorMessage('Invalid reset link. Please request a new password reset.');
    }
  }, [uid, token]);

  const validationSchema = Yup.object({
    new_password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    new_password2: Yup.string()
      .oneOf([Yup.ref('new_password')], "Passwords must match")
      .required("Please confirm your password"),
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

      {/* Reset Password Section */}
      <div className="col-span-12 md:col-span-6 flex flex-col items-center md:justify-center order-1 md:order-1">
        <h1 className="text-2xl font-semibold underline mb-2">
          Reset Password
        </h1>
        <p className="text-center mb-4">
          Enter your new password below.
        </p>

        {submitStatus === 'success' ? (
          <div className="flex flex-col w-10/12 md:w-6/12 mt-6 space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800 text-center">
              <p className="font-semibold mb-2">Password reset successfully!</p>
              <p className="text-sm mb-4">You can now login with your new password.</p>
              <Link
                to="/my-account"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={{ new_password: "", new_password2: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values: ResetPasswordValues, helpers: FormikHelpers<ResetPasswordValues>) => {
              if (!uid || !token) {
                setSubmitStatus('error');
                setErrorMessage('Invalid reset link. Please request a new password reset.');
                return;
              }

              setIsSubmitting(true);
              setSubmitStatus('idle');
              setErrorMessage('');

              try {
                await authApi.confirmPasswordReset({
                  uid,
                  token,
                  new_password: values.new_password,
                  new_password2: values.new_password2,
                });
                setSubmitStatus('success');
                // Redirect to login after 3 seconds
                setTimeout(() => {
                  navigate('/my-account');
                }, 3000);
              } catch (error) {
                setSubmitStatus('error');
                setErrorMessage(error instanceof Error ? error.message : 'Failed to reset password. The link may have expired. Please request a new one.');
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {({ handleSubmit }: { handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void }) => (
              <Form
                onSubmit={handleSubmit}
                className="flex flex-col w-10/12 md:w-6/12 mt-6 space-y-4"
              >
                {/* New Password */}
                <div>
                  <label className="block mb-1 font-medium">New Password</label>
                  <div className="relative">
                    <Field
                      name="new_password"
                      type={showPassword ? "text" : "password"}
                      as={Input}
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <ErrorMessage
                    name="new_password"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block mb-1 font-medium">Confirm New Password</label>
                  <div className="relative">
                    <Field
                      name="new_password2"
                      type={showPassword2 ? "text" : "password"}
                      as={Input}
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword2(!showPassword2)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword2 ? "Hide" : "Show"}
                    </button>
                  </div>
                  <ErrorMessage
                    name="new_password2"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Error Message */}
                {submitStatus === 'error' && errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                    {errorMessage}
                  </div>
                )}

                {/* Button */}
                <Button
                  type="submit"
                  variant="filled"
                  color="#162031"
                  radius="md"
                  className="mt-2"
                  loading={isSubmitting}
                  disabled={isSubmitting || !uid || !token}
                >
                  {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                </Button>

                {/* Back to Login */}
                <div className="text-center mt-4">
                  <Link to="/my-account" className="text-blue-800 underline text-sm">
                    Back to Login
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;











