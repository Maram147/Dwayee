import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import Style from './ProtectRoute.module.css';

export default function ProtectRoute({ children, for: requiredType }) {
  const { userLogin, userType,loading } = useContext(UserContext);

  console.log("ProtectRoute - userLogin:", userLogin);
  console.log("ProtectRoute - userType:", userType);

  if (loading) {
    return (
      <>
      <div className={Style.spinnerContainer}>
        <div className={Style.spinner}></div>
        <p>Loading.....</p>
      </div>
      
      </>
    );
  }

  if (!userLogin || !userLogin.token) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredType && userType !== requiredType) {
    if (userType === 'user') {
      return <Navigate to="/userdashboard" />;
    } else if (userType === 'pharmacy') {
      return <Navigate to="/pharmacydashboard" />;
    } else {
      return <Navigate to="/signin" />;
    }
  }

  return children;
}
