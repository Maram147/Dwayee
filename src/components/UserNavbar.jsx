// src/components/Navbar.jsx
import { Bell, Pill, Menu, ChevronDown, Settings, LogOut, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/UI/avatar";
import { Button } from "../components/UI/Button";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/UI/DropDownMenu";
// import { useCart } from "../Context/CartContext";

export default function Navbar({ toggleSidebar }) {
  const { userLogin, loading, setUserLogin, setUserType } = useContext(UserContext);
  // const { cartItems, setCartItems } = useCart();

  if (loading) {
    return <p>Loading...</p>;
  } else if (!userLogin) {
    return <Navigate to="/signin" />;
  }


  const userData = userLogin.user;
  const fullName = `${userData?.first_name ?? ''} ${userData?.last_name ?? ''}`.trim() || 'User Name';

  function handleLogout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');

    setUserLogin(null);
    setUserType(null);
// deletecart();
// updateQuantity();
    navigate('/signin');
    toast.error('User Sign Out')

  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#e5e5e5] px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">

          <Link to="/" className="flex items-center gap-2">
            <Pill className="h-6 w-6 text-teal-600" />
            <span className="text-xl font-bold hidden md:inline-block">Dwayee - دوائي</span>
            <span className="text-xl font-bold md:hidden">Dwayee</span>
          </Link>
        </div>

        <div className="flex  gap-1 ">
          <Link to="/medications" className="hidden md:block">
            <Button variant="ghost" size="sm" className="hover:text-teal-700 hover:bg-teal-50">
              Continue Shopping
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 flex items-center gap-2 pl-2 pr-1">
                <Avatar className="h-8 w-8 bg-gray-200">
                  <AvatarFallback>
                    {(() => {
                      if (!fullName) return 'UN';
                      return fullName
                        .split(/\s+/)
                        .map(namePart => namePart[0])
                        .join('');
                    })()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm hidden md:flex">
                  <p className="font-medium">{fullName}</p>
                  <p className="text-xs text-gray-500">{userData?.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 " />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="accountsettings"><Settings />Settings</Link>
              </DropdownMenuItem>
             <DropdownMenuItem asChild>
              <Link to="/signin"><button onClick={handleLogout} className="flex items-center gap-1"><LogOut />Logout</button> </Link>

            </DropdownMenuItem>

              <DropdownMenuItem asChild >
                <Link to="/medications"><ShoppingBag />Continue Shopping</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}