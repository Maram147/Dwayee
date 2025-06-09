import React, { useContext, useEffect, useState } from 'react';
import style from './Join.module.css';
import { Users, TrendingUp, Shield, Phone, MapPin, Pill } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import Select from 'react-select'; 

export default function Join() {
  let navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const pharmacyValidationSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required').max(100, 'First name must be at most 100 characters'),
    last_name: Yup.string().required('Last name is required').max(100, 'Last name must be at most 100 characters'),
    email: Yup.string().required('Email is required').email('Invalid email format').max(255, 'Email must be at most 255 characters'),
    password: Yup.string()
      .required('Password is required')
      .matches(/^[A-Z][A-Za-z0-9#?!@$%^&*-]{5,10}$/, 'Password must be at least 8 characters and contain an uppercase letter , a lowercase letter, a numbers, and a special character.'),
    password_confirmation: Yup.string().required("Confirm password is required").oneOf([Yup.ref("password")], "Passwords must match"),
    gender: Yup.string().required('Gender is required').oneOf(["male", "female"], 'Invalid gender selection'),
    position: Yup.string().required('Position is required').max(100, 'Position must be at most 100 characters'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/, "Invalid phone number"),
    user_type_id: Yup.string().required('User type is required').oneOf(["2"], 'Invalid user type'),
    governorate_id: Yup.string().required("Governorate is required").typeError('Governorate must be a number'),
    city_id: Yup.string().required("City is required").typeError('City must be a number'),
    pharmacy_name: Yup.string().required('Pharmacy name is required').max(100, 'Pharmacy name must be at most 100 characters'),
    pharmacy_address: Yup.string().required('Pharmacy address is required').max(255, 'Pharmacy address must be at most 255 characters'),
    pharmacy_postal_code: Yup.string().required('Postal code is required').max(20, 'Postal code must be at most 20 characters'),
    pharmacy_phone: Yup.string()
      .required('Pharmacy phone is required')
      .matches(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/, "Invalid pharmacy phone"),
    pharmacy_opening_time: Yup.string()
      .required("Opening time is required")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    pharmacy_closing_time: Yup.string()
      .required("Closing time is required")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    pharmacy_working_days: Yup.array()
      .of(
        Yup.string().oneOf([
          "saturday",
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
        ], 'Invalid day selection')
      )
      .required("Working days are required")
      .min(1, 'At least one working day must be selected'),
    pharmacy_is_delivery_available: Yup.boolean().required('Delivery availability is required'),
  });

  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  let { setUserLogin } = useContext(UserContext);

  async function handleRegister(formValues) {
    setIsLoading(true);
    setApiError("");

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
      } else {
        setApiError(response?.data?.message || "Registration failed.");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      setApiError(message);
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
      user_type_id: '2',
      position: '',
      pharmacy_name: '',
      pharmacy_address: '',
      pharmacy_postal_code: '',
      pharmacy_phone: '',
      pharmacy_opening_time: '',
      pharmacy_closing_time: '',
      pharmacy_working_days: [],
      pharmacy_is_delivery_available: false,
      governorate_id: '',
      city_id: ''
    },
    validationSchema: pharmacyValidationSchema,
    onSubmit: handleRegister
  });

  const [governorates, setGovernorates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  

  useEffect(() => {
    axios.get(`${apiUrl}/items/governorates`).then(res => setGovernorates(res.data.data));
  }, []);

  const handleGovernorateChange = (selectedOption, setFieldValue) => {
    const selectedGovernorateId = selectedOption ? selectedOption.value : '';
    setFieldValue('governorate_id', selectedGovernorateId);
    setFieldValue('city_id', '');

    if (selectedGovernorateId) {
      axios
        .get(`${apiUrl}/items/cities?governorate_id=${selectedGovernorateId}`)
        .then(res => {
          setFilteredCities(res.data.data);
        });
    } else {
      setFilteredCities([]);
    }
  };

  const governorateOptions = governorates.map(gov => ({
    value: gov.id,
    label: gov.name,
  }));

  const cityOptions = filteredCities.map(city => ({
    value: city.id,
    label: city.name,
  }));

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused || (formik.touched.governorate_id && formik.errors.governorate_id) ? '#ef4444' : '#d1d5db',
      '&:hover': {
        borderColor: state.isFocused || (formik.touched.governorate_id && formik.errors.governorate_id) ? '#ef4444' : '#14b8a6',
      },
      boxShadow: 'none',
      padding: '0.25rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem', 
      minHeight: '38px', 
      [state.selectProps.name === 'city_id' && !formik.values.governorate_id ? 'opacity' : '']: 0.5,
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      maxHeight: '200px',
      overflowY: 'auto',
      fontSize: '0.875rem', 
      width: '100%', 
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '200px',
      overflowY: 'auto',
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '0.875rem', 
      padding: '0.25rem 0.5rem', 
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '0.875rem',
    }),
  };

  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-teal-500 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-repeat opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M30 20h-4v4H10v12h16v4h4v-4h16V24H34v-4zm0 12h-4v-8h4v8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl text-white">
              Join Dwayee as a Pharmacy Partner
            </h1>
            <p className="max-w-[600px] sm:max-w-[700px] text-white text-sm md:text-base lg:text-xl/relaxed">
              Expand your reach and grow your business by joining Egypt's first dedicated medication platform
            </p>
          </div>
        </div>
      </section>

      <section className='py-10 sm:py-16 md:py-20 text-center'>
        <h2 className='text-2xl sm:text-3xl mb-6 font-bold maincolor'>
          Why Join Dwayee?
        </h2>
        <p className='mb-8 text-gray-500 text-sm sm:text-base'>
          Partner with us and experience the benefits of being part of Egypt's leading medication platform
        </p>
        <div className='flex flex-col items-center sm:flex-row sm:justify-center gap-6 px-4 mx-4 sm:mx-6 md:mx-12'>
          <div className='bg-white p-4 sm:p-6 rounded-xl border border-gray-200 w-full sm:w-auto'>
            <div className='mb-3 sm:mb-4 rounded-full bg-[#f0fdfa] w-fit mx-auto p-3 sm:p-4'>
              <Users className="h-6 sm:h-8 w-6 sm:w-8 text-teal-600 mx-auto" />
            </div>
            <h2 className='text-lg sm:text-xl font-semibold mb-2'>
              Reach More Customers
            </h2>
            <p className='text-gray-500 text-sm sm:text-base'>
              Connect with thousands of potential customers looking for medications in your area.
            </p>
          </div>
          <div className='bg-white p-4 sm:p-6 rounded-xl border border-gray-200 w-full sm:w-auto'>
            <div className='mb-3 sm:mb-4 rounded-full bg-[#f0fdfa] w-fit mx-auto p-3 sm:p-4'>
              <TrendingUp className="h-6 sm:h-8 w-6 sm:w-8 text-teal-600 mx-auto" />
            </div>
            <h2 className='text-lg sm:text-xl font-semibold mb-2'>
              Increase Sales
            </h2>
            <p className='text-gray-500 text-sm sm:text-base'>
              Boost your revenue with online orders and expand your business beyond physical limitations.
            </p>
          </div>
          <div className='bg-white p-4 sm:p-6 rounded-xl border border-gray-200 w-full sm:w-auto'>
            <div className='mb-3 sm:mb-4 rounded-full bg-[#f0fdfa] w-fit mx-auto p-3 sm:p-4'>
              <Shield className="h-6 sm:h-8 w-6 sm:w-8 text-teal-600 mx-auto" />
            </div>
            <h2 className='text-lg sm:text-xl font-semibold mb-2'>
              Secure Platform
            </h2>
            <p className='text-gray-500 text-sm sm:text-base'>
              Our platform ensures secure transactions and protects your business information.
            </p>
          </div>
        </div>
      </section>

      <section className='w-full py-8 sm:py-12 md:py-16 lg:py-12 bg-gray-50 overflow-visible'>
        <h2 className='text-2xl sm:text-3xl mb-6 font-bold maincolor text-center'>
          Register Your Pharmacy
        </h2>
        <p className='mb-8 text-gray-500 max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base'>
          Fill out the form below to start the registration process. Our team will review your information and contact you shortly.
        </p>
        <div className='w-full max-w-lg sm:max-w-2xl md:max-w-3xl mt-6 sm:mt-8 mb-6 sm:mb-8 bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg mx-auto overflow-visible'>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <h3 className="text-start text-lg sm:text-xl font-bold border-b border-teal-300 pb-2">
              Pharmacy Information
            </h3>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='w-full sm:w-1/2'>
                <label htmlFor="pharmacy_name" className="text-left block text-sm sm:text-base text-gray-700 mb-1 font-bold">
                  Pharmacy Name
                </label>
                <input
                  type="text"
                  id="pharmacy_name"
                  name="pharmacy_name"
                  value={formik.values.pharmacy_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`focus:outline-none focus:ring-2 w-full p-2 sm:p-2.5 border rounded-lg ${formik.touched.pharmacy_name && formik.errors.pharmacy_name
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  placeholder="Enter pharmacy name"
                />
                {formik.touched.pharmacy_name && formik.errors.pharmacy_name && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.pharmacy_name}</p>
                )}
              </div>
              <div className='w-full sm:w-1/2'>
                <label htmlFor="pharmacy_phone" className="block text-left text-sm sm:text-base font-bold text-gray-700 mb-1">
                  Pharmacy Phone Number
                </label>
                <input
                  type="text"
                  id="pharmacy_phone"
                  name="pharmacy_phone"
                  value={formik.values.pharmacy_phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`focus:outline-none focus:ring-2 w-full p-2 sm:p-2.5 border rounded-lg ${formik.touched.pharmacy_phone && formik.errors.pharmacy_phone
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  placeholder="+20 106 169 3310"
                />
                {formik.touched.pharmacy_phone && formik.errors.pharmacy_phone && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.pharmacy_phone}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="pharmacy_address" className="block text-left text-sm sm:text-base font-bold text-gray-700 mb-1">
                Pharmacy Address
              </label>
              <input
                type="text"
                id="pharmacy_address"
                name="pharmacy_address"
                value={formik.values.pharmacy_address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`focus:outline-none focus:ring-2 w-full p-2 sm:p-2.5 border rounded-lg ${formik.touched.pharmacy_address && formik.errors.pharmacy_address
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                  }`}
                placeholder="Enter full address"
              />
              {formik.touched.pharmacy_address && formik.errors.pharmacy_address && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.pharmacy_address}</p>
              )}
            </div>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='w-full sm:w-1/3'>
                <label htmlFor="governorate_id" className="block text-left text-sm sm:text-base font-bold text-gray-700 mb-1">
                  Governorate
                </label>
                <Select
                  id="governorate_id"
                  name="governorate_id"
                  options={governorateOptions}
                  value={governorateOptions.find(option => option.value === formik.values.governorate_id)}
                  onChange={(option) => handleGovernorateChange(option, formik.setFieldValue)}
                  onBlur={() => formik.setFieldTouched('governorate_id', true)}
                  styles={customStyles}
                  placeholder="Select a governorate"
                />
                {formik.touched.governorate_id && formik.errors.governorate_id && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.governorate_id}</p>
                )}
              </div>
               <div className='w-full sm:w-1/3'>
                <label htmlFor="city_id" className="text-left block text-sm sm:text-base text-gray-700 mb-1 font-bold">
                  City
                </label>
                <Select
                  id="city_id"
                  name="city_id"
                  options={cityOptions}
                  value={cityOptions.find(option => option.value === formik.values.city_id)}
                  onChange={(option) => formik.setFieldValue('city_id', option ? option.value : '')}
                  onBlur={() => formik.setFieldTouched('city_id', true)}
                  styles={customStyles}
                  placeholder="Select a city"
                  isDisabled={!formik.values.governorate_id}
                />
                {formik.touched.city_id && formik.errors.city_id && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.city_id}</p>
                )}
              </div>
              <div className='w-full sm:w-1/3'>
                <label htmlFor="pharmacy_postal_code" className="block text-left text-sm sm:text-base font-bold text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="pharmacy_postal_code"
                  name="pharmacy_postal_code"
                  value={formik.values.pharmacy_postal_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`focus:outline-none focus:ring-2 w-full p-2 sm:p-2.5 border rounded-lg ${formik.touched.pharmacy_postal_code && formik.errors.pharmacy_postal_code
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  placeholder="Postal code"
                />
                {formik.touched.pharmacy_postal_code && formik.errors.pharmacy_postal_code && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.pharmacy_postal_code}</p>
                )}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='w-full sm:w-1/2'>
                <label htmlFor="pharmacy_opening_time" className="text-left block text-sm sm:text-base text-gray-700 mb-1 font-bold">
                  Opening Time
                </label>
                <input
                  type="time"
                  id="pharmacy_opening_time"
                  name="pharmacy_opening_time"
                  value={formik.values.pharmacy_opening_time}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`focus:outline-none focus:ring-2 w-full p-2 sm:p-2.5 border rounded-lg ${formik.touched.pharmacy_opening_time && formik.errors.pharmacy_opening_time
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  placeholder="e.g., 09:00"
                />
                {formik.touched.pharmacy_opening_time && formik.errors.pharmacy_opening_time && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.pharmacy_opening_time}</p>
                )}
              </div>
              <div className='w-full sm:w-1/2'>
                <label htmlFor="pharmacy_closing_time" className="text-left block text-sm sm:text-base text-gray-700 mb-1 font-bold">
                  Closing Time
                </label>
                <input
                  type="time"
                  id="pharmacy_closing_time"
                  name="pharmacy_closing_time"
                  value={formik.values.pharmacy_closing_time}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={` focus:outline-none focus:ring-2 w-full p-2 sm:p-2.5 border rounded-lg ${formik.touched.pharmacy_closing_time && formik.errors.pharmacy_closing_time
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  placeholder="e.g., 22:00"
                />
                {formik.touched.pharmacy_closing_time && formik.errors.pharmacy_closing_time && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.pharmacy_closing_time}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-left text-sm sm:text-base font-bold text-gray-700 mb-1">
                Working Days
              </label>
              <div className="flex flex-wrap gap-3">
                {["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"].map(day => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      name="pharmacy_working_days"
                      value={day}
                      checked={formik.values.pharmacy_working_days.includes(day)}
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        const currentDays = formik.values.pharmacy_working_days;
                        if (checked) {
                          formik.setFieldValue('pharmacy_working_days', [...currentDays, value]);
                        } else {
                          formik.setFieldValue('pharmacy_working_days', currentDays.filter(d => d !== value));
                        }
                      }}
                      onBlur={formik.handleBlur}
                      className="mr-2 w-4 h-4"
                    />
                    <span className="capitalize text-sm sm:text-base">{day}</span>
                  </label>
                ))}
              </div>
              {formik.touched.pharmacy_working_days && formik.errors.pharmacy_working_days && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.pharmacy_working_days}</p>
              )}
            </div>
            <div>
              <label className="block text-left text-sm sm:text-base font-bold text-gray-700 mb-1">
                Is Delivery Available?
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pharmacy_is_delivery_available"
                    value="true"
                    checked={formik.values.pharmacy_is_delivery_available === true}
                    onChange={() => formik.setFieldValue('pharmacy_is_delivery_available', true)}
                    onBlur={formik.handleBlur}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-sm sm:text-base">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pharmacy_is_delivery_available"
                    value="false"
                    checked={formik.values.pharmacy_is_delivery_available === false}
                    onChange={() => formik.setFieldValue('pharmacy_is_delivery_available', false)}
                    onBlur={formik.handleBlur}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-sm sm:text-base">No</span>
                </label>
              </div>
              {formik.touched.pharmacy_is_delivery_available && formik.errors.pharmacy_is_delivery_available && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.pharmacy_is_delivery_available}</p>
              )}
            </div>

            <h3 className="text-start text-lg sm:text-xl font-bold border-b border-teal-300 pb-2">
              Contact Information
            </h3>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='w-full sm:w-1/2'>
                <label htmlFor="first_name" className="text-left block text-sm sm:text-base text-gray-700 mb-1 font-bold">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`focus:outline-none focus:ring-2 w-full p-2 sm:p-2.5 border rounded-lg ${formik.touched.first_name && formik.errors.first_name
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  placeholder="First name"
                />
                {formik.touched.first_name && formik.errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.first_name}</p>
                )}
              </div>
              <div className='w-full sm:w-1/2'>
                <label htmlFor="last_name" className="text-left block text-sm sm:text-base text-gray-700 mb-1 font-bold">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`focus:outline-none focus:ring-2 w-full p-2 sm:p-2.5 border rounded-lg ${formik.touched.last_name && formik.errors.last_name
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  placeholder="Last name"
                />
                {formik.touched.last_name && formik.errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.last_name}</p>
                )}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='w-full sm:w-1/2'>
                <label htmlFor="position" className="block text-left text-sm sm:text-base font-bold text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formik.values.position}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`focus:outline-none focus:ring-2 w-full p-2 sm:p-2.5 border rounded-lg ${formik.touched.position && formik.errors.position
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  placeholder="e.g., Owner, Manager"
                />
                {formik.touched.position && formik.errors.position && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.position}</p>
                )}
              </div>
              <div className='w-full sm:w-1/2'>
                <label htmlFor="gender" className="block text-left text-sm sm:text-base font-bold text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`focus:outline-none focus:ring-2 w-full p-2 sm:p-2.5 border rounded-lg ${formik.touched.gender && formik.errors.gender
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
                )}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='w-full sm:w-1/2'>
                <label htmlFor="email" className="text-left block text-sm sm:text-base text-gray-700 mb-1 font-bold">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`focus:outline-none focus:ring-2 w-full p-2 sm:p-2.5 border rounded-lg ${formik.touched.email && formik.errors.email
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  placeholder="email@example.com"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                )}
              </div>
              <div className='w-full sm:w-1/2'>
                <label htmlFor="phone" className="block text-left text-sm sm:text-base font-bold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`focus:outline-none focus:ring-2 w-full p-2 sm:p-2.5 border rounded-lg ${formik.touched.phone && formik.errors.phone
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  placeholder="+20 106 169 3310"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
                )}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='w-full sm:w-1/2'>
                <label htmlFor="password" className="block text-left text-sm sm:text-base font-bold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`focus:outline-none focus:ring-2 w-full p-2 sm:p-2.5 border rounded-lg ${formik.touched.password && formik.errors.password
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  placeholder="Enter password"
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                )}
              </div>
              <div className='w-full sm:w-1/2'>
                <label htmlFor="password_confirmation" className="block text-left text-sm sm:text-base font-bold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formik.values.password_confirmation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`focus:outline-none focus:ring-2 w-full p-2 sm:p-2.5 border rounded-lg ${formik.touched.password_confirmation && formik.errors.password_confirmation
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  placeholder="Confirm password"
                />
                {formik.touched.password_confirmation && formik.errors.password_confirmation && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.password_confirmation}</p>
                )}
              </div>
            </div>
            <input
              type="hidden"
              id="user_type_id"
              name="user_type_id"
              value={formik.values.user_type_id}
            />
            <div className="flex items-center flex-col sm:flex-row">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 maincolor border-gray-300 rounded mr-2 mb-2 sm:mb-0"
              />
              <label htmlFor="terms" className="m-auto text-sm sm:text-base text-gray-700 text-start">
                I agree to the
                <Link to="#" className="ms-1 me-1 maincolor hover:underline">
                  Terms of Service
                </Link>
                and
                <Link to="#" className="ms-1 maincolor hover:underline">
                  Privacy Policy
                </Link>
                . I confirm that all provided information is accurate and complete.
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 text-white py-2 sm:py-2.5 rounded-lg hover:bg-teal-700 transition disabled:opacity-50 text-sm sm:text-base"
            >
              {isLoading ? 'Registering...' : 'Register Pharmacy'}
            </button>
                      {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative mb-3 sm:mb-4 text-sm">
              <span className="block sm:inline">{apiError}</span>
            </div>
          )}

          </form>
        </div>
      </section>

      <footer className="w-full border-t text-start text-white py-6 sm:py-8 px-4 sm:px-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm sm:text-base space-y-4 sm:space-y-0">
          <div className='space-y-4'>
            <NavLink to="/" className="flex items-center gap-2">
              <Pill className="h-6 w-6 maincolor" />
              <span className="text-xl font-bold text-black">Dwayee-دوائي</span>
            </NavLink>
            <p className='text-gray-500 text-sm sm:text-base'>Your trusted pharmacy platform for finding and ordering medications.</p>
          </div>
          <div>
            <h4 className="text-black text-lg font-medium">Quick Links</h4>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <NavLink to="/" className="text-gray-500 hover:maincolor">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="text-gray-500 hover:maincolor">
                  About Us
                </NavLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium text-black">Legal</h4>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <NavLink to="#" className="text-gray-500 hover:maincolor">
                  Terms of Service
                </NavLink>
              </li>
              <li>
                <NavLink to="#" className="text-gray-500 hover:maincolor">
                  Privacy Policy
                </NavLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium text-black">Contact</h4>
            <ul className="space-y-2 text-sm sm:text-base text-gray-500">
              <li className="flex items-center">
                <Phone className="mr-2 h-4 w-4 maincolor" />
                <span>+20 106 169 7890</span>
              </li>
              <li className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 maincolor" />
                <span>Cairo, Egypt</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4 text-xs sm:text-sm text-gray-500">© 2025 Dwayee. All rights reserved.</div>
      </footer>
    </>
  );
}