import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  ArrowUpDown,
  X,
  UserPlus,
  MapPin,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import { Button } from "../../../components/UI/Button";
import { Card, CardContent } from "../../../components/UI/Card";
import { Input } from "../../../components/UI/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/UI/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/UI/dialog";
import { UserContext } from "../../../Context/UserContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/UI/tabs";
import { Badge } from "../../../components/UI/badge";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("alphabetical-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { userLogin } = useContext(UserContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/customers`, {
        headers: {
          Authorization: `Bearer ${userLogin.token}`,
          Accept: "application/json",
        },
        params: {
          paginate: 5,
          page: currentPage,
          q: searchQuery || undefined,
          sort: sortOption,
        },
      });

      setCustomers(response.data.data.data);
      setCurrentPage(response.data.data.current_page);
      setLastPage(response.data.data.last_page);
      setPaginationLinks(response.data.data.links || []);
      setTotalCustomers(response.data.data.total || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${userLogin.token}`,
          Accept: "application/json",
        },
      });
      setSelectedCustomer(response.data.data);
      setDialogOpen(true);
    } catch (err) {
      console.error("Failed to fetch customer details:", err);
      setError("Failed to load customer details");
    }
  };

  useEffect(() => {
    if (userLogin?.token) {
      fetchCustomers();
    }
  }, [searchQuery, sortOption, currentPage, userLogin]);

  const handleSort = (option) => {
    const [sortField, sortDirection] = sortOption.split("-");
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    const newSortOption = `${option}-${newDirection}`;
    setSortOption(newSortOption);
    setCurrentPage(1);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 text-start">
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-gray-500">Manage and view your customer information</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-10 w-full md:w-[300px] pr-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchQuery && (
            <button
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border border-[#e5e5e5]">
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <Button
                      variant="ghost"
                      className="hover:bg-transparent p-0 font-medium"
                      onClick={() => handleSort("alphabetical")}
                    >
                      Customer
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortOption.includes("alphabetical") ? "opacity-100" : "opacity-40"}`} />
                    </Button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Contact</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Join Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <Button
                      variant="ghost"
                      className="hover:bg-transparent p-0 font-medium"
                      onClick={() => handleSort("orders")}
                    >
                      Orders
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortOption.includes("orders") ? "opacity-100" : "opacity-40"}`} />
                    </Button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <Button
                      variant="ghost"
                      className="hover:bg-transparent p-0 font-medium"
                      onClick={() => handleSort("total_amount")}
                    >
                      Total Spent
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortOption.includes("total_amount") ? "opacity-100" : "opacity-40"}`} />
                    </Button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Last Order</th>
                  <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => {
                  const customerName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim();

                  return (
                    <tr key={customer.id} className="hover:bg-gray-50 border border-[#e5e5e5]">
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 bg-gray-200">
                            <AvatarImage
                              src={customer.avatar || "/placeholder.svg"}
                              alt={customerName}
                            />
                            <AvatarFallback>
                              {customerName
                                ? customerName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{customerName || 'Unknown Customer'}</p>
                            <p className="text-xs text-gray-500">{customer.email || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Phone className="h-3.5 w-3.5 text-gray-500 mr-1" />
                            <span className="text-sm">{customer.phone || "N/A"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-sm">{customer.join_date ? (customer.join_date) : "N/A"}</td>
                      <td className="p-4 align-middle text-sm">{customer.total_orders || 0}</td>
                      <td className="p-4 align-middle text-sm">{customer.total_amount || 0} EGP</td>
                      <td className="p-4 align-middle text-sm">{customer.last_order_date ? (customer.last_order_date): "N/A"}</td>
                      <td className="p-4 align-middle text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-teal-600"
                          onClick={() => fetchCustomerDetails(customer.id)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
  <div className="text-sm text-gray-500 text-center sm:text-left">
    Showing {customers.length} of {totalCustomers} customers
  </div>

  {/* <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
    <Button
      variant="outline"
      size="icon"
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>

    {paginationLinks
      .filter((link) => !["« Previous", "Next »"].includes(link.label))
      .map((link, i) => (
        <Button
          key={i}
          variant={link.active ? "default" : "outline"}
          className={
            link.active
              ? "bg-teal-600 hover:bg-teal-700 text-white"
              : "bg-white text-gray-700 hover:bg-gray-300 border border-[#e5e5e5]"
          }
          onClick={() => setCurrentPage(Number(link.label))}
        >
          {link.label}
        </Button>
      ))}

    <Button
      variant="outline"
      size="icon"
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
      disabled={currentPage === lastPage}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div> */}
  <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-1">
  <Button
    variant="outline"
    size="icon"
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
  >
    <ChevronLeft className="h-4 w-4" />
  </Button>

  {(() => {
    const totalPages = lastPage;
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
          onClick={() => setCurrentPage(pageNumber)}
        >
          {pageNumber}
        </Button>
      );
    });
  })()}

  <Button
    variant="outline"
    size="icon"
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
    disabled={currentPage === lastPage}
  >
    <ChevronRight className="h-4 w-4" />
  </Button>
</div>

</div>

        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[600px] overflow-y-auto max-h-[90vh] overflow-x-hidden">
  <DialogHeader>
    <DialogTitle className="text-base sm:text-xl">Customer Details</DialogTitle>
    <DialogDescription className="text-xs sm:text-base">
      {selectedCustomer
        ? `Customer information for ${selectedCustomer.first_name} ${selectedCustomer.last_name}`
        : ""}
    </DialogDescription>
  </DialogHeader>
  {selectedCustomer && (
    <div className="py-3">
      <div className="flex flex-col gap-3 sm:gap-6 mb-3 sm:mb-6">
        <Avatar className="h-12 w-12 sm:h-16 sm:w-16 bg-gray-200">
          <AvatarImage
            src={selectedCustomer.avatar || "/placeholder.svg"}
            alt={`${selectedCustomer.first_name} ${selectedCustomer.last_name}`}
          />
          <AvatarFallback className="text-base sm:text-lg bg-gray-200">
            {`${selectedCustomer.first_name || ''} ${selectedCustomer.last_name || ''}`
              .trim()
              .split(" ")
              .map((n) => n[0])
              .join("") || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-start">
            {`${selectedCustomer.first_name} ${selectedCustomer.last_name}`}
          </h3>
          <div className="flex items-center text-xs text-gray-500">
            <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {selectedCustomer.email || "N/A"}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {selectedCustomer.phone || "N/A"}
          </div>
          <div className="flex items-start text-xs text-gray-500">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 mt-0.5" />
            {selectedCustomer.address || "N/A"} 
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-6">
        <Card>
          <CardContent className="p-2 sm:p-4 flex flex-col items-center justify-center">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600 mb-1 sm:mb-2" />
            <p className="text-xs text-gray-500">Customer Since</p>
            <p className="font-semibold text-xs sm:text-sm">
              {selectedCustomer.join_date
                ? (selectedCustomer.join_date)
                : "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 sm:p-4 flex flex-col items-center justify-center">
            <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600 mb-1 sm:mb-2" />
            <p className="text-xs text-gray-500">Total Orders</p>
            <p className="font-semibold text-xs sm:text-sm">{selectedCustomer.total_orders || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 sm:p-4 flex flex-col items-center justify-center">
            <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-teal-100 flex items-center justify-center mb-1 sm:mb-2">
              <span className="text-teal-600 font-bold text-xs">EGP</span>
            </div>
            <p className="text-xs text-gray-500">Total Spent</p>
            <p className="font-semibold text-xs sm:text-sm">{selectedCustomer.total_amount || 0} EGP</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Order History</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-3 sm:mt-4">
          {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
            <>
              {/* Table for larger screens */}
              <div className="hidden sm:block rounded-md overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedCustomer.orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-medium">{order.order_code}</td>
                        <td className="px-4 py-2 text-sm">
                          {selectedCustomer.join_date
                ? (selectedCustomer.join_date)
                : "N/A"}
                        </td>
                        <td className="px-4 py-2 text-sm">
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
                        </td>
                        <td className="px-4 py-2 text-sm">{order.total_items || "N/A"}</td>
                        <td className="px-4 py-2 text-sm font-medium">{order.total_amount || 0} EGP</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Card layout for mobile */}
              <div className="block sm:hidden space-y-3">
                {selectedCustomer.orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="font-medium">Order ID</p>
                          <p>{order.order_code}</p>
                        </div>
                        <div>
                          <p className="font-medium">Date</p>
                          <p>{order.date || "N/A"}</p> {/* Corrected to use order.date */}
                        </div>
                        <div>
                          <p className="font-medium">Status</p>
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
                        </div>
                        <div>
                          <p className="font-medium">Items</p>
                          <p>{order.total_items || "N/A"}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="font-medium">Total</p>
                          <p className="font-semibold">{order.total_amount || 0} EGP</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-gray-500 text-xs sm:text-base">
              No orders found for this customer.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )}
  <DialogFooter>
    <Button variant="outline" onClick={() => setDialogOpen(false)}>
      Close
    </Button>
  </DialogFooter>
</DialogContent>
      </Dialog>
    </div>
  );
}