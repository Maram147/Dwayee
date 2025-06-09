import { useContext, useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Filter,
  Package,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  AlertTriangle,
  X,
  Camera,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import debounce from "lodash/debounce";
import axios from "axios";
import placeholder from "@/assets/images/placeholder.svg";

import { Button } from "../../../components/UI/Button";
import { Input } from "../../../components/UI/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/UI/Card";
import { Badge } from "../../../components/UI/badge";
import { Checkbox } from "../../../components/UI/checkbox";
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
  DialogTrigger,
} from "../../../components/UI/dialog";
import { Label } from "../../../components/UI/label";
import { Textarea } from "../../../components/UI/textarea";
import { UserContext } from "../../../Context/UserContext";

export default function InventoryPage() {
  const { userLogin, pharmacy } = useContext(UserContext);
  const pharmacyId = pharmacy?.id || null;
  const [medications, setMedications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Single category
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editMode, setEditMode] = useState("full"); // or "stock"

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    lowStockAlert: "",
    description: "",
    imageFile: null,
    imageUrl: "",
  });
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { id: rawId } = useParams();
  const id = !isNaN(Number(rawId)) ? Number(rawId) : null;

  const debouncedSearchChange = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleSearchInputChange = (e) => {
    debouncedSearchChange(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageUpload" && files && files[0]) {
      setNewProduct((prev) => ({
        ...prev,
        imageFile: files[0],
        imageUrl: URL.createObjectURL(files[0]),
      }));
    } else if (name === "category") {
      setNewProduct((prev) => ({
        ...prev,
        category_id: parseInt(value),
      }));
    }
    else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("category_id", newProduct.category_id);
    formData.append("generic_name", newProduct.generic_name);
    formData.append("expiry_date", newProduct.expiry_date);

    formData.append("price", parseFloat(newProduct.price));
    formData.append("stock", parseInt(newProduct.stock));
    formData.append("lowStockAlert", parseInt(newProduct.lowStockAlert));
    formData.append("description", newProduct.description);
    if (newProduct.imageFile) formData.append("image", newProduct.imageFile);

    try {
      console.log([...formData]);

      const response = await axios.post(
        `${apiUrl}/medications/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userLogin.token}`,
            Accept: "application/json",
          },
        }
      );
      setMedications((prev) => [response.data.data, ...prev]);
      setIsAddProductOpen(false);
      setNewProduct({
        name: "",
        generic_name: "",
        category_id: "",
        price: "",
        stock: "",
        expiry_date: "",
        lowStockAlert: "",
        description: "",
        imageFile: null,
        imageUrl: "",
        active_ingredients:"",
        manufacturer:"",
        side_effects:"",
        dosage:"",
      });
    } catch (err) {
      setError("Failed to add product: " + (err.response?.data?.message || err.message));
    }
  };

  const getPharmacyDetails = async (pharmacyId) => {
    try {
      const { data } = await axios.get(`${apiUrl}/pharmacies/${pharmacyId}`, {
        headers: { Authorization: `Bearer ${userLogin.token}` },
      });
      setPharmacy(data.data);
    } catch (err) {
      setError("Failed to fetch pharmacy details");
      throw err;
    }
  };

  const getAllMedications = async (page = 1, query = "", category = "") => {
    try {
      const categoryParam = category || undefined;
      const { data } = await axios.get(`${apiUrl}/medications`, {
        headers: { Authorization: `Bearer ${userLogin.token}`, Accept: "application/json" },
        params: { paginate: 12, page, q: query || undefined, category_id: categoryParam, pharmacy_id: pharmacyId },
      });
      console.log("Medications API Response:", data);
      setMedications(data.data.data);
      setCurrentPage(data.data.current_page);
      setLastPage(data.data.last_page);
      setPaginationLinks(data.data.links);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch medications");
      throw err;
    }
  };

  const toggleCategory = (categoryId) => {
    console.log("Toggling Category ID:", categoryId);
    setSelectedCategory(categoryId === selectedCategory ? "" : categoryId);
    setCurrentPage(1);
  };

  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/medications/categories`);
      console.log("Categories Data:", data);
      setCategories(data.data || []);
    } catch (err) {
      setError("Failed to load categories");
      throw err;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      if (!id && !pharmacyId) {
        setError("Pharmacy ID is missing. Please check the URL or ensure you are logged in with a valid pharmacy.");
        setLoading(false);
        return;
      }
      try {
        const pharmacyIdToUse = id || pharmacyId;
        if (!pharmacy) await getPharmacyDetails(pharmacyIdToUse);
        await Promise.all([getCategories(), getAllMedications(currentPage, searchQuery, selectedCategory)]);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, pharmacyId, pharmacy, currentPage, searchQuery, selectedCategory]);

  const toggleSelectAll = (checked) => {
    setSelectedProducts(checked ? paginatedProducts.map((p) => p.id) : []);
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSort = (field) => {
    setSortBy((prev) => (prev === field ? null : field));
    const sorted = [...medications].sort((a, b) =>
      sortBy === field ? (a[field] > b[field] ? 1 : -1) : a[field] > b[field] ? -1 : 1
    );
    setMedications(sorted);
  };

  const itemsPerPage = 12;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = medications.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(medications.length / itemsPerPage);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);



  const handleUpdateStock = async (newStock) => {
    if (!selectedProduct) return;
    try {
      await axios.post(
        `${apiUrl}/medications/${selectedProduct.id}/update`,
        { stock: parseInt(newStock) },
        { headers: { Authorization: `Bearer ${userLogin.token}`, Accept: "application/json" } }
      );
      setMedications((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? { ...p, stock: parseInt(newStock) } : p))
      );
    } catch (err) {
      setError("Failed to update stock: " + (err.response?.data?.message || err.message));
    }
  };
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditMode(true);
    setNewProduct({
      name: product.name,
      category_id: product.category_id || "",
      price: product.price || "",
      stock: product.stock || "",
      lowStockAlert: product.lowStockAlert || "",
      description: product.description || "",
      imageUrl: product.image ? product.image : "",
      imageFile: null,
      active_ingredients:product.active_ingredients||"",
      manufacturer:product.manufacturer||"",
      side_effects:product.side_effects||"",
      dosage:product.dosage||"",
    });
    setIsEditOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("category_id", newProduct.category_id);
      formData.append("price", parseFloat(newProduct.price));
      formData.append("stock", parseInt(newProduct.stock));
      formData.append("lowStockAlert", parseInt(newProduct.lowStockAlert));
      formData.append("dosage", newProduct.dosage);
       formData.append("side_effects", newProduct.side_effects);
        formData.append("manufacturer", newProduct.manufacturer);
         formData.append("active_ingredients", newProduct.active_ingredients);
          formData.append("description", newProduct.description);

      if (newProduct.imageFile) formData.append("image", newProduct.imageFile);

      const response = await axios.post(
        `${apiUrl}/medications/${selectedProduct.id}/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userLogin.token}`,
            Accept: "application/json",
          },
        }
      );

      setMedications((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id ? { ...p, ...response.data.data } : p
        )
      );
      setIsEditOpen(false);
      setIsEditMode(false);
      setSelectedProduct(null);
      setNewProduct({
        name: "",
        category_id: "",
        price: "",
        stock: "",
        lowStockAlert: "",
        description: "",
        imageUrl: "",
        imageFile: null,
      });
    } catch (err) {
      setError("Failed to update product: " + (err.response?.data?.message || err.message));
    }
  };



  // if (error) return (
  //   <div className="p-6 text-red-500">
  //     {error}
  //     <br />
  //     <Link to="/pharmacies" className="text-teal-600 hover:underline mt-2 inline-block">
  //       Go back to Pharmacies
  //     </Link>
  //   </div>
  // );
  // if (!pharmacy) return <div className="p-6">No pharmacy found</div>;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 text-start">
        <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-gray-500">Manage your products and stock levels</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 w-full md:w-[300px] pr-8"
              value={searchQuery}
              onChange={handleSearchInputChange}
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
          <Button
            variant="outline"
            className="flex items-center gap-2 md:hidden"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {selectedCategory && <Badge className="ml-1 bg-teal-600">1</Badge>}
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">

          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[90vw] sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Fill in the details to add a new product to your inventory.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProduct}>
                <div className="grid gap-0.5 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input id="name" name="name" value={newProduct.name} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category_id"
                    name="category_id"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newProduct.category_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry_date">Expiry Date</Label>
                      <Input
                        id="expiry_date"
                        name="expiry_date"
                        type="date"
                        value={newProduct.expiry_date}
                        onChange={handleInputChange}

                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="generic_name">Generic Name</Label>
                      <Input
                        id="generic_name"
                        name="generic_name"
                        value={newProduct.generic_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="active_ingredients">Active Ingredients</Label>
                      <Input
                        id="active_ingredients"
                        name="active_ingredients"
                        value={newProduct.active_ingredients}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="manufacturer">Manufacturer</Label>
                      <Input
                        id="manufacturer"
                        name="manufacturer"
                        value={newProduct.manufacturer}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="side_effects">Side Effects</Label>
                      <Input
                        id="side_effects"
                        name="side_effects"
                        value={newProduct.side_effects}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input
                        id="dosage"
                        name="dosage"
                        value={newProduct.dosage}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (EGP)</Label>
                      <Input id="price" name="price" type="number" value={newProduct.price} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input id="stock" name="stock" type="number" value={newProduct.stock} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lowStockAlert">Low Stock Alert Threshold</Label>
                    <Input id="lowStockAlert" name="lowStockAlert" type="number" value={newProduct.lowStockAlert} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" value={newProduct.description} onChange={handleInputChange} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUpload">Product Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="border rounded-md p-2 w-full">
                        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-md relative">
                          {newProduct.imageUrl ? (
                            <div className="relative w-full h-full">
                              <img src={newProduct.imageUrl} alt="Product preview" className="h-full w-auto mx-auto object-contain" />
                              <button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/80 hover:bg-white"
                                onClick={() => setNewProduct((prev) => ({ ...prev, imageUrl: "", imageFile: null }))}
                                 onError={(e) => {
                              e.currentTarget.src = placeholder;
                            }}
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove image</span>
                              </button>
                            </div>
                          ) : (
                            <>
                              <Camera className="h-8 w-8 text-gray-300" />
                              <input
                                id="imageUpload"
                                name="imageUpload"
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleInputChange}
                              />
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          {newProduct.imageUrl ? "Click the X to remove" : "Click to upload"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddProductOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white mb-2">
                    Add Product
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className={`w-full md:w-64 shrink-0 ${showMobileFilters ? "block" : "hidden md:block"}`}>
          <Card>
            <CardHeader className="pb-3 text-start">
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-start">
                  <h3 className="text-sm font-medium mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategory === category.id.toString()}
                          onCheckedChange={() => toggleCategory(category.id.toString())}
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="flex items-center justify-between w-full text-sm cursor-pointer"
                        >
                          <span>{category.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedCategory && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Active Filters</h3>
                      <Button
                        variant="link"
                        className="text-xs text-teal-600 p-0 h-auto"
                        onClick={() => setSelectedCategory("")}
                      >
                        Clear
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {categories
                        .filter((cat) => cat.id.toString() === selectedCategory)
                        .map((cat) => (
                          <Badge
                            key={cat.id}
                            variant="outline"
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => setSelectedCategory("")}
                          >
                            {cat.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex-1">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border border-[#e5e5e5]">
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        <Checkbox
                          checked={paginatedProducts.length > 0 && selectedProducts.length === paginatedProducts.length}
                          onCheckedChange={toggleSelectAll}
                        />
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        <Button
                          variant="ghost"
                          className="hover:bg-transparent p-0 font-medium"
                          onClick={() => handleSort("name")}
                        >
                          Product
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortBy === "name" ? "opacity-100" : "opacity-40"}`} />
                        </Button>
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        <Button
                          variant="ghost"
                          className="hover:bg-transparent p-0 font-medium"
                          onClick={() => handleSort("price")}
                        >
                          Price
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortBy === "price" ? "opacity-100" : "opacity-40"}`}
                          />
                        </Button>
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        <Button
                          variant="ghost"
                          className="hover:bg-transparent p-0 font-medium"
                          onClick={() => handleSort("stock")}
                        >
                          Stock
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortBy === "stock" ? "opacity-100" : "opacity-40"}`}
                          />
                        </Button>
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50 border border-[#e5e5e5]">
                        <td className="p-4 align-middle">
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => toggleProductSelection(product.id)}
                          />
                        </td>
                        <td className="p-4 align-middle font-medium">{product.name}</td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline">{product.category || product.generic_name}</Badge>
                        </td>
                        <td className="p-4 align-middle">{product.price} EGP</td>
                        <td className="p-4 align-middle">
                          <span
                            className={`mr-2 ${product.stock < product.lowStockAlert
                              ? "text-red-600"
                              : product.stock < product.lowStockAlert * 2
                                ? "text-amber-600"
                                : "text-green-600"
                              }`}
                          >
                            {product.stock}
                          </span>
                          {product.stock < product.lowStockAlert && (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </td>
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
                              <DropdownMenuItem onClick={() => handleEdit(product)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit(product)}
                              >
                                <Package className="mr-2 h-4 w-4" />
                                Update Stock
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, medications.length)} of{" "}
                  {medications.length} products
                </div>
                <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(5, lastPage) }).map((_, i) => {
                    let pageNumber;
                    if (lastPage <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= lastPage - 2) {
                      pageNumber = lastPage - 4 + i;
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
                  })}
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
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-full max-w-[90vw] sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            isEditMode ? handleUpdateProduct() : handleAddProduct();
          }}>
            <div className="grid gap-0.5 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" value={newProduct.name} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category_id"
                    name="category_id"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newProduct.category_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                      <Label htmlFor="active_ingredients">Active Ingredients</Label>
                      <Input
                        id="active_ingredients"
                        name="active_ingredients"
                        value={newProduct.active_ingredients}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="manufacturer">Manufacturer</Label>
                      <Input
                        id="manufacturer"
                        name="manufacturer"
                        value={newProduct.manufacturer}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="side_effects">Side Effects</Label>
                      <Input
                        id="side_effects"
                        name="side_effects"
                        value={newProduct.side_effects}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input
                        id="dosage"
                        name="dosage"
                        value={newProduct.dosage}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (EGP)</Label>
                  <Input id="price" name="price" type="number" value={newProduct.price} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input id="stock" name="stock" type="number" value={newProduct.stock} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowStockAlert">Low Stock Alert Threshold</Label>
                <Input
                  id="lowStockAlert"
                  name="lowStockAlert"
                  type="number"
                  value={newProduct.lowStockAlert}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={newProduct.description} onChange={handleInputChange} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUpload">Product Image</Label>
                <div className="flex items-center gap-4">
                  <div className="border rounded-md p-2 w-full">
                    <div className="flex items-center justify-center h-32 bg-gray-50 rounded-md relative">
                      {newProduct.imageUrl ? (
                        <div className="relative w-full h-full">
                          <img
                            src={newProduct.imageUrl}
                            alt={newProduct.name}
                            className="w-32 h-32 object-contain rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = placeholder;
                            }}
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/80 hover:bg-white"
                            onClick={() => setNewProduct((prev) => ({ ...prev, imageUrl: "", imageFile: null }))}

                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove image</span>
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Camera className="h-8 w-8 text-gray-300" />
                          <input
                            id="imageUpload"
                            name="imageUpload"
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleInputChange}
                          />
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {newProduct.imageUrl ? "Click the X to remove" : "Click to upload"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white mb-2">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}