import { React, useState, useEffect, useContext } from 'react';
import { Package, Heart, Settings, MapPin, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import placeholder from '@/assets/images/placeholder.svg';
import { UserContext } from '../../../Context/UserContext';
import { Avatar, AvatarFallback } from "../../../components/UI/avatar";

const links = [
  { label: 'Account Settings', to: '/userdashboard/accountsettings', icon: <Settings className="w-4 h-4 mr-2 text-teal-600 mx-4" /> },
  { label: 'Manage Addresses', to: '/userdashboard/manageaddresses', icon: <MapPin className="w-4 h-4 mr-2 text-teal-600 mx-4" /> },
  { label: 'Payment Methods', to: '/userdashboard/paymentmethods', icon: <CreditCard className="w-4 h-4 mr-2 text-teal-600 mx-4" /> },
];

const SavedMedications = [
  {
    name: 'Panadol Extra',
    lastOrdered: 'Apr 28, 2023',
    image: placeholder,
  },
  {
    name: 'Vitamin D3',
    lastOrdered: 'Mar 15, 2023',
    image: placeholder,
  },
  {
    name: 'Omega-3 Fish Oil',
    lastOrdered: 'May 2, 2023',
    image: placeholder,
  },
];

const statusStyle = {
  Delivered: 'border border-gray-300',
  Processing: 'bg-gray-100 text-gray-800',
  Shipped: 'bg-black text-white',
  pending: 'border border-gray-300',
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const { userLogin, loading } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Update URL when page changes
  useEffect(() => {
    if (activeTab === 'orders') {
      setSearchParams({ tab: 'orders', page: currentPage });
    } else if (activeTab === 'overview') {
      setSearchParams({}); // Clear all parameters when switching to overview
    }
  }, [currentPage, activeTab, setSearchParams]);

  // Update current page when URL changes
  useEffect(() => {
    const page = parseInt(searchParams.get('page'));
    if (page && page !== currentPage) {
      setCurrentPage(page);
    }
  }, [searchParams]);

  // Handle tab changes from URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
      // If returning from order details, restore the page
      const returnPage = parseInt(searchParams.get("returnPage"));
      if (returnPage) {
        setCurrentPage(returnPage);
      }
    } else {
      // If no tab parameter, default to overview
      setActiveTab('overview');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoadingOrders(true);
        const url = `${apiUrl}/orders/?page=${currentPage}&paginate=5&sort=desc`;
        const token = userLogin?.token;
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const json = await res.json();
        if (json.success) {
          const arr = json.data.data.map(order => ({
            id: order.id,
            code: order.order_code,
            status: order.status,
            date: new Date(order.created_at).toDateString(),
            pharmacy: order.pharmacy?.name,
            items: `${order.total_items} items`,
            amount: `EGP ${order.total_amount}`,
            tracking: '',
          }));
          setOrders(arr);
          setTotalPages(Math.ceil(json.data.total / 5));
          setTotalOrders(json.data.total);
        } else {
          setOrders([]);
          setTotalPages(1);
          setTotalOrders(0);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        setTotalPages(1);
        setTotalOrders(0);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    if (userLogin?.token) fetchOrders();
  }, [apiUrl, userLogin, currentPage]);

  if (loading) return <p>Loading...</p>;
  if (!userLogin) return <Navigate to="/signin" />;

  const userData = userLogin.user;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch(`${apiUrl}/user/addresses`, {
          headers: {
            Authorization: `Bearer ${userLogin?.token}`,
            "Content-Type": "application/json",
          },
        });
        const json = await res.json();
        console.log("El API E4a5al, al3aaaaab .... fetchAddresses", json);
        if (json.success) {
          setAddresses(json.data);
        }
      } catch (err) {
        console.error("El API Mesh Rayd,boooooooh .... fetchAddresses", error);
      }
    };

    if (userLogin?.token) {
      fetchAddresses();
    }
  }, [userLogin, apiUrl]);

  const handleViewDetails = (orderId) => {
    // Store current page in sessionStorage before navigating
    sessionStorage.setItem('returnPage', currentPage.toString());
    navigate(`/userdashboard/orderdetails/${orderId}`);
  };

  // Check for return page when component mounts
  useEffect(() => {
    const returnPage = sessionStorage.getItem('returnPage');
    if (returnPage && activeTab === 'orders') {
      setCurrentPage(parseInt(returnPage));
      sessionStorage.removeItem('returnPage'); // Clean up after using
    }
  }, [activeTab]);

  return (
    <>
      <div className=" w-full px-4 md:px-8 lg:px-16 py-8 bg-gray-50">
        <div className='text-start '>
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 mb-6">Welcome back, {userData?.first_name || 'User'}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="text-start mb-6 p-1.5 bg-gray-100 rounded-sm w-max">
              <button
                className={`px-4 py-2 rounded-sm font-semibold ${activeTab === 'overview' ? 'bg-white text-black' : 'text-gray-500'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-4 py-2 rounded-sm font-semibold ${activeTab === 'orders' ? 'bg-white' : 'text-gray-500'}`}
                onClick={() => setActiveTab('orders')}
              >
                Orders
              </button>
              {/* <button
                className={`px-4 py-2 rounded-sm font-semibold ${activeTab === 'SavedMedications' ? 'bg-white' : 'text-gray-500'}`}
                onClick={() => setActiveTab('SavedMedications')}
              >
                Saved Medications
              </button> */}
            </div>
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-4 rounded shadow text-start">
                    <p className="text-gray-600 font-semibold">Total Orders</p>
                    <div className="flex items-center mt-2 gap-2">
                      <Package className="w-5 h-5 text-teal-500" />
                      <h2 className="text-xl font-bold">{totalOrders}</h2>
                    </div>
                  </div>
                  {/* <div className="bg-white p-4 rounded shadow text-start">
                    <p className="text-gray-600 font-semibold">Saved Medications</p>
                    <div className="flex items-center mt-2 gap-2">
                      <Heart className="w-5 h-5 text-teal-500" />
                      <h2 className="text-xl font-bold">3</h2>
                    </div>
                  </div> */}
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <div className="text-start mb-5">
                    <h3 className="font-bold text-xl">Recent Orders</h3>
                    <p className="text-gray-500">Your most recent medication orders</p>
                  </div>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="border-b border-gray-300 pb-2">
                        <div className="flex justify-between mb-2">
                          <div className="text-start">
                            <p className="font-semibold">
                              {order.code}
                              <span className={`text-xs font-semibold ml-2 px-2 py-0.5 rounded-full ${statusStyle[order.status]}`}>
                                {order.status}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500 font-semibold">{order.date}</p>
                            <p className="text-sm text-gray-700 font-semibold">
                              {order.pharmacy} <span className="font-bold text-lg">•</span> {order.items}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{order.amount}</p>
                            <a href="#"
                              onClick={() => handleViewDetails(order.id)}
                              className="text-teal-600 text-sm font-semibold ">
                              View Details
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-start mt-4 mb-4">
                    <button onClick={() => setActiveTab('orders')} className="text-sm font-medium border border-gray-300 rounded-sm px-3 py-1 hover:bg-gray-200">
                      View All Orders
                    </button>
                  </div>
                </div>
              </>
            )}
            {activeTab === 'orders' && (
              <>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-1 text-start">Order History</h2>
                  <p className="text-gray-500 mb-6 text-start">View and track all your medication orders</p>
                  {isLoadingOrders ? (
                    <div className="text-center py-4">Loading orders...</div>
                  ) : (
                    <>
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div key={order.id} className="border-b border-gray-300 pb-4">
                            <div className="flex justify-between items-start">
                              <div className="text-start space-y-1">
                                <p className="font-semibold text-md">
                                  {order.code}
                                  <span className={`text-xs font-semibold ml-2 px-2 py-0.5 rounded-full ${statusStyle[order.status]}`}>
                                    {order.status}
                                  </span>
                                </p>
                                <p className="text-sm text-gray-500 font-semibold">{order.date}</p>
                                <p className="text-sm font-medium text-gray-800">
                                  {order.pharmacy} <span className="font-bold text-lg">•</span> {order.items}
                                </p>
                                {order.tracking && (
                                  <p className="text-sm text-gray-500 font-semibold">Tracking: {order.tracking}</p>
                                )}
                              </div>
                              <div className="text-end">
                                <p className="font-semibold mb-2">{order.amount}</p>
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleViewDetails(order.id)}
                                    className="border border-gray-300 text-sm font-medium px-3 py-1 rounded hover:bg-gray-100"
                                  >
                                    View Details
                                  </button>
                                  {order.status === 'Delivered' && (
                                    <button className="border border-gray-300 text-sm font-medium px-3 py-1 rounded hover:bg-gray-100">
                                      Reorder
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-6">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`flex items-center gap-1 px-3 py-1 rounded border ${
                              currentPage === 1 
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          
                          {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            // Show first page, last page, current page, and pages around current page
                            if (
                              pageNumber === 1 ||
                              pageNumber === totalPages ||
                              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => setCurrentPage(pageNumber)}
                                  className={`px-3 py-1 rounded border ${
                                    currentPage === pageNumber
                                      ? 'bg-teal-600 text-white border-teal-600'
                                      : 'border-gray-300 hover:bg-gray-100'
                                  }`}
                                >
                                  {pageNumber}
                                </button>
                              );
                            } else if (
                              pageNumber === currentPage - 2 ||
                              pageNumber === currentPage + 2
                            ) {
                              return <span key={pageNumber} className="px-1">...</span>;
                            }
                            return null;
                          })}

                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`flex items-center gap-1 px-3 py-1 rounded border ${
                              currentPage === totalPages 
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-white p-4 rounded shadow text-center border border-gray-100">
              <h4 className="font-bold mb-2 text-start text-xl">Profile</h4>
              <div className='w-16 h-16 mx-auto flex items-center justify-content-center'>
                <Avatar className="h-16 w-16 bg-gray-200">
                  <AvatarFallback>
                    {(() => {
                      const fullName = `${userData?.first_name ?? ''} ${userData?.last_name ?? ''}`.trim();
                      if (!fullName) return 'User Name';
                      return fullName
                        .split(/\s+/)
                        .map(namePart => namePart[0])
                        .join('');
                    })()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h4 className="font-bold">{`${userData?.first_name ?? ''} ${userData?.last_name ?? ''}`.trim() || 'User Name'}
              </h4>
              <p className="text-sm text-gray-500 font-semibold">{userData?.email || 'email@example.com'}</p>
              <div className=' mt-4  mb-2'>
                <Link to="accountsettings">
                  <button className="mt-2 text-sm font-medium border border-gray-300 rounded-sm px-3 py-1 hover:bg-gray-200">Edit profile</button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded shadow border border-gray-100 text-start">
              <h4 className="font-bold mb-2 text-xl p-4">Quick Links</h4>
              {links.map(({ label, icon, to }) => (
                <Link to={to} key={label}>
                  <div className="flex items-center text-sm font-medium cursor-pointer border-b border-gray-200 py-4 hover:bg-gray-50">
                    {icon}
                    <span className=" hover:decoration-teal-300">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="bg-white rounded shadow border border-gray-100 text-start">
              <h4 className="font-bold text-xl p-4">Delivery Addresses</h4>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="px-4 py-3 border-b border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      {addr.name}
                    </p>
                    {addr.is_default && (
                      <span className="text-xs border border-gray-300 font-semibold px-2 py-0.5 rounded-lg">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{addr.city.id} {addr.city.name}, {addr.governorate
                    .name} Egypt</p>
                  <p className="text-sm text-gray-500 "> <span className='font-semibold text-black'>Postal Code: </span>{addr.postal_code}</p>
                  <p className="text-sm text-gray-500"><span className='font-semibold text-black'>Phone: </span>{addr.phone}</p>
                  <div className="flex space-x-4 mt-1">
                    <Link to="manageaddresses">
                      <button className="text-sm text-teal-600 cursor-pointer">
                        Edit
                      </button>
                    </Link>
                    {!addr.is_default && (
                      <span className="text-sm text-teal-600 cursor-pointer">
                        Set as Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div className="px-4 py-4">
                <Link to="manageaddresses">
                  <button className="w-full border border-gray-300 hover:bg-gray-200 text-sm font-semibold py-2 rounded">
                    Add New Address
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div >
      <div className="flex bg-white text-xs text-gray-500 p-5 items-center px-15 border-t border-gray-300">
        <div className="w-full flex justify-between items-center">
          <p>© 2025 Dwayeey. All rights reserved.</p>
          <div className="flex space-x-4">
            <a className=" cursor-pointer">Terms</a>
            <a className=" cursor-pointer">Privacy</a>
            <a className=" cursor-pointer">Contact</a>
          </div>
        </div>
      </div>
    </>
  )
}
