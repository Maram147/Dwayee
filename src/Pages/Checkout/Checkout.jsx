import React from 'react'
import style from './Checkout.module.css'
import { Heart, Award, Users, Shield, Pill, Clock, MapPin, ShoppingBag, CreditCard, Phone, Mail, ChevronRight } from "lucide-react"
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../Context/UserContext';
import toast from "react-hot-toast";
import { useCart } from '../../Context/CartContext';

export default function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const { userLogin } = useContext(UserContext);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const apiUrl = import.meta.env.VITE_API_URL;
  const { cartItems, updateQuantity, removeItem, deleteCart, fetchCart,Resetitems } = useCart();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);







  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty, please add items before placing an order.");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please select a shipping address.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("user_address_id", selectedAddressId);
      formData.append("payment_method", paymentMethod);
      formData.append("notes", notes);

      const response = await axios.post(
        `${apiUrl}/orders/checkout`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userLogin.token}`,
          },
        }
      );

      if (response.data.success) {
        await deleteCart();
        toast.success("Order placed successfully");
        navigate('/userdashboard');
        updateQuantity();
        Resetitems();

      } else {
        toast.error("Can not Checkout Empty Cart");
      }
    } catch (error) {
      console.error(error);
      toast.error("Can not Checkout Empty Cart");
    }
  };









  useEffect(() => {
    axios.get(`${apiUrl}/user/addresses`, {
      headers: {
        Authorization: `Bearer ${userLogin.token}`,
      },
    })
      .then((res) => setAddresses(res.data.data))
      .catch((err) => console.error(err));
  }, []);




  return (
    <div className="p-6 max-w-7xl mx-auto font-sans text-start">
      <div className="container px-4 py-4 md:px-6">
        <div className="flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-teal-600">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to="/cart" className="hover:text-teal-600">Cart</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-gray-700">Checkout</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section className="border border-[#e5e5e5] rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <div className="mb-4">
              <label htmlFor="address" className="block mb-2 font-medium text-sm text-gray-700">Choose Address</label>
              <select
                id="address"
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
                className="w-full border border-teal-600 text-teal-700   hover:bg-teal-50 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#10A294]c"
              >
                <option value="">Select an address</option>
                {addresses?.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.name} ,{addr.city?.name}, {addr.governorate?.name}, {addr.address},{addr.postal_code}
                  </option>
                ))}
              </select>


              <button
                onClick={() => navigate('/userdashboard/manageaddresses')}
                className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700  mt-5"
              >
                + Add new address
              </button>
            </div>
          </section>

          <div className="flex items-center space-x-2 mb-3">
            <input
              type="radio"
              id="cash"
              name="payment"
              value="cash_on_delivery"
              checked={paymentMethod === "cash_on_delivery"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="cash" className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-teal-600" />
              Cash on Delivery
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="card"
              name="payment"
              value="credit_card"
              checked={paymentMethod === "credit_card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="card" className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-teal-600" />
              Credit/Debit Card
            </label>
          </div>

        </div>
        <div className="border border-[#e5e5e5] rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="flex justify-between text-l mb-2 ">
            <span className='text-gray-600'>Subtotal ({cartItems.length} items)</span>
            <span>{subtotal} EGP</span>
          </div>
          <div className="flex justify-between text-l mb-2 ">
            <span className='text-gray-600'>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-bold border-t  border-[#e5e5e5] pt-2 mt-2">
            <span>Total</span>
            <span>{subtotal} EGP</span>
          </div>
          {subtotal < 200 && (
            <div className="text-sm text-gray-500 mt-2 text-start">
              Add {200 - subtotal} EGP more to qualify for free shipping
            </div>
          )}
          <textarea
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Order notes (optional)" className="w-full border border-[#e5e5e5] rounded-lg p-2 resize-none h-20 text-sm" />
          <button
            className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 "
            onClick={handleCheckout}

          >
            Place Order
          </button>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Link to="/cart">
          <button to={'cart'} variant="outline" onClick={() => setStep("cart")} className='bg-white text-black border border-[#e5e5e5]  py-3 px-3  rounded-md hover:bg-gray-200'>
            Back to Cart
          </button>
        </Link>
      </div>
    </div>

  )
}
