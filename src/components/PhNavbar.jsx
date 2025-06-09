
import { Bell, Pill, Menu, ChevronDown, LogOut, UserPen, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/UI/Button";
import { Card, CardContent } from "../components/UI/Card";
import { Badge } from "../components/UI/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/UI/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/UI/DropDownMenu"
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
export default function PhNavbar({ toggleSidebar }) {

  const { userLogin, loading, setUserLogin, setUserType } = useContext(UserContext);

  if (loading) return <p>Loading...</p>;

  if (!userLogin) return <Navigate to="/signin" />;

  const userData = userLogin.user;
const fullName = userData?.pharmacy?.name || 'PH';

  function handleLogout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');

    setUserLogin(null);
    setUserType(null);

    navigate('/signin');
    toast.error('User Sign Out')

  }

  return (
    <header className="w-full bg-white border-b border-[#e5e5e5] px-4 py-4 flex justify-between items-center ">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="block sm:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link to="/pharmacydashboard" className="flex items-center gap-2">
          <Pill className="h-6 w-6 text-teal-600" />
          <span className="text-xl font-bold hidden md:inline-block">Dwayee Pharmacy Portal</span>
          <span className="text-xl font-bold md:hidden">Dwayee</span>
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 flex items-center gap-2 pl-2 pr-1">
              <Avatar className="h-8 w-8 bg-gray-200">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Pharmacy" />
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
              <div className="flex flex-col items-start text-sm hidden md:flex">
                <span className="font-medium">{userData?.pharmacy?.name || 'PH'}</span>

              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="settingsdashboard"><Settings />Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/"><UserPen />Profile</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link to="/signin"><button onClick={handleLogout} className="flex items-center gap-1"><LogOut />Logout</button> </Link>

            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
