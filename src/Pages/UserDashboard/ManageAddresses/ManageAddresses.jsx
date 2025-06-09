import React, { useEffect, useState } from 'react';
import { MapPin, SquarePen, Trash } from 'lucide-react'
import { getNames } from 'country-list';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../../Context/UserContext';
import Select from 'react-select';
import { useFormik } from 'formik';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

export default function ManageAddresses() {
  const { userLogin, loading } = useContext(UserContext);
  const [governorates, setGovernorates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [editAddress, setEditAddress] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  if (loading) {
    return <p>Loading...</p>;
  } else if (!userLogin) {
    return <Navigate to="/signin" />;
  }
  

  const userData = userLogin.user;
  const fullName = `${userData?.first_name ?? ''} ${userData?.last_name ?? ''}`.trim() || 'User Name';

  const [addresses, setAddresses] = useState([]);
  const fetchAddresses = () => {
    axios
      .get(`${apiUrl}/user/addresses`, {
        headers: { Authorization: `Bearer ${userLogin.token}` },
      })
      .then(res => {
        setAddresses(res.data.data); 
      });
  };
  useEffect(() => {
    if (userLogin) {
      fetchAddresses();
    }
  }, [userLogin]);






  const [defaultId, Id] = useState(1);
  const handleDelete = (id) => {
    axios
      .post(`${apiUrl}/user/addresses/delete/${id}`, {},  {
        headers: { Authorization: `Bearer ${userLogin.token}` },
      })
      .then(() => {
        fetchAddresses();
        if (id === defaultId) {
          Id(null); 
        }
      });
  };


  

  const handleSetDefault = (id) => {
    axios
      .post(`${apiUrl}/user/addresses/${id}/default`, {}, {
        headers: {
          Authorization: `Bearer ${userLogin.token}`,
        },
      })
      .then(() => {
        fetchAddresses(); 
      })
      .catch((error) => {
        console.error("Failed to set default address", error);
      });
  };


useEffect(() => {
  if (addresses?.length) {
    const defaultAddr = addresses.find(addr => addr.is_default);
    Id(defaultAddr?.id || null);
  }
}, [addresses]);



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


  const handleSubmit = (values, { resetForm, setSubmitting }) => {
    const url = editAddress
      ? `${apiUrl}/user/addresses/update/${editAddress.id}`
      : `${apiUrl}/user/addresses/create`;

    const method = editAddress ? "post" : "post";

    axios[method](url, values, {
      headers: { Authorization: `Bearer ${userLogin.token}` },

    })
      .then(() => {
        resetForm();
        setEditAddress(null);
        fetchAddresses();
      })
      .finally(() => setSubmitting(false));
  };
  let formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      address: '',
      governorate_id: '',
      city_id: '',
      postal_code: '',
      is_default: false
    },
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (editAddress) {
      formik.setValues({
        name: editAddress.name || '',
        phone: editAddress.phone || '',
        address: editAddress.address || '',
        governorate_id: editAddress.governorate?.id || '',
        city_id: editAddress.city?.id || '',
        postal_code: editAddress.postal_code || '',
        is_default: editAddress.is_default || false,
      });



      if (editAddress.governorate?.id) {
        axios
          .get(`${apiUrl}/items/cities?governorate_id=${editAddress.governorate.id}`)
          .then(res => {
            setFilteredCities(res.data.data);
          });
      }
    }
  }, [editAddress]);


  return (
    <>
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">
        <Link
          to="/userdashboard"
          className="text-lg ml-4 mb-4 block text-start font-semibold"
        >
          <span className="hover:bg-gray-100 px-1 rounded">&lt; Back to Dashboard</span>
        </Link>

        <div className="flex justify-between items-center mb-6 text-start">
          <div>
            <h2 className="text-2xl font-bold">Manage Addresses</h2>
            <p className="text-sm text-gray-500">
              Add and manage your delivery addresses
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {addresses?.map((addr) => (
            <div
              key={addr.id}
              className="border border-gray-300 rounded-lg p-4 bg-white shadow-xs text-start"
            >
              <div className="flex items-center justify-between">
                <div className='flex items-center'>
                  <MapPin className='w-5 h-5 mr-1 text-teal-600' />
                  <h3 className="font-bold text-xl">{addr. name}</h3>
                </div>
                {defaultId === addr.id && (
                  <span className="text-xs border border-gray-300 text-gray-800 px-2 py-0.5 rounded-full font-semibold">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4">Delivery Address</p>
              <div className="text-sm space-y-1 mb-5">
                <p className="font-medium">{fullName}</p>
                <p>{addr.phone || '+20 123 456 7890'}</p>
                <p>{addr.city?.name}, {addr.governorate?.name}</p>
                <p>{addr.address}, {addr. postal_code}</p>
              </div>
              <div className="flex gap-2 mt-2 justify-between">
                <button
                  onClick={() => setEditAddress(addr)}
                  className="text-sm border px-3 py-1 rounded-md border-gray-200 hover:bg-gray-100 font-semibold flex items-center">
                  <SquarePen className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <div className='flex gap-2'>
                  {addr.id !== defaultId && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-sm border border-gray-300 px-4 py-2 font-medium rounded-md hover:bg-gray-100"
                    >
                      Set as Default
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-sm border border-gray-200 text-red-500 px-3 py-1 rounded-md hover:bg-red-50 font-semibold flex items-center"
                  >
                    <Trash className="w-4 h-4 mr-0.5 text-red-500" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-6 text-start space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Add New Address</h3>
            <p className="text-sm text-gray-500 mb-5">
              Enter the details for your new delivery address
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium">
                Address Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g., Home, Work"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-medium">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+20 106 169 3310"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="address" className="block text-sm font-medium">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              type="text"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Street address, building, apartment, etc."
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            ></textarea>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className='w-full'>
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
            <div className='w-full'>
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
          </div>
          <div className="space-y-1">
            <label htmlFor="postal_code" className="block text-sm font-medium">
              Postal Code
            </label>
            <input
              id="postal_code"
              name="postal_code"
              type="text"
              value={formik.values.postal_code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Postal Code"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>


          <div className="flex items-center gap-2">
            <input id="is_default"
              name="is_default"
              type="checkbox"
              checked={formik.values.is_default}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-4 w-4" />
            <label htmlFor="is_default" className="text-sm font-semibold">
              Set as default address
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button className="text-sm border border-gray-300 px-4 py-2 font-medium rounded-md hover:bg-gray-100">
              Cancel
            </button>
            <button
              type="button"
              onClick={formik.handleSubmit}
              className="text-sm bg-black text-white px-4 py-2 font-medium rounded-md hover:opacity-80">
              Save Address
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
