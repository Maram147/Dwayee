import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Pill, ShoppingCart } from 'lucide-react'
import { useCart } from '../../Context/CartContext';

export default function Navbar() {
  const { cartItems } = useCart();

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);



  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        
        {/* Logo & Title */}
        <Link to="/" className="flex items-center gap-2">
          <Pill className="h-6 w-6 text-teal-600" />
          <span className="text-xl font-bold">Dwayee - دوائي</span>
        </Link>

        {/* Navigation Links (hidden on small screens) */}
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="text-sm font-medium hover:text-teal-600">Home</Link>
          <Link to="/medications" className="text-sm font-medium hover:text-teal-600">Medications</Link>
          <Link to="/pharmacies" className="text-sm font-medium hover:text-teal-600">Pharmacies</Link>
          <Link to="/about" className="text-sm font-medium hover:text-teal-600">About</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-teal-600">Contact</Link>
        </nav>

        {/* Buttons Section */}
        <div className="flex items-center gap-4">
          {/* Shopping Cart */}
          <NavLink to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-gray-700"  />
              {totalQuantity > 0 && (
                <span className="absolute -top-4 -right-3 bg-[#0d9488] text-white text-xs font-bold px-2 py-1 rounded-full">
                  {totalQuantity}
                </span>
              )}
            </NavLink>

          {/* Sign In */}
          <Link to="/signin">
  <button className="border border-teal-600 text-teal-700 px-4 py-2 rounded-md hover:bg-teal-50 hover:text-black  whitespace-nowrap">
    Sign In
  </button>
</Link>

<Link to="/join">
  <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 whitespace-nowrap">
    Join as Pharmacy
  </button>
</Link>

        </div>
      </div>
    </header>
  )
}
