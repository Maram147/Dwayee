import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Percent,
  Settings,
  LogOut,
} from "lucide-react";
import clsx from "clsx"; 
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userLogin, loading, setUserLogin, setUserType } = useContext(UserContext);

  function handleLogout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
    setUserLogin(null);
    setUserType(null);
    navigate('/signin');
    toast.error('User Sign Out');
  }

  const navItems = [
    { to: "/pharmacydashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/pharmacydashboard/orders", label: "Orders", icon: ShoppingBag },
    { to: "/pharmacydashboard/inventory", label: "Inventory", icon: Package },
    { to: "/pharmacydashboard/customers", label: "Customers", icon: Users },
    { to: "/pharmacydashboard/promocodes", label: "Promo Codes", icon: Percent },
    { to: "/pharmacydashboard/settingsdashboard", label: "Settings", icon: Settings },
    { to: "/signin", label: "Logout", onClick: handleLogout, icon: LogOut },
  ];

  return (
    <aside
      className={clsx(
        "fixed z-40 h-full w-64 bg-white border-r border-[#e5e5e5] px-4 py-6 transition-transform duration-300 ease-in-out",
        {
          "-translate-x-full": !isOpen, 
          "translate-x-0": isOpen,
          "sm:translate-x-0": true, 
        }
      )}
    >
      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon, onClick }) => (
          onClick ? (
            <button
              key={to}
              onClick={onClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium w-full text-left ${
                location.pathname === to
                  ? "bg-[#f0fdfa] text-[#0f766e]"
                  : "text-gray-700"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ) : (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium ${
                location.pathname === to
                  ? "bg-[#f0fdfa] text-[#0f766e]"
                  : "text-gray-700"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        ))}
      </nav>
    </aside>
  );
}