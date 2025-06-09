import { useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Layout from "./Pages/Layout/Layout";
import Pharmacies from "./Pages/Pharmacies/Pharmacies";
import Medications from "./Pages/Medications/Medications";
import Home from "./Pages/Home/Home";
import MedicationDetails from "./Pages/MedicationDetails/MedicationDetails";
import Checkout from "./Pages/Checkout/Checkout";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import Categories from "./Pages/Categories/Categories";
import SignIn from "./Pages/SignIn/SignIn";
import Notfound from "./Pages/Notfound/Notfound";
import Navbar from "./Pages/Navbar/Navbar";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import Join from "./Pages/Join/Join";
import Signup from "./Pages/Signup/Signup";
import PharmacyDetails from "./Pages/PharmacyDetails/PharmacyDetails";
import Cart from "./Pages/Cart/Cart";

import Customers from "./Pages/PharmacyDashboard/Customers/Customers";
import Inventory from "./Pages/PharmacyDashboard/Inventory/Inventory";
import Orders from "./Pages/PharmacyDashboard/Orders/Orders";
import PharmacyDashboard from "./Pages/PharmacyDashboard/PhDashboard/PharmacyDashboard";
import PromoCodes from "./Pages/PharmacyDashboard/PromoCodes/PromoCodes";
import SettingsDashboard from "./Pages/PharmacyDashboard/SettingsDashboard/SettingsDashboard";

import UserDashboard from "./Pages/UserDashboard/UsDashboard/UserDashboard";
import PaymentMethods from "./Pages/UserDashboard/PaymentMethods/PaymentMethods";
import ManageAddresses from "./Pages/UserDashboard/ManageAddresses/ManageAddresses";
import AccountSettings from "./Pages/UserDashboard/AccountSettings/AccountSettings";
import OrderDetails from "./Pages/UserDashboard/OrderDetails/OrderDetails"

import PharmacyDashboardLayout from "./Pages/Layout/PharmacyDashboardLayout";
import UserDashboardLayout from "./Pages/Layout/UserDashboardLayout";
import SignOut from "./Pages/SignOut/SignOut";
import ProtectRoute from "./Pages/ProtectRoute/ProtectRoute";

export default function AppRouter() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "medications", element: <Medications /> },
        { path: "pharmacies", element: <Pharmacies /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <Contact /> },
        { path: "join", element: <Join /> },
        { path: "medicationdetails/:id", element: <MedicationDetails /> },
        { path: "pharmacydetails/:id", element: <PharmacyDetails /> },
        { path: "checkout", element: <ProtectRoute><Checkout /></ProtectRoute> },
        { path: "forgetpassword", element: <ForgetPassword /> },
        { path: "categories", element: <Categories /> },
        { path: "signin", element: <SignIn /> },
        { path: "signout", element: <SignOut /> },
        { path: "navbar", element: <Navbar /> },
        { path: "signup", element: <Signup /> },
        { path: "cart", element: <Cart /> },
        { path: "*", element: <Notfound /> },
      ],
    },
    {
      path: "/pharmacydashboard",
      element: <ProtectRoute For="2"><PharmacyDashboardLayout /></ProtectRoute>,
      children: [
        { index: true, element: <PharmacyDashboard /> },
        { path: "customers", element: <Customers /> },
        { path: "inventory", element: <Inventory /> },
        { path: "orders", element: <Orders /> },
        { path: "promocodes", element: <PromoCodes /> },
        { path: "settingsdashboard", element: <SettingsDashboard /> },
      ],
    },
    {
      path: "/userdashboard",
      element: <ProtectRoute For="1"><UserDashboardLayout /></ProtectRoute>,
      children: [
        { index: true, element: <UserDashboard /> },
        { path: "paymentmethods", element: <PaymentMethods /> },
        { path: "manageaddresses", element: <ManageAddresses /> },
        { path: "accountsettings", element: <AccountSettings /> },
        { path: "orderdetails/:orderId", element: <OrderDetails /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
