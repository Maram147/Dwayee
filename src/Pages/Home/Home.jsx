import React, { useRef, useEffect, useState } from 'react'
import style from './Home.module.css'
import { Search, MapPin, Clock, Pill, ShoppingBag, Phone, ChevronRight, Heart, Award, Users, Shield } from "lucide-react"
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'
import placeholder from '@/assets/images/placeholder.svg';
import { LockIcon } from 'lucide-react';

import home from '@/assets/images/Home.jpg';

import axios from 'axios';
import Select from 'react-select';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [governorates, setGovernorates] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to pharmacies page with search parameters
    navigate(`/pharmacies?q=${encodeURIComponent(searchTerm)}&governorate_id=${encodeURIComponent(selectedGovernorate)}`);
  };

  const getGovernorates = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/items/governorates`);
      setGovernorates(data?.data || []);
    } catch (err) {
      console.error("Error loading governorates:", err);
    }
  };

  useEffect(() => {
    getGovernorates();
  }, []);

  const [pharmacies, setPharmacies] = useState([]);
  const [randomPharmacyImage, setRandomPharmacyImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const getAllPharmacies = async () => {
    setLoading(true);
    try {
      const url = `${apiUrl}/pharmacies`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error........: ${res.status}`);
      const json = await res.json();
      console.log("All pharmacies:", json);
      const arr = json.data?.data || [];
      setPharmacies(arr);
      if (arr.length > 0) {
        const idx = Math.floor(Math.random() * arr.length);
        const randomPharmacy = arr[idx];
        const imageUrl =
          randomPharmacy.image || randomPharmacy.photo || placeholder;
        setRandomPharmacyImage(imageUrl);
      } else {
        setRandomPharmacyImage(placeholder);
      }
    } catch (err) {
      console.error("Failed to fetch pharmacies:", err);
      setRandomPharmacyImage(placeholder);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPharmacies();
  }, []);


  return (
    <>
      <div className="font-sans">
        {/* home1 */}
        <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-500 to-teal-600 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-repeat opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M30 20h-4v4H10v12h16v4h4v-4h16V24H34v-4zm0 12h-4v-8h4v8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white text-start">
                    Egypt's First Dedicated Medication Platform
                  </h1>
                  <p className="max-w-[600px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-2 text-start">
                    Find and Order Medications with Ease
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="relative z-20 max-w-md bg-white p-4 rounded-lg shadow-lg space-y-2">
                  <div className="flex gap-2">
                    {/* Search Input */}
                    <div className="relative w-1/2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Pharmacy name..."
                        className="w-full pl-10 pr-2 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#10A294] rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    {/* Governorate Select using react-select */}
                    <div className="relative w-1/2 z-30">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-40" />
                      <label htmlFor="governorate-select" className="sr-only">
                        Select Governorate
                      </label>
                      <Select
                        aria-label="Governorate"
                        options={[
                          { value: "", label: "All Governorates" },
                          ...governorates.map((gov) => ({
                            value: gov.id,
                            label: gov.name,
                          })),
                        ]}
                        value={
                          selectedGovernorate
                            ? {
                              value: selectedGovernorate,
                              label:
                                governorates.find((gov) => gov.id === selectedGovernorate)?.name ||
                                "All Governorates",
                            }
                            : { value: "", label: "All Governorates" }
                        }
                        onChange={(selectedOption) =>
                          setSelectedGovernorate(selectedOption ? selectedOption.value : "")
                        }
                        className="w-full text-gray-700"
                        classNamePrefix="react-select"
                        menuPlacement="bottom"
                        styles={{
                          control: (base) => ({
                            ...base,
                            paddingLeft: "2.5rem",
                            paddingRight: "0.5rem",
                            borderColor: "#D1D5DB",
                            boxShadow: "none",
                            "&:hover": {
                              borderColor: "#10A294",
                            },
                            "&:focus": {
                              borderColor: "#10A294",
                              boxShadow: "0 0 0 2px rgba(16, 162, 148, 0.2)",
                            },
                            borderRadius: "0.5rem",
                            height: "42px",
                          }),
                          option: (base, { isFocused, isSelected }) => ({
                            ...base,
                            backgroundColor: isSelected
                              ? "#10A294"
                              : isFocused
                                ? "rgba(16, 162, 148, 0.1)"
                                : "white",
                            color: isSelected ? "white" : "black",
                            "&:active": {
                              backgroundColor: "#10A294",
                              color: "white",
                            },
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 100,
                            width: "100%",
                            marginTop: "0",
                          }),
                          menuList: (base) => ({
                            ...base,
                            maxHeight: "192px",
                            overflowY: "auto",
                          }),
                        }}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2 rounded-lg"
                  >
                    Search Pharmacies
                  </button>
                </form>
              </div>
              <div className="flex justify-center">
                <LazyLoadImage
                  src={home}
                  alt="Pharmacy Illustration"
                  className="w-full h-[400px] rounded-lg object-cover"
                />
              </div>
            </div>
          </div>



        </section>
        {/* How Dwayee Works */}
        <section className="text-center py-20 px-5">
          <div className="mx-auto max-w-7xl">
            <h2 className="textstyle mb-3 maincolor">How Dwayee Works</h2>
            <p className="text-gray-600 mb-12">
              Get your medications delivered in three simple steps
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                  <Search className="h-8 w-8 maincolor" />
                </div>
                <h3 className="text-xl font-bold">Search</h3>
                <p className="text-gray-700">
                  Find medications by name, category, or symptoms. Compare prices across pharmacies.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                  <ShoppingBag className="h-8 w-8 maincolor" />
                </div>
                <h3 className="text-xl font-bold">Order</h3>
                <p className="text-gray-500">
                  Select your medications and place your order from your preferred pharmacy.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                  <Clock className="h-8 w-8 maincolor" />
                </div>
                <h3 className="text-xl font-bold">Receive</h3>
                <p className="text-gray-500">
                  Get your medications delivered to your doorstep or pick them up at your convenience.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Featured Pharmacies */}
        <section className="bg-gray-100 py-20 px-5">
          <div className="mx-auto max-w-7xl">
            <h2 className="textstyle text-center mb-4 maincolor">
              Featured Pharmacies
            </h2>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-center">
              Trusted pharmacies in your area
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-3">
              {pharmacies?.slice(0, 3).map((pham) => (
                <div
                  key={pham.id}
                  className="bg-white rounded-lg overflow-hidden"
                >
                  <div className="w-full h-[400px] overflow-hidden">
                    <LazyLoadImage
                      src={pham.image}
                      alt={pham.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = placeholder;
                      }}
                    />
                  </div>
                  <div className="p-5 space-y-3 text-start">
                    <h3 className="text-xl font-bold">{pham.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{`${pham.city?.name}, ${pham.governorate?.name}`}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Opens from {`${pham.opening_time?.slice(0, 5)} to ${pham.closing_time?.slice(0, 5)}`} </span>
                    </div>
                    <button
                      className="border border-[#0d9488] text-[#0f766e] mt-4 px-4 py-2 w-full rounded-lg hover:bg-[#10a894]/10 hover:text-black transition"
                      onClick={() => {
                        console.log("Navigating to:", `/pharmacydetails/${pham.id}`);
                        navigate(`/pharmacydetails/${pham.id}`, { state: { pharmacy: pham } });
                      }}
                    >
                      View Pharmacy
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link to="/pharmacies">
                <button className="px-4 py-2 border border-[#0d9488] text-[#0f766e] rounded hover:bg-[#10a894]/10 hover:text-black flex items-center">
                  View All Pharmacies
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>
        {/* Download App*/}
        <section className="bg-teal-50 py-20 px-5">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-10 items-center text-start">
              <div>
                <h2 className=" mb-4 maincolor textstyle">Download the Dwayee App</h2>
                <p className="mb-4">
                  Get the Dwayee app for a better experience. Available on iOS and Android.
                </p>
                <div className="flex gap-4">
                  <button className="bg-black text-white px-4 py-2 rounded">App Store</button>
                  <button className="bg-black
text-white px-4 py-2 rounded">Google Play</button>
                </div>
              </div>
              <div className="flex justify-center">
                <LazyLoadImage
                  src={randomPharmacyImage}
                  alt="Pharmacy Illustration"
                  className="w-full h-[400px] rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        {/* Call to Action */}
        <section className="py-20 px-5 text-start">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 items-center gap-10">
              <div className="flex justify-center">
                <LazyLoadImage
                  src={randomPharmacyImage}
                  alt="Pharmacy Illustration"
                  className="w-full h-[400px] rounded-lg object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl maincolor mb-2">Are You a Pharmacy Owner?</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-2">
                  Join Dwayee as a pharmacy partner and expand your business reach. Connect with more customers and increase your sales.
                </p>
                <Link to="/join">
                  <button className="px-5 py-2 bg-teal-800 text-white rounded hover:bg-teal-900">

                    Join as Pharmacy Partner
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="w-full border-t text-start text-white py-10 px-5">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-4 gap-6 text-sm space-y-4">
              <div className='space-y-4'>
                <NavLink to="/" className="flex items-center gap-2">
                  <Pill className="h-6 w-6 maincolor" />
                  <span className="text-xl font-bold text-black">Dwayee-دوائي</span>
                </NavLink>
                <p className='text-gray-500'>Trusted platform for finding and ordering medications.</p>
              </div>
              <div>
                <h4 className="text-black text-lg font-medium">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <NavLink to="/" className="text-gray-500 hover:maincolor">
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/medications" className="text-gray-500 hover:maincolor">
                      Medications
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/pharmacies" className="text-gray-500 hover:maincolor">
                      Pharmacies
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/join" className="text-gray-500 hover:maincolor">
                      Join as Pharmacy
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
                <ul className="space-y-2 text-sm">
                  <li>
                    <NavLink href="#" className="text-gray-500 hover:maincolor">
                      Terms of Service
                    </NavLink>
                  </li>
                  <li>
                    <NavLink href="#" className="text-gray-500 hover:maincolor">
                      Privacy Policy
                    </NavLink>
                  </li>
                  <li>
                    <NavLink href="#" className="text-gray-500 hover:maincolor">
                      Cookie Policy
                    </NavLink>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium text-black">Contact</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center text-gray-500">
                    <Phone className="mr-2 h-4 w-4 maincolor" />
                    <span>+20 123 456 7890</span>
                  </li>
                  <li className="flex items-center text-gray-500">
                    <MapPin className="mr-2 h-4 w-4 maincolor" />
                    <span>Cairo, Egypt</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-center mt-8 text-xs text-gray-500">
              © 2025 Dwayee. All rights reserved.
            </div>
          </div>
        </footer>
      </div>

    </>

  )
}
