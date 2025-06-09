import React from 'react'
import { Outlet } from 'react-router-dom'
import UserNavbar from '../../components/UserNavbar'
export default function UserDashboardLayout() {
  return (
    <>
   
   <div className="flex flex-col min-h-screen">
      <UserNavbar/>
<Outlet></Outlet>
</div>
    </>
    
  )
}
