import React, { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Clock,
  AlertTriangle,
  ShoppingBag,
  TrendingUp,
  MoveUpRight,
  MoveDownRight,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../Context/UserContext";
import axios from "axios";
export default function PharmacyDashboard() {
  const { userLogin, loading } = useContext(UserContext);
  if (loading) return <p>Loading...</p>;
  if (!userLogin) return <Navigate to="/signin" />;
  const userData = userLogin.user;
  const apiUrl = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);

  const [orderLoading, setOrderLoading] = useState(true);
  const totalRevenue = Array.isArray(orders)
    ? orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0)
    : 0;
  const totalOrders = orders.length;



  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = userLogin?.token;
        const res = await axios.get(`${apiUrl}/orders`, {
          headers: {
            Authorization: `Bearer ${userLogin.token}`,
          },
        });
        console.log("Order response:", res.data.data.data);
        setOrders(res.data.data.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setOrderLoading(false);
      }
    };

    if (userLogin?.token) {
      fetchOrders();
    }
  }, [userLogin]);




  useEffect(() => {
    const pharmacyStatistics = async () => {
      try {
        const res = await axios.get(`${apiUrl}/pharmacy/statistics`, {
          headers: {
            Authorization: `Bearer ${userLogin.token}`,
          },
        });
        setStatistics(res.data);
      } catch (err) {
        console.error("Failed to fetch pharmacy statistics:", err);
      }
    };

    if (userLogin?.token) {
      pharmacyStatistics();
    }
  }, [userLogin]);

  useEffect(() => {
    if (Array.isArray(orders) && orders.length > 0) {
      const recent = [...orders]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentOrders(recent);
    }
  }, [orders]);


  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await axios.get(`${apiUrl}/medications/low-stock`, {
          params: {
            paginate: 3,
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userLogin.token}`,
          },
        });

        console.log("Low Stock Response:", res.data);
        setLowStockItems(res.data.data.data || []);
      } catch (error) {
        console.error("Failed to fetch low stock items", error);
        setLowStockItems([]);
      }
    };

    if (userLogin?.token) fetchLowStock();
  }, [userLogin]);

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-gray-50 min-h-screen space-y-6">
      <div>
        <h1 className="text-2xl text-left md:text-3xl font-bold">Dashboard</h1>
        <p className="text-left text-gray-600">Welcome back, {userData?.pharmacy.name}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `${totalRevenue.toFixed(2)} EGP`,
            change_rate: "12% ",
            change: "from last month",
            color: "green",
            Icon: DollarSign,
            Arrow: MoveUpRight,
          },
          {
            label: "Total Orders",
            value: `${totalOrders}`,
            change_rate: "8% ",
            change: "from last month",
            color: "blue",
            Icon: ShoppingBag,
            Arrow: MoveUpRight,
          },
          {
            label: "Total Medications",
            value: statistics?.data.total_medications ?? "N/A",
            change_rate: "3%",
            change: "from last month",
            color: "purple",
            Icon: Package,
            Arrow: MoveDownRight,
          },
          {
            label: "Customers",
            value: statistics?.data.total_customers ?? "N/A",
            change_rate: "15%",
            change: "from last month",
            color: "orange",
            Icon: Users,
            Arrow: MoveUpRight,
          },
        ].map(({ label, value, Arrow, change_rate, change, color, Icon }) => (
          <div key={label} className="bg-white w-full p-4 rounded-lg shadow">
            <div className=" w-full">
              <div>
                <p className=" text-left text-gray-500">{label}</p>
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-lg text-left font-semibold">{value}</h2>
                  <div className={`rounded-full bg-${color}-100 p-2`}>
                    <Icon className={`text-${color}-500 w-6 h-6`} />
                  </div>
                </div>
                <div
                  className={`text-sm flex items-center gap-1 text-left text-${color}-500`}
                >
                  <Arrow className="size-3" />
                  {change_rate}
                  <span className="text-gray-500"> {change}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders and Low Stock Alert */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="bg-white text-left p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Recent Orders</h3>
          {orderLoading ? (
            <p className="text-sm text-gray-500">Loading orders...</p>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No recent orders found.</p>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                You have {orders.length} orders total
              </p>
              <ul className="space-y-3">
                {recentOrders.map((order) => (
                  <li key={order.id} className="flex justify-between items-center">
                    <div className="items-center flex gap-2">
                      <div className="bg-gray-200 p-2 rounded-full">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-medium text-left text-sm">
                          {order.customer?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.order_code} -{" "}
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${order.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-600"
                          }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm font-medium">
                        {parseFloat(order.total_amount).toFixed(2)} EGP
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="text-right mt-4">
                <Link to="orders" className="text-sm maincolor hover:underline">
                  View all orders →
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-left text-lg mb-1">
            Low Stock Alert
          </h3>
          <p className="text-sm text-left text-gray-600 mb-4">
            products that need to be restocked
          </p>
          <ul className="space-y-3">
            {Array.isArray(lowStockItems) && lowStockItems.map((item) => (
              <li key={item.id || item.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-left text-gray-500">
                      {typeof item.category === "string" ? item.category : item.category?.name || "Unknown Category"}

                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-orange-500 w-4 h-4" />
                    <p className="text-xs font-medium text-orange-500">
                      {item.stock} / {5}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{

                      width: `${5 ? (item.stock / 5) * 100 : 0}%`,
                    }}
                    

                  ></div>
                </div>
              </li>
            ))}
          </ul>

          <div className="text-right mt-4">
            <Link to="inventory" className="text-sm maincolor hover:underline">
              Manage Inventory →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
