import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import placeholder from "@/assets/images/placeholder.svg";
import { startTransition } from "react";

import {
  MapPin,
  Phone,
  Clock,
  Calendar,
  Truck,
  ChevronRight,
} from "lucide-react";
import debounce from "lodash/debounce";
import {
  Thermometer,
  Pill,
  Droplet,
  Syringe,
  Stethoscope,
  Tablets,
} from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function PharmacyDetails() {
  const location = useLocation();
  const { id: rawId } = useParams();
  console.log("Raw ID from useParams:", rawId);
  const id = !isNaN(Number(rawId)) ? Number(rawId) : null;

  const [pharmacy, setPharmacy] = useState(location.state?.pharmacy || null);
  const [medications, setMedications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("About");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const debouncedSearchChange = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleSearchInputChange = (e) => {
    debouncedSearchChange(e.target.value);
  };

  const getPharmacyDetails = async () => {
    try {
      console.log("Fetching pharmacy from:", `${apiUrl}/pharmacies/${id}`);
      const { data } = await axios.get(`${apiUrl}/pharmacies/${id}`, {
        headers: { 'Accept': 'application/json' },
      });
      console.log("Pharmacy data:", data);
      setPharmacy(data.data);
    } catch (err) {
      console.error("Error loading pharmacy details", err.response?.status, err.response?.data || err.message);
      setError("Failed to fetch pharmacy details");
      throw err;
    }
  };

  const getAllMedications = async (page = 1, query = "", category = "") => {
    try {
      console.log("Sending request with pharmacy_id:", id, "Type:", typeof id);
      console.log("Fetching medications from:", `${apiUrl}/medications`, {
        params: {
          paginate: 12,
          page,
          q: query || undefined,
          category_id: category || undefined,
          pharmacy_id: id,
        },
      });
      const { data } = await axios.get(`${apiUrl}/medications`, {
        params: {
          paginate: 12,
          page,
          q: query || undefined,
          category_id: category || undefined,
          pharmacy_id: id,
        },
      });
      console.log("Medications data:", data);
      setMedications(data.data.data);
      setCurrentPage(data.data.current_page);
      setLastPage(data.data.last_page);
      setPaginationLinks(data.data.links);
    } catch (err) {
      console.error("Error loading medications", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch medications");
      throw err;
    }
  };

  const getCategories = async () => {
    try {
      console.log("Fetching categories from:", `${apiUrl}/medications/categories`);
      const { data } = await axios.get(`${apiUrl}/medications/categories`);
      console.log("Categories data:", data);
      setCategories(data.data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("Failed to load categories");
      throw err;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      if (!id) {
        setError("Pharmacy ID is missing. Please check the URL.");
        setLoading(false);
        return;
      }
      try {
        if (!pharmacy) {
          await getPharmacyDetails();
        }
        await Promise.all([
          getCategories(),
          getAllMedications(currentPage, searchQuery, selectedCategory),
        ]);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, pharmacy, currentPage, searchQuery, selectedCategory]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return (
    <div className="p-6 text-red-500">
      {error}
      <br />
      <Link to="/pharmacies" className="text-teal-600 hover:underline mt-2 inline-block">
        Go back to Pharmacies
      </Link>
    </div>
  );
  if (!pharmacy) return <div className="p-6">No pharmacy found</div>;



  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? "" : categoryId);
    setCurrentPage(1);
  };

  const categoryIcons = {
    "Pain Relief": Thermometer,
    Antibiotic: Pill,
    Vitamins: Pill,
    Allergy: Droplet,
    Diabetes: Syringe,
    Heart: Stethoscope,
    "Skin Care": Tablets,
  };

  const totalMedicationsCount = typeof pharmacy?.total_medications === 'string'
    ? parseInt(pharmacy.total_medications.match(/\d+/)?.[0] || '0')
    : 0;

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!pharmacy) return <div className="p-6">No pharmacy found</div>;

  const { name, image, address, phone, opening_time, closing_time, working_days, is_delivery_available, city, governorate } = pharmacy;

  return (
    <section className="overflow-hidden pb-10">
      <div className="container px-4 py-4 md:px-6">
        <div className="flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-teal-600">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to="/pharmacies" className="hover:text-teal-600">Pharmacies</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-gray-700">{name}</span>
        </div>
      </div>

      <div className="relative h-80 overflow-hidden mb-6">
        <LazyLoadImage
          src={image || placeholder}
          alt={name || "Pharmacy Image"}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = placeholder; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-10 left-4 sm:left-10 lg:left-20 text-white">
          <h3 className="text-2xl font-bold">{name}</h3>
          <div className="flex items-center mt-2">
            <MapPin className="w-5 h-5 mr-1" />
            <p className="text-sm">{address}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-10 lg:px-20">
        <div className="flex-1 lg:max-w-sm space-y-4">
          <div className="p-4 border border-[#e5e5e5] rounded-lg text-start">
            <h2 className="font-bold mb-3">Contact Information</h2>
            <div className="space-y-4 text-sm text-gray-500">
              <div className="flex gap-2 items-start">
                <Phone className="w-5 h-5 text-teal-600 mt-1" />
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <p className="text-gray-700 font-semibold">{phone}</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <MapPin className="w-5 h-5 text-teal-600 mt-1" />
                <div>
                  <h4 className="font-medium">Location</h4>
                  <p className="text-gray-700 font-semibold">{city?.name}, {governorate?.name}</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <Clock className="w-5 h-5 text-teal-600 mt-1" />
                <div>
                  <h4 className="font-medium">Opening Hours</h4>
                  <p className="text-gray-700 font-semibold">{opening_time?.slice(0, 5)}</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <Clock className="w-5 h-5 text-teal-600 mt-1" />
                <div>
                  <h4 className="font-medium">Closing Hours</h4>
                  <p className="text-gray-700 font-semibold">{closing_time?.slice(0, 5)}</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <Calendar className="w-5 h-5 text-teal-600 mt-1" />
                <div>
                  <h4 className="font-medium">Working Days</h4>
                  {Array.isArray(working_days) ? (
                    <div className="flex flex-wrap gap-1">
                      {working_days.map((day, idx) => (
                        <span key={idx} className="text-gray-700 font-semibold">
                          {day}{idx < working_days.length - 1 && <span className="mx-1">-</span>}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700 font-semibold">Not available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {is_delivery_available && (
            <div className="flex items-center gap-2 p-4 border border-[#e5e5e5] rounded-lg bg-teal-50">
              <Truck className="w-6 h-6 text-teal-600" />
              <h4 className="font-semibold">Delivery Available</h4>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap border-b border-gray-300 mb-4 bg-gray-100">
            {["About", `Medications (${totalMedicationsCount})`].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab === activeTab ? tab : tab)}
                className={`px-4 py-2 text-sm font-medium ${activeTab === tab
                  ? "text-gray-500 border-b-2 border-teal-500 bg-white"
                  : "text-gray-500 leading-relaxed"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="text-gray-700 text-lg font-sm leading-relaxed text-start">
            {activeTab === "About" ? (
              `${pharmacy.address}, ${city?.name}, ${governorate?.name}`
            ) : (
              <div>
                <div className="mb-4 flex flex-col lg:flex-row gap-4">
                  <div className="w-full lg:w-1/4">
                    <h3 className="font-bold mb-2">Categories</h3>
                    {categories.map((cat) => {
                      const Icon = categoryIcons[cat.name] || Pill;
                      const count = medications.filter((med) => med.category === cat.name).length;
                      return (
                        <div key={cat.id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`cat-${cat.id}`}
                            value={cat.id}
                            checked={selectedCategory === cat.id.toString()}
                            onChange={() => handleCategoryChange(cat.id.toString())}
                            className="mr-2"
                          />
                          <label htmlFor={`cat-${cat.id}`} className="flex-1">
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 mr-2 text-teal-600" />
                              {cat.name} ({count})
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  <div className="w-full lg:w-3/4">
                    <input
                      type="text"
                      placeholder="Search medications..."
                      defaultValue={searchQuery}
                      onChange={(e) => debouncedSearchChange(e.target.value)}
                      className="w-full p-2 border rounded mb-4"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {loading ? (
                        <p>Loading medications...</p>
                      ) : error ? (
                        <p className="text-red-500">{error}</p>
                      ) : medications.length > 0 ? (
                        medications.map((med) => {
                          const Icon = categoryIcons[med.category] || Pill;
                          return (
                            <div
                              key={med.id}
                              className="p-3 border border-gray-100 rounded-2xl bg-white transition-colors duration-200 cursor-pointer"
                              onClick={() => navigate(`/medicationdetails/${med.id}`)}
                            >
                              <div className="w-full mb-1">
                                <LazyLoadImage
                                  src={med.image || "/placeholder.svg"}
                                  alt={med.name}
                                  className="w-full h-auto object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = placeholder;
                                  }}
                                />
                              </div>
                              <h4 className="text-xl font-semibold text-gray-900 truncate">{med.name}</h4>
                              <p className="text-xs text-gray-500 mb-1.5">Generic: {med.generic_name || 'N/A'}</p>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full">
                                  {med.category}
                                </span>
                                <span className="text-lg font-bold text-gray-900">
                                  {med.price ? `${med.price} EGP` : 'N/A'}
                                </span>
                              </div>
                              <p
                                className={`text-xs font-medium ${med.is_in_stock ? 'text-green-500' : 'text-red-500'
                                  }`}
                              >
                                {med.is_in_stock ? 'In Stock' : 'Out of Stock'}
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <p>No medications available.</p>
                      )}
                    </div>
                    {lastPage > 1 && (
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-teal-500 text-white rounded disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <span>{`Page ${currentPage} of ${lastPage}`}</span>
                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
                          disabled={currentPage === lastPage}
                          className="px-4 py-2 bg-teal-500 text-white rounded disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}