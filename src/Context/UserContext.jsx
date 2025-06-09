import { createContext, useEffect, useMemo, useState } from "react";

export const UserContext = createContext({
  userLogin: null,
  setUserLogin: () => {},
  userType: null,
  setUserType: () => {},
  loading: true,
});

export default function UserContextProvider({ children }) {
  const [userLogin, setUserLogin] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
const [pharmacy, setPharmacy] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userData = localStorage.getItem("userData");
    const userTypeFromStorage = localStorage.getItem("userType");

    if (token && userData) {
      const user = JSON.parse(userData);
      setUserLogin({ token, user });
      setUserType(userTypeFromStorage);
      if (user.pharmacy) {
      setPharmacy(user.pharmacy);
    }
    } else {
      setUserLogin(null);
      setUserType(null);
      setPharmacy(null);
    }
    setLoading(false); 
  }, []); 

  const value = useMemo(() => ({
    userLogin,
    setUserLogin,
    userType,
    setUserType,
     pharmacy,
  setPharmacy,
    loading,
  }), [userLogin, userType,pharmacy, loading]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}