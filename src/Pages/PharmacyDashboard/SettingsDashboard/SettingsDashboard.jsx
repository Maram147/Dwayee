import { useContext, useState } from "react";
import { Save, Camera } from "lucide-react";

import { Button } from "../../../components/UI/Button";
import { Input } from "../../../components/UI/input";
import { Textarea } from "../../../components/UI/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/UI/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/UI/tabs";
import { Label } from "../../../components/UI/label";
import { Switch } from "../../../components/UI/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/UI/avatar";
import { useToast } from "../../../components/UI/use-toast";
import { UserContext } from "../../../Context/UserContext";

function SettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Cairo Pharmacy",
    email: "info@cairopharmacy.com",
    phone: "+20 123 456 7890",
    address: "123 El-Nasr Rd, Cairo, Egypt",
    website: "www.cairopharmacy.com",
    description:
      "Cairo Pharmacy is a leading pharmacy in Egypt, providing high-quality medications and healthcare products. We are committed to providing excellent service to our customers.",
    openingHours: "9:00 AM - 10:00 PM",
    workingDays: "Saturday - Thursday",
    deliveryAvailable: true,
    deliveryFee: "30",
    freeDeliveryThreshold: "200",
    notifyLowStock: true,
    lowStockThreshold: "10",
    notifyNewOrders: true,
    notifyOrderUpdates: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setProfileData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Profile updated",
        description: "Your pharmacy profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { userLogin, loading } = useContext(UserContext);
    
      if (loading) return <p>Loading...</p>;
    
      if (!userLogin) return <Navigate to="/signin"/>;
    
      const userData = userLogin.user;
          const fullName = `${userData?.pharmacy.name}` || 'PH';
  

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 text-start">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500">Manage your pharmacy profile and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full text-start text-lg ">
        <TabsList className="grid w-full max-w-md grid-cols-3 text-start text-lg bg-gray-100">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Pharmacy Profile</CardTitle>
                <CardDescription>Update your pharmacy information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 bg-gray-200">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Pharmacy" />
                       <AvatarFallback>
                    {(() => {
                      if (!fullName) return 'PH';
                      return fullName
                        .split(/\s+/)
                        .map(namePart => namePart[0])
                        .join('');
                    })()}
                  </AvatarFallback>
                    </Avatar>
                   
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-xl font-semibold">{fullName}</h3>
                    <p className="text-sm text-gray-500">{userData?.created_at}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 ">
                  <div className="space-y-2">
                    <Label htmlFor="name">Pharmacy Name</Label>
                    <Input id="name" name="name" value={fullName} onChange={handleInputChange}  />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userData?.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={userData?.pharmacy.phone} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" value={profileData.website} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={userData?.pharmacy.address} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={profileData.description}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
                <CardDescription>Set your pharmacy's operating hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openingHours">Opening Hours</Label>
                  <Input
                    id="openingHours"
                    name="openingHours"
                    value={userData?.pharmacy.opening_time}
                    onChange={handleInputChange}
                    placeholder="e.g., 9:00 AM - 10:00 PM"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openingHours">Closing Hours</Label>
                  <Input
                    id="openingHours"
                    name="openingHours"
                    value={userData?.pharmacy.closing_time}
                    onChange={handleInputChange}
                    placeholder="e.g., 9:00 AM - 10:00 PM"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingDays">Working Days</Label>
                  <Input
                    id="workingDays"
                    name="workingDays"
                    value={userData?.pharmacy.working_days}
                    
                    onChange={handleInputChange}
                    placeholder="e.g., Saturday - Thursday"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">Update Password</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Settings</CardTitle>
                <CardDescription>Configure your delivery options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="deliveryAvailable">Delivery Available</Label>
                    <p className="text-sm text-gray-500">Enable delivery services for your customers</p>
                  </div>
                  <Switch
                    id="deliveryAvailable"
                    checked={profileData.deliveryAvailable}
                    onCheckedChange={(checked) => handleSwitchChange("deliveryAvailable", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryFee">Delivery Fee (EGP)</Label>
                  <Input
                    id="deliveryFee"
                    name="deliveryFee"
                    type="number"
                    value={profileData.deliveryFee}
                    onChange={handleInputChange}
                    disabled={!profileData.deliveryAvailable}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeDeliveryThreshold">Free Delivery Threshold (EGP)</Label>
                  <Input
                    id="freeDeliveryThreshold"
                    name="freeDeliveryThreshold"
                    type="number"
                    value={profileData.freeDeliveryThreshold}
                    onChange={handleInputChange}
                    disabled={!profileData.deliveryAvailable}
                  />
                  <p className="text-xs text-gray-500">Orders above this amount will qualify for free delivery</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Settings</CardTitle>
                <CardDescription>Configure your inventory preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyLowStock">Low Stock Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications when products are running low</p>
                  </div>
                  <Switch
                    id="notifyLowStock"
                    checked={profileData.notifyLowStock}
                    onCheckedChange={(checked) => handleSwitchChange("notifyLowStock", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    name="lowStockThreshold"
                    type="number"
                    value={profileData.lowStockThreshold}
                    onChange={handleInputChange}
                    disabled={!profileData.notifyLowStock}
                  />
                  <p className="text-xs text-gray-500">
                    Products with stock below this number will be flagged as low stock
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 text-start">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyNewOrders">New Order Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications when new orders are placed</p>
                </div>
                <Switch
                  id="notifyNewOrders"
                  checked={profileData.notifyNewOrders}
                  onCheckedChange={(checked) => handleSwitchChange("notifyNewOrders", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyOrderUpdates">Order Status Updates</Label>
                  <p className="text-sm text-gray-500">Receive notifications when order statuses change</p>
                </div>
                <Switch
                  id="notifyOrderUpdates"
                  checked={profileData.notifyOrderUpdates}
                  onCheckedChange={(checked) => handleSwitchChange("notifyOrderUpdates", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyLowStock">Low Stock Alerts</Label>
                  <p className="text-sm text-gray-500">Receive notifications when products are running low</p>
                </div>
                <Switch
                  id="notifyLowStock"
                  checked={profileData.notifyLowStock}
                  onCheckedChange={(checked) => handleSwitchChange("notifyLowStock", checked)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white"
                onClick={handleSaveProfile}
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SettingsPage;