import React, { useState, useContext, useEffect } from "react";
import style from "./SignIn.module.css";
import { Pill } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { UserContext } from "../../Context/UserContext";
import '@fortawesome/fontawesome-free/css/all.min.css';
import toast from 'react-hot-toast';
import { useCart } from "../../Context/CartContext";

export default function SignIn() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { setUserLogin, setUserType, userLogin, userType } = useContext(UserContext);
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { fetchCart } = useCart();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required")
      .max(255, "Email cannot exceed 255 characters"),
    password: Yup.string()
      .required("Password is required")
    // .matches(
    //   /^[A-Z][A-Za-z0-9#?!@$%^&*-]{5,10}$/,
    //   "Password must be at least 8 characters and contain an uppercase letter , a lowercase letter, a numbers, and a special character."

    // ),

  });

  async function handleLogin(formValues) {
    setIsLoading(true);
    setApiError('');

    try {
      const { data } = await axios.post(`${apiUrl}/auth/login`, formValues);
      console.log("API Response:", data);

      if (data?.success === true) {
        const { access_token, refresh_token, user } = data.data;
        console.log("User Type ID from API:", user.user_type);

        const userTypeString = user.user_type;

        localStorage.setItem('userToken', access_token);
        localStorage.setItem('userData', JSON.stringify(user));
        setUserLogin({ token: access_token, user });
        fetchCart();

        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('userType', userTypeString);

        setUserType(userTypeString);

        // if (userTypeString === "user") {
        //   navigate('/userdashboard');
        //   toast.success('User Sign in successfully')


        // } else {
        //   navigate('/pharmacydashboard');
        //   toast.success('User Sign in successfully')


        // }

        toast.success('User Sign in successfully');
        setTimeout(() => {
          navigate(userTypeString === "user" ? "/userdashboard" : "/pharmacydashboard");
        }, 0);
      } else {
        setApiError(data?.message || "Login failed");
        toast.error(data?.message || "Login failed");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  }







  let formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: handleLogin
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">

      <div className="flex items-center justify-center flex-grow">
        <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
          <div className="flex justify-center mb-4">
            <Pill className="h-6 w-6 maincolor" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">
            Sign In to Dwayee
          </h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Enter your credentials to access your account
          </p>

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="text-left block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="m.essam@example.com"
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formik.touched.email && formik.errors.email
                  ? 'border-red-500 focus:ring-red-500 bg-red-100'
                  : 'border-gray-300 focus:ring-teal-500'
                  }`}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-left text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formik.touched.password && formik.errors.password
                  ? 'border-red-500 focus:ring-red-500 bg-red-100 '
                  : 'border-gray-300 focus:ring-teal-500'
                  }`}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
              />
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 maincolor border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold py-2.5 rounded-lg shadow-sm transition duration-200 disabled:opacity-50"
            >
              {isLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Sign In'}
            </button>
            {apiError ? (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                {apiError}
              </div>
            ) : null}

          </form>

          <p className="text-sm text-center text-gray-700 mt-6">
            Don't have an account?
            <Link
              to={"/signup"}
              className="ms-2 maincolor font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <footer className="text-center text-gray-500 text-sm py-4">
        © 2025 Dwayee. All rights reserved.
        <Link to="#" className="mx-2 maincolor hover:underline">
          Terms of Service
        </Link>
        <Link to="#" className="maincolor hover:underline">
          Privacy
        </Link>
      </footer>
    </div>
  );
}
