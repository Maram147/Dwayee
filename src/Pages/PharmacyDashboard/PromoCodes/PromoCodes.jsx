import { useState } from "react";
import {
  Search,
  Plus,
  Percent,
  DollarSign,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";

import { Button } from "../../../components/UI/Button";
import { Input } from "../../../components/UI/input";
import { Card, CardContent } from "../../../components/UI/Card";
import { Badge } from "../../../components/UI/badge";
import { Switch } from "../../../components/UI/switch";
import { Label } from "../../../components/UI/label";
import { RadioGroup, RadioGroupItem } from "../../../components/UI/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/UI/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/UI/DropDownMenu";
import { useToast } from "../../../components/UI/use-toast";

// Mock data for promo codes
const PROMO_CODES = Array.from({ length: 20 }).map((_, i) => {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - Math.floor(Math.random() * 30));

  const endDate = new Date(now);
  endDate.setDate(now.getDate() + Math.floor(Math.random() * 60));

  const isExpired = endDate < now;
  const isActive = !isExpired && Math.random() > 0.2;

  return {
    id: i + 1,
    code: [
      "WELCOME20",
      "SUMMER10",
      "FLASH25",
      "NEWUSER15",
      "HOLIDAY30",
      "WEEKEND5",
      "SPECIAL50",
      "LOYALTY10",
      "RETURN15",
      "BIRTHDAY20",
    ][i % 10],
    type: Math.random() > 0.5 ? "percentage" : "fixed",
    value: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 5 : Math.floor(Math.random() * 100) + 20,
    minPurchase: Math.floor(Math.random() * 200) + 50,
    startDate: startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    endDate: endDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    usageLimit: Math.floor(Math.random() * 100) + 1,
    usedCount: Math.floor(Math.random() * 50),
    isActive,
    isExpired,
    description: [
      "Welcome discount for new customers",
      "Summer sale promotion",
      "Flash sale discount",
      "New user special offer",
      "Holiday season discount",
      "Weekend special offer",
      "Special promotion",
      "Loyalty program discount",
      "Return customer discount",
      "Birthday special offer",
    ][i % 10],
  };
});

function PromoCodesPage() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("code");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddPromoOpen, setIsAddPromoOpen] = useState(false);
  const [isEditPromoOpen, setIsEditPromoOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [newPromo, setNewPromo] = useState({
    code: "",
    type: "percentage",
    value: "",
    minPurchase: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    description: "",
    isActive: true,
  });

  const itemsPerPage = 10;

  // Filter promo codes based on search and status
  const filteredPromoCodes = PROMO_CODES.filter((promo) => {
    const matchesSearch =
      searchQuery === "" ||
      promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && promo.isActive && !promo.isExpired) ||
      (statusFilter === "inactive" && !promo.isActive && !promo.isExpired) ||
      (statusFilter === "expired" && promo.isExpired);

    return matchesSearch && matchesStatus;
  });

  // Sort promo codes
  const sortedPromoCodes = [...filteredPromoCodes].sort((a, b) => {
    if (sortBy === "code") {
      return sortOrder === "asc" ? a.code.localeCompare(b.code) : b.code.localeCompare(a.code);
    } else if (sortBy === "value") {
      return sortOrder === "asc" ? a.value - b.value : b.value - a.value;
    } else {
      // Sort by end date
      const dateA = new Date(a.endDate);
      const dateB = new Date(b.endDate);
      return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedPromoCodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPromoCodes = sortedPromoCodes.slice(startIndex, startIndex + itemsPerPage);

  // Handle sort
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Handle add promo code
  const handleAddPromo = (e) => {
    e.preventDefault();
    // In a real app, this would be an API call to add a promo code
    toast({
      title: "Promo code added",
      description: `${newPromo.code} has been added successfully.`,
    });
    setIsAddPromoOpen(false);
    setNewPromo({
      code: "",
      type: "percentage",
      value: "",
      minPurchase: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
      description: "",
      isActive: true,
    });
  };

  // Handle edit promo code
  const handleEditPromo = (e) => {
    e.preventDefault();
    // In a real app, this would be an API call to update a promo code
    toast({
      title: "Promo code updated",
      description: `${selectedPromo?.code} has been updated successfully.`,
    });
    setIsEditPromoOpen(false);
    setSelectedPromo(null);
  };

  // Handle delete promo code
  const handleDeletePromo = (promoId) => {
    // In a real app, this would be an API call to delete a promo code
    toast({
      title: "Promo code deleted",
      description: "The promo code has been deleted successfully.",
    });
  };

  // Handle copy promo code
  const handleCopyPromo = (code) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: `${code} has been copied to clipboard.`,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 text-start">
        <h1 className="text-2xl font-bold tracking-tight">Promo Codes</h1>
        <p className="text-gray-500">Manage discounts and promotional offers</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto ">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground text-[#e5e5e5]" />
            <Input
              type="search"
              placeholder="Search promo codes..."
              className="pl-8 w-full sm:w-[300px] pr-8 border border-[#e5e5e5]"
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
          <select
            className="h-10 rounded-md border border-input border-[#e5e5e5]  bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <Dialog open={isAddPromoOpen} onOpenChange={setIsAddPromoOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Promo Code</DialogTitle>
              <DialogDescription>Create a new promotional code for your customers.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPromo}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Promo Code</Label>
                    <Input
                      id="code"
                      name="code"
                      placeholder="e.g., SUMMER20"
                      value={newPromo.code}
                      onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Discount Type</Label>
                    <RadioGroup
                      value={newPromo.type}
                      onValueChange={(value) => setNewPromo({ ...newPromo, type: value })}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percentage" id="percentage" />
                        <Label htmlFor="percentage" className="flex items-center">
                          <Percent className="h-4 w-4 mr-1" />
                          Percentage
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <Label htmlFor="fixed" className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Fixed Amount
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">
                      {newPromo.type === "percentage" ? "Discount Percentage (%)" : "Discount Amount (EGP)"}
                    </Label>
                    <Input
                      id="value"
                      name="value"
                      type="number"
                      placeholder={newPromo.type === "percentage" ? "e.g., 20" : "e.g., 50"}
                      value={newPromo.value}
                      onChange={(e) => setNewPromo({ ...newPromo, value: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minPurchase">Minimum Purchase (EGP)</Label>
                    <Input
                      id="minPurchase"
                      name="minPurchase"
                      type="number"
                      placeholder="e.g., 100"
                      value={newPromo.minPurchase}
                      onChange={(e) => setNewPromo({ ...newPromo, minPurchase: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={newPromo.startDate}
                      onChange={(e) => setNewPromo({ ...newPromo, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={newPromo.endDate}
                      onChange={(e) => setNewPromo({ ...newPromo, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    name="usageLimit"
                    type="number"
                    placeholder="e.g., 100 (leave empty for unlimited)"
                    value={newPromo.usageLimit}
                    onChange={(e) => setNewPromo({ ...newPromo, usageLimit: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="e.g., Summer sale promotion"
                    value={newPromo.description}
                    onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2 ">
                  <Switch
                    id="isActive"
                    checked={newPromo.isActive}
                    onCheckedChange={(checked) => setNewPromo({ ...newPromo, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddPromoOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white my-2">
                  Create Promo Code
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0 ">
          <div className="overflow-x-auto ">
            <table className="w-full border border-[#e5e5e5]">
              <thead>
                <tr className="border-b border border-[#e5e5e5]">
                  <th className="h-12 px-4 text-left text-start font-medium">
                    <Button
                      variant="ghost"
                      className="hover:bg-transparent p-0 font-medium"
                      onClick={() => handleSort("code")}
                    >
                      Promo Code
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortBy === "code" ? "opacity-100" : "opacity-40"}`}
                      />
                    </Button>
                  </th>
                  <th className="h-12 px-4 text-left text-start font-medium">
                    <Button
                      variant="ghost"
                      className="hover:bg-transparent p-0 font-medium"
                      onClick={() => handleSort("value")}
                    >
                      Discount
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortBy === "value" ? "opacity-100" : "opacity-40"}`}
                      />
                    </Button>
                  </th>
                  <th className="h-12 px-4 text-left text-start font-medium">Usage</th>
                  <th className="h-12 px-4 text-left text-start font-medium">
                    <Button
                      variant="ghost"
                      className="hover:bg-transparent p-0 font-medium"
                      onClick={() => handleSort("endDate")}
                    >
                      Validity
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortBy === "endDate" ? "opacity-100" : "opacity-40"}`}
                      />
                    </Button>
                  </th>
                  <th className="h-12 px-4 text-left text-start font-medium">Status</th>
                  <th className="h-12 px-4 text-right text-start font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPromoCodes.map((promo) => (
                  <tr key={promo.id} className="border-b hover:bg-gray-50 border border-[#e5e5e5] ">
                    <td className="p-4 text-start ">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 text-teal-600 mr-2" />
                          <span className="font-medium">{promo.code}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1"
                            onClick={() => handleCopyPromo(promo.code)}
                          >
                            <Copy className="h-3 w-3" />
                            <span className="sr-only">Copy code</span>
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{promo.description}</p>
                      </div>
                    </td>
                    <td className="p-4 text-start">
                      <div className="flex items-center">
                        {promo.type === "percentage" ? (
                          <Percent className="h-4 w-4 text-teal-600 mr-1" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-teal-600 mr-1" />
                        )}
                        <span>
                          {promo.value}
                          {promo.type === "percentage" ? "%" : " EGP"}
                        </span>
                      </div>
                      {promo.minPurchase && (
                        <p className="text-xs text-gray-500 mt-1">Min. {promo.minPurchase} EGP</p>
                      )}
                    </td>
                    <td className="p-4 text-start">
                      <div className="flex items-center">
                        <span>
                          {promo.usedCount}/{promo.usageLimit || "∞"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-start">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm">{promo.startDate}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm">{promo.endDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-start">
                      {promo.isExpired ? (
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200"
                        >
                          Expired
                        </Badge>
                      ) : promo.isActive ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-700 border-gray-200"
                        >
                          Inactive
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-start text-right">
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPromo(promo);
                              setIsEditPromoOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyPromo(promo.code)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Code
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeletePromo(promo.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredPromoCodes.length)} of{" "}
              {filteredPromoCodes.length} promo codes
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNumber;

                // Logic to show correct page numbers when there are many pages
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
                    className={currentPage === pageNumber ? "bg-teal-600 hover:bg-teal-700 text-white" : "bg-white text-gray-700 hover:bg-gray-300 border border-[#e5e5e5]"}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Promo Dialog */}
      <Dialog open={isEditPromoOpen} onOpenChange={setIsEditPromoOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Promo Code</DialogTitle>
            <DialogDescription>Update the details of your promotional code.</DialogDescription>
          </DialogHeader>
          {selectedPromo && (
            <form onSubmit={handleEditPromo}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-code">Promo Code</Label>
                    <Input
                      id="edit-code"
                      name="code"
                      defaultValue={selectedPromo.code}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Discount Type</Label>
                    <RadioGroup defaultValue={selectedPromo.type} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percentage" id="edit-percentage" />
                        <Label htmlFor="edit-percentage" className="flex items-center">
                          <Percent className="h-4 w-4 mr-1" />
                          Percentage
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="edit-fixed" />
                        <Label htmlFor="edit-fixed" className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Fixed Amount
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-value">
                      {selectedPromo.type === "percentage" ? "Discount Percentage (%)" : "Discount Amount (EGP)"}
                    </Label>
                    <Input
                      id="edit-value"
                      name="value"
                      type="number"
                      defaultValue={selectedPromo.value}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-minPurchase">Minimum Purchase (EGP)</Label>
                    <Input
                      id="edit-minPurchase"
                      name="minPurchase"
                      type="number"
                      defaultValue={selectedPromo.minPurchase}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-startDate">Start Date</Label>
                    <Input
                      id="edit-startDate"
                      name="startDate"
                      type="date"
                      defaultValue={new Date(selectedPromo.startDate).toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-endDate">End Date</Label>
                    <Input
                      id="edit-endDate"
                      name="endDate"
                      type="date"
                      defaultValue={new Date(selectedPromo.endDate).toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-usageLimit">Usage Limit</Label>
                  <Input
                    id="edit-usageLimit"
                    name="usageLimit"
                    type="number"
                    defaultValue={selectedPromo.usageLimit}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    name="description"
                    defaultValue={selectedPromo.description}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="edit-isActive" defaultChecked={selectedPromo.isActive} />
                  <Label htmlFor="edit-isActive">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditPromoOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                  Update Promo Code
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PromoCodesPage;