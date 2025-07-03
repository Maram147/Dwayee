import { React, useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useSearchParams, useParams } from "react-router-dom";
import placeholder from '@/assets/images/placeholder.svg';
import { MapPin, CreditCard, Calendar } from 'lucide-react'
import { UserContext } from '../../../Context/UserContext';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const orderItems = [
  { name: "Panadol Extra", quantity: 2, price: 35 },
  { name: "Vitamin D3", quantity: 1, price: 40 },
];

const statusStyle = {
  Delivered: 'border border-gray-300',
  Processing: 'bg-gray-100 text-gray-800',
  Shipped: 'bg-black text-white',
};

export default function OrderDetails() {
  const navigate = useNavigate();
  const { userLogin, loading } = useContext(UserContext);
  const [orderDetails, setOrderDetails] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const { orderId } = useParams();
  useEffect(() => {
    if (!userLogin?.token || !orderId) return;
    const fetchOrder = async () => {
      try {
        const url = `${apiUrl}/orders/${orderId}`;
        const token = userLogin?.token;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const json = await res.json();
        console.log("El API E4a5al, al3aaaaab", json);
        if (json.success) {
          setOrderDetails(json.data);
        } else {
          setOrderDetails(null);
        }
      } catch (error) {
        console.error("El API Mesh Rayd,boooooooh", error);
        setOrderDetails(null);
      }
    };
    if (userLogin?.token) fetchOrder();
  }, [apiUrl, userLogin, orderId]);

  if (loading) return <p>Loading...</p>;
  if (!userLogin) return <Navigate to="/signin" />;
  if (!orderDetails) return <p>Loading order details...</p>;
  const userData = userLogin.user;
  return (

    <div className="min-h-screen bg-gray-50 p-6">
      <div
        className="mb-4 text-lg font-semibold text-start cursor-pointer hover:underline"
        onClick={() => navigate("/userdashboard?tab=orders")}
      >
        &lt; Back to Orders
      </div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-start mb-1">Order Details</h1>
          <p className="text-sm text-gray-500 text-start">{orderDetails.order_code}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusStyle[orderDetails.status]}`}>
          {orderDetails.status}
        </span>
      </div>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold text-start">Order Items</h2>
          <p className="text-sm mb-4 text-start text-gray-500">
            Ordered from <span className='font-semibold'>{orderDetails.pharmacy?.name}</span>
          </p>
          <div className="space-y-4 flex-grow">
            {orderDetails.items.map((item, index) => (
              <OrderItem
                key={item.id}
                name={item.medication.name}
                imgUrl={item.medication.image}
                quantity={item.quantity}
                price={item.price}
                total={item.total_price}
              />
            ))}
          </div>
        </div>
        <div className="md:w-1/3 flex flex-col gap-6">
          <OrderSummary
            subTotal={orderDetails.total_amount}
          />
          <ShippingInfo
            phoneNumber={orderDetails.phone_number}
            payCard={orderDetails.payment_method.replace(/_/g, " ")}
            orderDate={new Date(orderDetails.created_at).toLocaleDateString()}
            orderTime={new Date(orderDetails.created_at).toLocaleTimeString()}
            location={orderDetails.delivery_address}
          />
          <Support />
        </div>
      </div>
    </div>
  );
}
const OrderItem = ({ name, imgUrl, quantity, price, total }) => (
  <div className="flex items-center justify-between border-b border-gray-300 py-3">
    <div className="flex gap-4">
      <LazyLoadImage
        src={imgUrl}
        alt="name"
        className="h-12 w-12 object-cover rounded"
        onError={(e) => {
          e.currentTarget.src = placeholder;
        }}
      />
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500 text-start">Quantity: {quantity}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-medium">EGP {price}</p>
      <p className="text-sm text-gray-500">EGP {total}</p>
    </div>
  </div>
);
const OrderSummary = ({ subTotal }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold mb-4 text-start">Order Summary</h3>
    <div className="space-y-2 text-sm ">
      <div className="flex justify-between">
        <span className="text-gray-500">Subtotal</span>
        <span>{subTotal}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Shipping</span>
        <span>EGP 10.00</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Tax</span>
        <span>EGP 0.75</span>
      </div>
      <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
        <span>Total</span>
        <span>{(parseFloat(subTotal) + 10 + 0.75).toFixed(3)}</span>
      </div>
    </div>
  </div>
);
const ShippingInfo = ({ phoneNumber, payCard, orderDate, orderTime, location }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm text-sm text-gray-700 space-y-6 text-start">
    <h3 className="text-lg font-semibold">Shipping Information</h3>
    <div>
      <h4 className="text-gray-500 font-semibold text-sm pb-1">Delivery Address</h4>
      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-medium">{location
            .split(',')
            .slice(-3)
            .map(part => part.trim())
            .join(', ')}</p>
          <p>{phoneNumber}</p>
        </div>
      </div>
    </div>
    <div>
      <h4 className="text-gray-500 font-semibold text-sm pb-1">Order Date</h4>
      <div className="flex items-start gap-2">
        <Calendar className="w-4 h-4 text-gray-500 mt-1" />
        <div className="flex flex-col">
          <p className="font-medium">{orderDate}</p>
          <p className="font-medium">{orderTime}</p>
        </div>
      </div>
    </div>
    <div>
      <h4 className="text-gray-500 font-semibold text-sm pb-1">Payment Method</h4>
      <div className="flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-gray-500" />
        <p className="font-semibold">{payCard}</p>
      </div>
    </div>
  </div>
);
const Support = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm text-sm text-start">
    <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
    <p className="mb-4">
      If you have any questions about your order, our customer service team is
      here to help.
    </p>
    <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 cursor-pointer">
      Contact Support
    </button>
  </div>
);
