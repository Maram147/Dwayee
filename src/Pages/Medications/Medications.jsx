import React, { useCallback, useEffect, useState } from "react";
import style from "./Medications.module.css";
import {
  ChevronLeft,
  ChevronRight,
  Pill,
  Thermometer,
  Droplet,
  Syringe,
  Stethoscope,
  Tablets,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import placeholder from "@/assets/images/placeholder.svg";
import debounce from "lodash.debounce";
import axios from "axios";

export default function Medications() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const getAllMedications = async (page = 1, query = "", category = "") => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`${apiUrl}/medications`, {
        params: {
          paginate: 12,
          page,
          q: query || undefined,
          category_id: category || undefined,
        },
      });

      setMedications(data.data.data);
      setCurrentPage(data.data.current_page);
      setLastPage(data.data.last_page);
      setPaginationLinks(data.data.links);
    } catch (err) {
      console.error("Error loading medications", err);
      setError(err.response?.data?.message || "Failed to fetch medications");
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/medications/categories`);
      setCategories(data.data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    getCategories(); 
  }, []);

  useEffect(() => {
    return () => {
      debouncedSearchChange.cancel();
    };
  }, []);

  useEffect(() => {
    getAllMedications(currentPage, searchQuery, selectedCategory);
  }, [searchQuery, currentPage, selectedCategory]); 

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

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64">
          <h2 className="text-xl font-semibold mb-4 text-start">Categories</h2>
          {categories.length > 0 ? (
            <ul className="space-y-3">
              {categories.map((category) => {
                const Icon = categoryIcons[category.name] || Pill; 
                return (
                  <li key={category.id} className="flex items-center gap-2">
                    <input
                      id={`category-${category.id}`}
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={selectedCategory === category.id.toString()}
                      onChange={() => handleCategoryChange(category.id.toString())}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-gray-700 text-sm flex items-center gap-1"
                    >
                      <Icon className="w-4 h-4 mx-0.5 maincolor" />
                      {category.name}
                    </label>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500">Loading categories...</p>
          )}
        </aside>

        <main className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold">Medications</h1>
            <input
              type="text"
              placeholder="Search medications..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-2 focus:ring-[#10A294] text-sm"
            />
          </div>

          {loading && <div className={style.spinnerContainer}>
            <div className={style.spinner}></div>
            <p className="text-sm sm:text-base text-gray-500">Loading...</p>
          </div>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medications.length > 0 ? (
              medications.map((med) => (
                <MedicationCard
                  key={med.id}
                  id={med.id}
                  title={med.name}
                  generic={med.generic_name}
                  price={`${med.price} EGP`}
                  stock={med.is_in_stock ? "In Stock" : "Out of Stock"}
                  category={med.category}
                  pharmacy={med.pharmacy?.name}
                  image={med.image || placeholder}
                />
              ))
            ) : (
              null
            )}
          </div>

          <div className="flex justify-center mt-10">
            <nav className="flex flex-wrap justify-center items-center gap-2 sm:gap-1">
              {paginationLinks.map((link, index) => {
                if (link.label.includes("Previous")) {
                  return (
                    <button
                      key={index}
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      disabled={!link.url}
                      className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  );
                } else if (link.label.includes("Next")) {
                  return (
                    <button
                      key={index}
                      onClick={() => currentPage < lastPage && setCurrentPage(currentPage + 1)}
                      disabled={!link.url}
                      className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronRight size={16} />
                    </button>
                  );
                } else if (link.label === "...") {
                  return (
                    <span
                      key={index}
                      className="flex items-center justify-center w-10 h-10 text-gray-500"
                    >
                      ...
                    </span>
                  );
                } else {
                  const page = parseInt(link.label);
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
                        currentPage === page
                          ? "mainbgcolor text-white border-teal-600"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
              })}
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
}

function MedicationCard({ id, title, generic, price, stock, category, pharmacy, image ,quantity
}) {
  const navigate = useNavigate();
  return (
    <div className="rounded-lg bg-white border border-[#e5e5e5] hover:shadow transition overflow-hidden" onClick={() => navigate(`/medicationdetails/${id}`)}>
      <div className="bg-gray-100 flex items-center justify-center rounded mb-4 overflow-hidden p-4">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover cursor-pointer"
          onError={(e) => {
            e.currentTarget.src = placeholder;
          }}
        />
      </div>
      <div className="space-y-1 bg-white p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{title}</h3>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            {category}
          </span>
        </div>
        <p className="text-sm text-left mt-2 text-gray-500">{generic}</p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">{price}</p>
          <p
            className={`text-sm ${stock === "In Stock" ? "text-green-600" : "text-red-500"}`}
          >
            {stock}
          </p>
        </div>
        <p className="text-xs text-left mt-2 text-gray-600">Sold by {pharmacy}</p>
      </div>
    </div>
  );
}