import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Clock4,
  Search,
  MapPin,
} from "lucide-react";
import style from "./Pharmacies.module.css";
import debounce from "lodash.debounce";
import placeholder from "@/assets/images/placeholder.svg";
import Select from 'react-select';
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Pharmacies() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [pharmacies, setPharmacies] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const getAllPharmacies = async (page = 1, query = "", governorate = "") => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`${apiUrl}/pharmacies`, {
        params: {
          paginate: 15,
          page,
          governorate_id: governorate || undefined,
          q: query || undefined,
        },
      });
      setPharmacies(data.data.data || []);
      setCurrentPage(data.data.current_page || 1);
      setLastPage(data.data.last_page || 1);
      setPaginationLinks(data.data.links || []);
    } catch (err) {
      console.error("Error loading pharmacies", err);
      setError(err.response?.data?.message || "Failed to fetch pharmacies");
    } finally {
      setLoading(false);
    }
  };

  const getGovernorates = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/items/governorates`);
      setGovernorates(data?.data || []);
    } catch (err) {
      console.error("Error loading governorates:", err);
      setError("Failed to load governorates");
    }
  };

  const debouncedSearchChange = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    const initializeData = async () => {
      await getGovernorates();

      const searchParams = new URLSearchParams(location.search);
      const searchQueryParam = searchParams.get('q');
      const governorateIdParam = searchParams.get('governorate_id');

      if (searchQueryParam) setSearchQuery(searchQueryParam);
      if (governorateIdParam) setSelectedGovernorate(governorateIdParam);

      await getAllPharmacies(1, searchQueryParam || "", governorateIdParam || "");
      setIsInitialLoad(false);
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      getAllPharmacies(currentPage, searchQuery, selectedGovernorate);
    }
  }, [searchQuery, selectedGovernorate, currentPage, isInitialLoad]);

  useEffect(() => {
    return () => debouncedSearchChange.cancel();
  }, [debouncedSearchChange]);

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="flex flex-col md:flex-row sm:p-6 md:p-8 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Pharmacies</h1>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 md:mt-0 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search pharmacies..."
              value={searchQuery}
              onChange={(e) => debouncedSearchChange(e.target.value)}
              className="border border-gray-300 rounded-md px-12 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10A294]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <Select
            aria-label="Governorate"
            options={[{ value: "", label: "All Governorates" }, ...governorates.map(gov => ({ value: gov.id, label: gov.name }))]}
            value={selectedGovernorate ? { value: selectedGovernorate, label: governorates.find(g => g.id === selectedGovernorate)?.name || "All Governorates" } : { value: "", label: "All Governorates" }}
            onChange={(option) => setSelectedGovernorate(option ? option.value : "")}
            className="w-full text-gray-700"
            classNamePrefix="react-select"
            menuPlacement="bottom"
            styles={{
              control: (base) => ({
                ...base,
                paddingLeft: "2.5rem",
                borderColor: "#D1D5DB",
                boxShadow: "none",
                '&:hover': { borderColor: "#10A294" },
                borderRadius: "0.5rem",
                height: "42px"
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? "#10A294" : state.isFocused ? "rgba(16, 162, 148, 0.1)" : "white",
                color: state.isSelected ? "white" : "black"
              }),
              menu: (base) => ({ ...base, zIndex: 100 }),
              menuList: (base) => ({ ...base, maxHeight: "192px", overflowY: "auto" })
            }}
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {loading ? (
        <div className={style.spinnerContainer}>
          <div className={style.spinner}></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      ) : pharmacies.length === 0 ? (
        <div className="text-center text-gray-500">No pharmacies found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 text-start">
          {pharmacies.map((pharmacy, index) => (
            <PharmacyCard key={index} data={pharmacy} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-10 ">
        <nav className="flex flex-wrap justify-center items-center gap-2">
          {paginationLinks.map((link, index) => {
            if (link.label.includes("Previous")) {
              return (
                <button key={index} onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} disabled={!link.url} className="w-10 h-10 rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50">
                  <ChevronLeft size={16} />
                </button>
              );
            } else if (link.label.includes("Next")) {
              return (
                <button key={index} onClick={() => currentPage < lastPage && setCurrentPage(currentPage + 1)} disabled={!link.url} className="w-10 h-10 rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50">
                  <ChevronRight size={16} />
                </button>
              );
            } else {
              return (
                <button key={index} onClick={() => setCurrentPage(parseInt(link.label))} className={`w-10 h-10 rounded border ${link.active ? "mainbgcolor text-white border-teal-600" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"}`}>
                  {link.label}
                </button>
              );
            }
          })}
        </nav>
      </div>
    </div>
  );
}

function PharmacyCard({ data }) {
  const navigate = useNavigate();
  const { name, address, city, governorate, opening_time, closing_time, phone, image, is_delivery_available } = data;

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition cursor-pointer" onClick={() => navigate(`/pharmacydetails/${data.id}`, { state: { pharmacy: data } })}>
      {is_delivery_available && (
        <span className="absolute top-2 right-2 mainbgcolor text-white text-xs font-semibold px-3 py-1 rounded-full">
          Delivery Available
        </span>
      )}

      <div className="w-full h-48 overflow-hidden">
        <LazyLoadImage
          src={image || placeholder}
          alt={name || "Pharmacy Image"}
          className="w-full h-full object-cover object-center"
          onError={(e) => (e.currentTarget.src = placeholder)}
        />
      </div>

      <div className="space-y-2 p-4">
        <h3 className="font-bold text-xl line-clamp-1 text-gray-800">{name}</h3>
        <p className="text-sm flex items-center text-gray-600">
          <MapPin className="maincolor w-5 h-5 flex-shrink-0" />
          <span className="ml-1 line-clamp-1">{`${city?.name}, ${governorate?.name}`}</span>
        </p>
        <p className="text-sm flex items-center text-gray-600">
          <Clock4 className="maincolor w-5 h-5 flex-shrink-0" />
          <span className="ml-1">{`${opening_time?.slice(0, 5)} - ${closing_time?.slice(0, 5)}`}</span>
        </p>
        <p className="text-sm flex items-center text-gray-600">
          <Phone className="maincolor w-5 h-5 flex-shrink-0" />
          <span className="ml-1">{phone}</span>
        </p>
      </div>
    </div>
  );
}
