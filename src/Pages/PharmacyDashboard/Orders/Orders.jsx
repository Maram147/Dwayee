import { useContext, useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  ArrowUpDown,
  X,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { Button } from "../../../components/UI/Button";
import { Input } from "../../../components/UI/input";
import { Card, CardContent } from "../../../components/UI/Card";
import placeholder from "@/assets/images/placeholder.svg";
import { Badge } from "../../../components/UI/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/UI/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/UI/DropDownMenu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/UI/dialog";
import { useToast } from "../../../components/UI/use-toast";
import axios from "axios";
import { UserContext } from "../../../Context/UserContext";
import debounce from "lodash.debounce";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function OrdersPage() {
  const { toast } = useToast();
  const [tabPages, setTabPages] = useState({
    all: 1,
    pending: 1,
    processing: 1,
    shipped: 1,
    delivered: 1,
    cancelled: 1,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const { userLogin, loading } = useContext(UserContext);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;

  if (loading) return <p>Loading...</p>;
  if (!userLogin) return <Navigate to="/signin" />;

  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchOrders = async () => {
      setError(null);
      try {
        const response = await axios.get(`${apiUrl}/orders`, {
          headers: {
            Authorization: `Bearer ${userLogin.token}`,
            Accept: "application/json",
          },
          params: {
            paginate: itemsPerPage,
            page: tabPages[statusFilter],
            q: debouncedQuery || undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
            sort:
              sortBy === "total"
                ? `total-${sortOrder}`
                : sortOrder === "asc"
                  ? "created_at-asc"
                  : "created_at-desc",
          },
        });

        if (response.data.data?.data) {
          console.log("Orders data:", response.data.data.data);
          const validOrders = response.data.data.data.map(order => ({
            ...order,
            customer: order.customer || { name: "N/A" }
          }));
          setOrders(validOrders);
          setTotalPages(response.data.data.last_page || 1);
        } else {
          console.log("No data or error:", response.data);
          setOrders([]);
          setTotalPages(1);
        }
      } catch (err) {
        setError("Failed to fetch orders");
        setOrders([]);
      }
    };

    fetchOrders();
  }, [tabPages, statusFilter, debouncedQuery, sortBy, sortOrder, apiUrl, userLogin.token]);

  const filteredOrders = useMemo(() => {
    return orders;
  }, [orders, sortBy, sortOrder]);

  const startIndex = (tabPages[statusFilter] - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    console.log("Updating order:", orderId, "to:", newStatus);

    try {
      const formData = new FormData();
      formData.append("status", newStatus.toLowerCase());

      const response = await axios.post(
        `${apiUrl}/orders/${orderId}/update-status`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userLogin.token}`,
            Accept: "application/json",
          },
        }
      );

      toast.success("Updated Status Successfully");

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus.toLowerCase() } : order
        )
      );
    } catch (error) {
      toast.error("Failed to update Status");
      console.error(error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`${apiUrl}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${userLogin.token}`,
          Accept: "application/json",
        },
      });
      return response.data.data || {};
    } catch (error) {
      toast.error("Failed to fetch order details");
      console.error(error);
      return {};
    }
  };

  const viewOrderDetails = async (order) => {
    const details = await fetchOrderDetails(order.id);
    setSelectedOrder(details || {});
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      {error && (
        <div className="text-red-500 p-4">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-2 text-start">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-gray-500">Manage and track customer orders</p>
      </div>
      <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="flex flex-wrap gap-2 overflow-x-auto max-w-full">
            <TabsTrigger
              value="all"
              onClick={() => {
                setStatusFilter("all");
                setTabPages((prev) => ({ ...prev, all: 1 }));
              }}
            >
              All Orders
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              onClick={() => {
                setStatusFilter("pending");
                setTabPages((prev) => ({ ...prev, pending: 1 }));
              }}
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="processing"
              onClick={() => {
                setStatusFilter("processing");
                setTabPages((prev) => ({ ...prev, processing: 1 }));
              }}
            >
              Processing
            </TabsTrigger>
            <TabsTrigger
              value="shipped"
              onClick={() => {
                setStatusFilter("shipped");
                setTabPages((prev) => ({ ...prev, shipped: 1 }));
              }}
            >
              Shipped
            </TabsTrigger>
            <TabsTrigger
              value="delivered"
              onClick={() => {
                setStatusFilter("delivered");
                setTabPages((prev) => ({ ...prev, delivered: 1 }));
              }}
            >
              Delivered
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              onClick={() => {
                setStatusFilter("cancelled");
                setTabPages((prev) => ({ ...prev, cancelled: 1 }));
              }}
            >
              Cancelled
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-8 w-full sm:w-[300px] pr-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setTabPages((prev) => ({ ...prev, [statusFilter]: 1 }));
              }}
            />
          </div>
        </div>

        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border border-[#e5e5e5] text-start">
                    <thead>
                      <tr className="border border-[#e5e5e5]">
                        <th className="h-12 px-4 text-left align-middle font-medium">Order ID</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Customer</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          <Button
                            variant="ghost"
                            className="hover:bg-transparent p-0 font-medium"
                            onClick={() => handleSort("date")}
                          >
                            Date
                            <ArrowUpDown
                              className={`ml-2 h-4 w-4 ${sortBy === "date" ? "opacity-100" : "opacity-40"}`}
                            />
                          </Button>
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          {status === "all" ? "Status" : "Items"}
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          <Button
                            variant="ghost"
                            className="hover:bg-transparent p-0 font-medium"
                            onClick={() => handleSort("total")}
                          >
                            Total
                            <ArrowUpDown
                              className={`ml-2 h-4 w-4 ${sortBy === "total" ? "opacity-100" : "opacity-40"}`}
                            />
                          </Button>
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const ordersByStatus = status === "all" ? filteredOrders : filteredOrders.filter((order) => order.status.toLowerCase() === status);
                        const startIndex = (tabPages[status] - 1) * itemsPerPage;
                        const paginatedByStatus = ordersByStatus.slice(startIndex, startIndex + itemsPerPage);

                        if (paginatedByStatus.length === 0) {
                          return (
                            <tr>
                              <td colSpan={6} className="p-4 text-center text-gray-500">
                                No Orders Found
                              </td>
                            </tr>
                          );
                        }

                        return paginatedByStatus.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 border border-[#e5e5e5]">
                            <td className="p-4 align-middle font-medium">{order.order_code}</td>
                            <td className="p-4 align-middle">{order.customer?.name || "N/A"}</td>
                            <td className="p-4 align-middle text-gray-500">{order.created_at}</td>
                            <td className="p-4 align-middle">
                              {status === "all" ? (
                                <Badge
                                  variant="outline"
                                  className={
                                    order.status === "delivered"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : order.status === "shipped"
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : order.status === "processing"
                                          ? "bg-purple-50 text-purple-700 border-purple-200"
                                          : order.status === "pending"
                                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                            : "bg-red-50 text-red-700 border-red-200"
                                  }
                                >
                                  {order.status}
                                </Badge>
                              ) : (
                                order.total_items
                              )}
                            </td>
                            <td className="p-4 align-middle">{order.total_amount} EGP</td>
                            <td className="p-4 align-middle text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-4 w-4"
                                    >
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => viewOrderDetails(order)}>
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                  {order.status !== "Processing" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, "Processing")}>
                                      <Package className="mr-2 h-4 w-4 text-purple-500" />
                                      Mark as Processing
                                    </DropdownMenuItem>
                                  )}
                                  {order.status !== "Shipped" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, "Shipped")}>
                                      <Truck className="mr-2 h-4 w-4 text-blue-500" />
                                      Mark as Shipped
                                    </DropdownMenuItem>
                                  )}
                                  {order.status !== "Delivered" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, "Delivered")}>
                                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                      Mark as Delivered
                                    </DropdownMenuItem>
                                  )}
                                  {order.status !== "Cancelled" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, "Cancelled")}>
                                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                      Mark as Cancelled
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="text-sm text-gray-500">
                    {(() => {
                      const ordersByStatus = status === "all" ? filteredOrders : filteredOrders.filter((order) => order.status.toLowerCase() === status);
                      const total = ordersByStatus.length;
                      const startIndex = (tabPages[status] - 1) * itemsPerPage;
                      const endIndex = Math.min(startIndex + itemsPerPage, total);
                      return `Showing ${startIndex + 1} to ${endIndex} of ${total} orders`;
                    })()}
                  </div>

                  <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setTabPages((prev) => ({
                          ...prev,
                          [status]: Math.max(prev[status] - 1, 1),
                        }))
                      }
                      disabled={tabPages[status] === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {(() => {
                      const ordersByStatus = status === "all" ? filteredOrders : filteredOrders.filter((order) => order.status.toLowerCase() === status);
                      const totalPages = Math.ceil(ordersByStatus.length / itemsPerPage);
                      const currentPage = tabPages[status];

                      return Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={i}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            className={
                              currentPage === pageNumber
                                ? "bg-teal-600 hover:bg-teal-700 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-300 border border-[#e5e5e5]"
                            }
                            onClick={() =>
                              setTabPages((prev) => ({
                                ...prev,
                                [status]: pageNumber,
                              }))
                            }
                          >
                            {pageNumber}
                          </Button>
                        );
                      });
                    })()}

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const ordersByStatus = status === "all" ? filteredOrders : filteredOrders.filter((order) => order.status.toLowerCase() === status);
                        const totalPages = Math.ceil(ordersByStatus.length / itemsPerPage);
                        setTabPages((prev) => ({
                          ...prev,
                          [status]: Math.min(prev[status] + 1, totalPages),
                        }));
                      }}
                      disabled={
                        tabPages[status] ===
                        Math.ceil((status === "all" ? filteredOrders : filteredOrders.filter((order) => order.status.toLowerCase() === status)).length / itemsPerPage)
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full max-w-[90vw] sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Order Details</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {selectedOrder ? `Order ${selectedOrder.order_code} from ${selectedOrder.customer?.name || "N/A"}` : "Loading..."}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder ? (
            <div className="py-2 sm:py-4">
              {/* Order Information */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2 whitespace-normal">Order Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm">Status:</span>
                    <Badge
                      variant="outline"
                      className={`text-xs sm:text-sm ${
                        selectedOrder.status === "delivered"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : selectedOrder.status === "shipped"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : selectedOrder.status === "processing"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : selectedOrder.status === "pending"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm">Date:</span>
                    <span className="text-xs sm:text-sm font-medium">{selectedOrder.created_at || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm">Payment Method:</span>
                    <span className="text-xs sm:text-sm font-medium">{selectedOrder.payment_method || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2 whitespace-normal">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm">Name:</span>
                    <span className="text-xs sm:text-sm font-medium max-w-[150px] sm:max-w-[200px] truncate">
                      {selectedOrder.customer?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm">Phone:</span>
                    <span className="text-xs sm:text-sm font-medium">{selectedOrder.phone_number || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm">Address:</span>
                    <span className="text-xs sm:text-sm font-medium max-w-[150px] sm:max-w-[200px] text-right">
                      {selectedOrder.delivery_address || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2 whitespace-normal">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm">Product:</span>
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium max-w-[150px] sm:max-w-[200px]">
                          {item.medication?.image && (
                            <LazyLoadImage
                              src={item.medication.image}
                              alt={item.medication.name}
                              className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.src = placeholder;
                              }}
                            />
                          )}
                          <span className="truncate">{item.medication?.name || "N/A"}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm">Quantity:</span>
                        <span className="text-xs sm:text-sm font-medium">{item.quantity || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm">Price:</span>
                        <span className="text-xs sm:text-sm font-medium">{item.price ? `${item.price} EGP` : "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm">Total:</span>
                        <span className="text-xs sm:text-sm font-medium">
                          {item.total_price || (item.price && item.quantity) ? `${item.total_price || item.price * item.quantity} EGP` : "N/A"}
                        </span>
                      </div>
                      {index < selectedOrder.items.length - 1 && <hr className="border-gray-200" />}
                    </div>
                  )) || (
                    <div className="text-xs sm:text-sm text-center text-gray-500 py-2">
                      No items found
                    </div>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-medium">Total:</span>
                <span className="text-xs sm:text-sm font-bold">{selectedOrder.total_amount ? `${selectedOrder.total_amount} EGP` : "N/A"}</span>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500 text-sm">No order details available</div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
            {selectedOrder && selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
              <DropdownMenu>
                <DropdownMenuContent align="end">
                  {selectedOrder.status !== "processing" && (
                    <DropdownMenuItem
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, "processing");
                        setIsModalOpen(false);
                      }}
                    >
                      <Package className="mr-2 h-4 w-4 text-purple-500" />
                      Mark as Processing
                    </DropdownMenuItem>
                  )}
                  {selectedOrder.status !== "shipped" && (
                    <DropdownMenuItem
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, "shipped");
                        setIsModalOpen(false);
                      }}
                    >
                      <Truck className="mr-2 h-4 w-4 text-blue-500" />
                      Mark as Shipped
                    </DropdownMenuItem>
                  )}
                  {selectedOrder.status !== "delivered" && (
                    <DropdownMenuItem
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, "delivered");
                        setIsModalOpen(false);
                      }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Mark as Delivered
                    </DropdownMenuItem>
                  )}
                  {selectedOrder.status !== "cancelled" && (
                    <DropdownMenuItem
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, "cancelled");
                        setIsModalOpen(false);
                      }}
                    >
                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      Mark as Cancelled
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}