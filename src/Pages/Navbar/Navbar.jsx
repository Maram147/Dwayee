import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Pill, ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '../../Context/CartContext';
import { UserContext } from '../../Context/UserContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { cartItems, setCartItems } = useCart();

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [isOpen, setIsOpen] = useState(false);

  const { userLogin, setUserLogin, setUserType } = useContext(UserContext);
  const [userTypeValue, setUserTypeValue] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const type = localStorage.getItem('userType');
    // setUserTypeValue(type);
    setUserTypeValue(type || (userLogin?.user?.user_type));
  }, [userLogin]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('button') && !event.target.closest('div.flex-col')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  function handleLogout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');

    setUserLogin(null);
    setUserType(null);
    setCartItems([]);
    // deletecart();
    navigate('/signin');
    toast.error('User Sign Out')

  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Pill className="h-6 w-6 text-teal-600" />
          <span className="text-xl font-bold">Dwayee-دوائي</span>
        </Link>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
        <nav className="hidden md:flex md:flex-row gap-8 items-center">
          <Link to="/" className="text-sm font-medium hover:text-teal-600">Home</Link>
          <Link to="/medications" className="text-sm font-medium hover:text-teal-600">Medications</Link>
          <Link to="/pharmacies" className="text-sm font-medium hover:text-teal-600">Pharmacies</Link>
          <Link to="/about" className="text-sm font-medium hover:text-teal-600">About</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-teal-600">Contact</Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <NavLink to="/cart" className="relative" aria-label="View your cart">
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs font-bold px-1 py-0.5 rounded-full">
                {totalQuantity}
              </span>
            )}
          </NavLink>

          {userLogin ? (
            <>
              {userTypeValue === 'user' && (
                <Link to="/userdashboard">
                  <button className="text-sm bg-teal-600 text-white px-4 py-1.5 rounded-md hover:bg-teal-700">
                    User Dashboard
                  </button>
                </Link>
              )}
              {userTypeValue === 'pharmacy' && (
                <Link to="/pharmacydashboard">
                  <button className="text-sm bg-teal-600 text-white px-4 py-1.5 rounded-md hover:bg-teal-700">
                    Pharmacy Dashboard
                  </button>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="border border-teal-600 text-teal-700 px-4 py-1.5 rounded-md text-sm hover:bg-teal-50 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin">
                <button className="border border-teal-600 text-teal-700 px-4 py-1.5 rounded-md text-sm hover:bg-teal-50 transition">
                  Sign In
                </button>
              </Link>
              <Link to="/join">
                <button className="bg-teal-700 text-white px-4 py-1.5 rounded-md text-sm hover:bg-teal-800 transition">
                  Join as Pharmacy
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile View */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col items-start gap-5 bg-white shadow-md rounded-b-md">
          <NavLink to="/" className="text-sm font-medium text-gray-700 hover:text-teal-600">
            Home
          </NavLink>
          <NavLink to="/medications" className="text-sm font-medium text-gray-700 hover:text-teal-600">
            Medications
          </NavLink>
          <NavLink to="/pharmacies" className="text-sm font-medium text-gray-700 hover:text-teal-600">
            Pharmacies
          </NavLink>
          <NavLink to="/about" className="text-sm font-medium text-gray-700 hover:text-teal-600">
            About
          </NavLink>
          <NavLink to="/contact" className="text-sm font-medium text-gray-700 hover:text-teal-600">
            Contact
          </NavLink>
          <NavLink to="/cart" className="relative" aria-label="View your cart">
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs font-bold px-1 py-0.5 rounded-full">
                {totalQuantity}
              </span>
            )}
          </NavLink>

          {userLogin ? (
            <>
              {userTypeValue === 'user' && (
                <Link to="/userdashboard" className="w-full">
                  <button className="w-full bg-teal-600 text-white py-1.5 rounded-md text-sm hover:bg-teal-700 transition">User Dashboard</button>
                </Link>
              )}
              {userTypeValue === 'pharmacy' && (
                <Link to="/pharmacydashboard" className="w-full">
                  <button className="w-full bg-teal-600 text-white py-1.5 rounded-md text-sm hover:bg-teal-700 transition">Pharmacy Dashboard</button>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full border border-teal-600 text-teal-700 py-1.5 rounded-md text-sm hover:bg-teal-50 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="w-full">
                <button className="w-full border border-teal-600 text-teal-700 py-1.5 rounded-md text-sm hover:bg-teal-50 transition">
                  Sign In
                </button>
              </Link>
              <Link to="/join" className="w-full">
                <button className="w-full bg-teal-700 text-white py-1.5 rounded-md text-sm hover:bg-teal-800 transition">
                  Join as Pharmacy
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}