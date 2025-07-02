import React, { useContext, useEffect } from 'react';
import { useCart } from '../../Context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingBag } from "lucide-react";
import { Trash2, Plus, Minus, ChevronRight, CreditCard, Upload, AlertCircle } from "lucide-react";
import placeholder from '@/assets/images/placeholder.svg';
import { UserContext } from '../../Context/UserContext';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function Cart() {
  const { cartItems, updateQuantity, removeItem, deleteCart, fetchCart } = useCart();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const { userLogin } = useContext(UserContext);
  useEffect(() => {
    if (userLogin?.token) {
      fetchCart();
    }
  }, [userLogin?.token]);

  return (
    <main className="flex-1 bg-gray-50 py-8 md:py-12 ">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="container px-4 py-4 md:px-6">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-teal-600">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to="/cart" className="hover:text-teal-600">
              cart
            </Link>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-start font-sans">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any medications to your cart yet.</p>
            <Link to="/medications">
              <button className="bg-teal-600 rounded px-4 py-2 hover:bg-[#0f766e] text-white">Browse Medications</button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-white p-6 rounded-lg border border-[#e5e5e5]">
              {cartItems.map((item, index) => (
                <div key={index} className="border-b border-[#e5e5e5] pb-4 mb-4">
                  <div className="flex items-center justify-between">
                    {console.log(item)}
                    <div className="flex items-center gap-4">
                      <div className="h-24 w-24  relative bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <LazyLoadImage
                          src={item.image || placeholder}
                          alt={item.name}
                          fill
                          className="object-contain p-2 h-full w-full"
                          onError={(e) => {
                            e.currentTarget.src = placeholder;
                          }}
                        />
                      </div>
                      <div className='space-y-2 text-start'>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-500 text-sm">Sold by: {item.pharmacy}</p>
                        <div className="flex items-center gap-1 my-2">
                          <button className="px-2 text-lg" onClick={() => {
                            if (item.quantity > 10) {
                              toast.error("Quantity cannot be less than 1");

                              return;
                            }
                            updateQuantity(item.id, -1);
                          }}>-</button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button onClick={() => {
                            if (item.quantity > 10) {
                              toast.error("You cannot add more than 10 items of this medication");
                              return;
                            }
                            updateQuantity(item.id, 1);
                          }} className="px-2 text-lg">+</button>
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-semibold">{item.price} EGP</div>

                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    variant="ghost"
                    size="sm"
                    className="flex items-center justify-end text-red-600 hover:text-red-700  p-0 h-auto w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </button>
                </div>
              ))}

              <div className="flex justify-between items-center">
                <button onClick={deleteCart} className="px-4 py-2 border  border-[#e5e5e5] rounded text-black hover:bg-gray-200">Clear Cart</button>
                <Link to="/checkout">
                  <button className="px-4 py-2 bg-[#0d9488] text-white rounded hover:bg-[#0f766e] transition">Proceed to Checkout</button>
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg border border-[#e5e5e5] h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
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
              <Link to="/checkout">
                <button className="mt-4 w-full bg-[#0d9488] text-white py-2 rounded hover:bg-[#0f766e] transition">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
