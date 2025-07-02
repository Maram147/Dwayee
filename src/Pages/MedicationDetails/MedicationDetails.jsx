import React, { useContext, useEffect, useState } from "react";
import style from "./MedicationDetails.module.css";
import placeholder from "@/assets/images/placeholder.svg";
import {
  Pill,
  Clock,
  MapPin,
  ShoppingBag,
  CircleAlert,
  Calendar,
  Truck,
  ChevronRight,
} from "lucide-react";
import { useCart } from "../../Context/CartContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../Context/UserContext";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function MedicationDetails() {
  const [cnt, setCnt] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartItems, fetchCart } = useCart();
const [showLoginModal, setShowLoginModal] = useState(false);
 const { userLogin } = useContext(UserContext);

const LoginRequiredModal = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
      <svg class="mx-auto mb-4 text-red-500 w-12 h-12 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
      <h2 className="text-lg font-semibold mb-4">Sign in Required</h2>
      <p className="text-gray-600 mb-6">You must be sign in to add medication to your cart.</p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowLoginModal(false)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setShowLoginModal(false);
            navigate("/signin");
          }}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Sign in
        </button>
      </div>
    </div>
  </div>
);

  const getMedicationDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`${apiUrl}/medications/${id}`);
      setMedication(data.data);
    } catch (err) {
      console.error("Error loading medication details:", err);
      setError(err.response?.data?.message || "Failed to fetch medication details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMedicationDetails();
  }, [id]);

  if (loading) return <div className={style.spinnerContainer}>
      <div className={style.spinner}></div>
      <p className="text-sm sm:text-base text-gray-500">Loading...</p>
    </div>;
  if (error) return <p className="p-10 text-red-500">{error}</p>;
  if (!medication) return <p className="p-10 text-red-500">Medication not found</p>;

 


const addToCart = async (medicationId, quantity) => {
  if (!userLogin?.token) {
     setShowLoginModal(true);
    return;
  }
   const existingItem = cartItems.find(item => item.medication_id === medicationId);
  const currentQty = existingItem ? existingItem.quantity : 0;

  if (currentQty + quantity > 10) {
        toast.error("You cannot add more than 10 items of this medication");

    return;
  }

  try {
    const formData = new FormData();
    formData.append("medication_id", medicationId);
    formData.append("quantity", quantity);

    await axios.post(`${apiUrl}/cart/add`, formData, {
      headers: {
        Authorization: `Bearer ${userLogin.token}`,
        Accept: "application/json",
      },
    });

    toast.success("Medication added successfully");
    fetchCart();
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to add medication to cart"
    );
    console.error(error);
  }
};


  const tabs = [
    {
      label: "Description",
      content: (
        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p>{medication.description || "No description available."}</p>
        </div>
      ),
    },
    {
      label: "Details",
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm text-gray-500 font-semibold">Active Ingredients</h3>
            <p className="font-medium">{medication.details?.active_ingredients || "N/A"}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <h3 className="text-sm text-gray-500 font-semibold">Expiry Date</h3>
              <p className="font-medium">{medication.details?.expiry_date || "N/A"}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 font-semibold">Manufacturer</h3>
            <p className="font-medium">{medication.details?.manufacturer || "N/A"}</p>
          </div>
          <div className="col-span-2">
            <h3 className="text-sm text-gray-500 font-semibold">Storage Instructions</h3>
            <p className="font-medium">
              Store at room temperature away from moisture and heat.
            </p>
          </div>
        </div>
      ),
    },
    {
      label: "Usage & Side Effects",
      content: (
        <div>
          <h2 className="text-lg font-semibold mb-2">Dosage</h2>
          <p className="font-medium">{medication.usage_and_side_effects?.dosage || "N/A"}</p>

          <h2 className="text-lg font-semibold mt-4 mb-2">Side Effects</h2>
          <p className="font-medium">{medication.usage_and_side_effects?.side_effects || "N/A"}</p>
        </div>
      ),
    },
  ];

  return (
    <section className="overflow-hidden px-4 sm:px-10 md:px-16 lg:px-20 pb-20">
      <div className="container px-4 py-4 md:px-6">
        <div className="flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-teal-600">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to="/medications" className="hover:text-teal-600">
            Medications
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-gray-700">{medication.name}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-teal-400 object-cover rounded-sm">
          <LazyLoadImage
            src={medication.image || placeholder}
            className="p-4 sm:p-6 md:p-8"
            alt={medication.name}
            onError={(e) => {
              e.currentTarget.src = placeholder;
            }}
          />
        </div>
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-teal-300 pb-5 gap-2">
            <div>
              <h1 className="text-start text-2xl font-bold">{medication.name}</h1>
              <p className="text-sm text-gray-500 text-start">{medication.generic_name || "N/A"}</p>
              <div className="flex items-center space-x-2 mt-2">
                <p className="text-2xl font-bold text-gray-900">{medication.price} EGP</p>
                <span
                  className={`text-sm font-medium px-3 border rounded-full ${
                    medication.is_in_stock
                      ? "text-green-800 bg-green-100 border-green-300"
                      : "text-red-800 bg-red-100 border-red-300"
                  }`}
                >
                  {medication.is_in_stock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
            <span className="bg-teal-50 text-green-800 text-xs font-medium px-2 border border-gray-300 rounded-full">
              {typeof medication.category === "string" ? medication.category : medication.category?.name || "N/A"}
            </span>
          </div>
          <div className="mt-4 space-y-2 text-sm border-b border-teal-300 pb-5 text-gray-500">
            <p className="flex items-center">
              <Pill className="mr-2 h-4 w-4 maincolor" />
              <span>Sold by: {medication.pharmacy?.name || "N/A"}</span>
            </p>
            <p className="flex items-center">
              <Clock className="mr-2 h-4 w-4 maincolor" />
              <span>Delivery: 1-2 business days</span>
            </p>
            <p className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 maincolor" />
              <span>Available for delivery in Cairo and Alexandria</span>
            </p>
          </div>
         
          <button
           onClick={() => addToCart(medication.id, cnt)}
            className="mt-4 w-full bg-[#0d9488] hover:bg-[#0f766e] text-white py-2 rounded flex items-center justify-center"
            disabled={!medication.is_in_stock}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            <span>Add to Cart</span>
          </button>

        </div>
      </div>
      <div className="mt-6">
        <div className="flex flex-wrap bg-gray-100 border-b border-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab.label
                  ? "text-teal-600 border-b-2 border-teal-500 bg-white"
                  : "text-teal-600 leading-relaxed"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-800 leading-relaxed text-start">
          {tabs.find((t) => t.label === activeTab)?.content}
        </div>
      </div>
      {showLoginModal && <LoginRequiredModal />}

    </section>
    
  );
}