import axios from "axios";
import { useFormik } from "formik";
import { Pill } from "lucide-react";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { UserContext } from "../../Context/UserContext";
import toast from 'react-hot-toast';

export default function Signup() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .required("First Name is required")
      .max(100, "First Name cannot exceed 100 characters"),
    last_name: Yup.string()
      .required("Last Name is required")
      .max(100, "Last Name cannot exceed 100 characters"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required")
      .max(255, "Email cannot exceed 255 characters"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^[A-Z][A-Za-z0-9#?!@$%^&*-]{5,10}$/,
        "Password must be at least 8 characters and contain an uppercase letter , a lowercase letter, a numbers, and a special character."
      ),

    password_confirmation: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    phone: Yup.string()
      .required("Phone Number is required")
      .matches(
        /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/,
        "Phone Number must start with +20 followed by 10 digits (e.g., +20 123 456 7890)"
      ),
    gender: Yup.string()
      .required("Gender is required")
      .oneOf(["male", "female"], "Gender must be either male or female"),

  });


  let navigate = useNavigate();



  const [apiError, setapiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  let { setUserLogin } = useContext(UserContext)
  async function handleRegister(formValues) {
    setIsLoading(true);
    setapiError("");

    try {
      const response = await axios.post(`${apiUrl}/auth/register`, formValues, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response?.data?.success === true) {
        localStorage.setItem("userToken", response.data.data.access_token);
        localStorage.setItem("refreshToken", response.data.data.refresh_token);

        setUserLogin(response.data.data.access_token);

        navigate("/signin");
        toast.success('User Sign Up successfully')

      }

      else {
        setapiError(response?.data?.message || "Registration failed.");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      setapiError(message);
    } finally {
      setIsLoading(false);
    }
  }




  let formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      gender: '',
      user_type_id: 1

    },
    validationSchema,
    onSubmit: handleRegister

  });





















  return (


    <div className="min-h-screen flex flex-col justify-between bg-gray-50 px-4 class">

      <div className="w-full max-w-md mt-10 mb-10 bg-white p-8 rounded-xl shadow-lg mx-auto">
        <div className="flex justify-center mb-4">
          <Pill className="h-6 w-6 text-teal-600" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">
          Create an Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Join Egypt's first medication delivery platform
        </p>

        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="first_name"
                className="text-left block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                className="focus:outline-none focus:ring-2 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="Mohamed"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.first_name}
                aria-invalid={
                  formik.errors.first_name && formik.touched.first_name
                    ? "true"
                    : "false"
                }
              />
              {formik.errors.first_name && formik.touched.first_name ? (
                <div
                  className="p-3 text-sm text-red-800 rounded-lg bg-red-50 mt-1"
                  role="alert"
                >
                  {formik.errors.first_name}
                </div>
              ) : null}
            </div>
            <div className="w-1/2">
              <label
                htmlFor="last_name"
                className="block text-left text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                className="w-full focus:outline-none focus:ring-2 p-2.5 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="Essam"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.last_name}
                aria-invalid={
                  formik.errors.last_name && formik.touched.last_name
                    ? "true"
                    : "false"
                }
              />
              {formik.errors.last_name && formik.touched.last_name ? (
                <div
                  className="p-3 text-sm text-red-800 rounded-lg bg-red-50 mt-1"
                  role="alert"
                >
                  {formik.errors.last_name}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-left text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full focus:outline-none focus:ring-2 p-2.5 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              placeholder="m.essam@example.com"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
              aria-invalid={
                formik.errors.email && formik.touched.email ? "true" : "false"
              }
            />
            {formik.errors.email && formik.touched.email ? (
              <div
                className="p-3 text-sm text-red-800 rounded-lg bg-red-50 mt-1"
                role="alert"
              >
                {formik.errors.email}
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-left text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full focus:outline-none focus:ring-2 p-2.5 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              placeholder="+20 123 456 7890"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.phone}
              aria-invalid={
                formik.errors.phone && formik.touched.phone ? "true" : "false"
              }
            />
            {formik.errors.phone && formik.touched.phone ? (
              <div
                className="p-3 text-sm text-red-800 rounded-lg bg-red-50 mt-1"
                role="alert"
              >
                {formik.errors.phone}
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-left text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full focus:outline-none focus:ring-2 p-2.5 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
              aria-invalid={
                formik.errors.password && formik.touched.password
                  ? "true"
                  : "false"
              }


            />
            {formik.errors.password && formik.touched.password ? (
              <div
                className="p-3 text-sm text-red-800 rounded-lg bg-red-50 mt-1"
                role="alert"
              >
                {formik.errors.password}
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="password_confirmation"
              className="block text-left text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              className="w-full focus:outline-none focus:ring-2 p-2.5 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password_confirmation}
              aria-invalid={
                formik.errors.password_confirmation &&
                  formik.touched.password_confirmation
                  ? "true"
                  : "false"
              }
            />
            {formik.errors.password_confirmation &&
              formik.touched.password_confirmation ? (
              <div
                className="p-3 text-sm text-red-800 rounded-lg bg-red-50 mt-1"
                role="alert"
              >
                {formik.errors.password_confirmation}
              </div>
            ) : null}

          </div>


          <div>
            <label
              htmlFor="gender"
              className="block text-left text-sm font-medium text-gray-700 mb-1"
            >
              Gender
            </label>
            <select id="gender" name="gender" className="w-full focus:outline-none focus:ring-2 p-2.5 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.gender}
              aria-invalid={
                formik.errors.gender && formik.touched.gender ? "true" : "false"
              }

            >
              <option value="">Select Gender</option>
              <option value="male">male</option>
              <option value="female">female</option>

            </select>
            {formik.errors.gender && formik.touched.gender ? (
              <div
                className="p-3 text-sm text-red-800 rounded-lg bg-red-50 mt-1"
                role="alert"
              >
                {formik.errors.gender}
              </div>
            ) : null}
          </div>


          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 text-teal-600 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
              I agree to the
              <Link to="#" className="ms-1 me-1 text-teal-600 hover:underline">
                Terms of Service
              </Link>
              and
              <Link to="#" className="ms-1 text-teal-600 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold py-2.5 rounded-lg shadow-sm transition duration-200"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
          {apiError ? <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
            {apiError}
          </div> : null}

        </form>

        <p className="text-sm text-center text-gray-700 mt-6">
          Already have an account?
          <Link
            to={"/signin"}
            className="ms-2 text-teal-600 font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
      <footer className="text-center text-gray-500 text-sm py-4">
        © 2025 Dwayee. All rights reserved.
        <Link to="#" className="mx-2 text-teal-600 hover:underline">
          Terms of Service
        </Link>
        <Link to="#" className="text-teal-600 hover:underline">
          Privacy
        </Link>
      </footer>
    </div>
  );
}
