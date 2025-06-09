import { React, useContext, useState } from 'react'
import { User, Save } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';
import placeholder from '@/assets/images/placeholder.svg';
import { UserContext } from '../../../Context/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/UI/avatar"

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState('Profile');

  const { userLogin, loading } = useContext(UserContext);

  if (loading) return <p>Loading...</p>;

  if (!userLogin) return <Navigate to="/signin" />;

  const userData = userLogin.user;

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-8">
      <Link
        to="/userdashboard"
        className="text-lg ml-4 mb-4 block text-start font-semibold"
      >
        <span className="hover:bg-gray-100 px-1 rounded">&lt; Back to Dashboard</span>
      </Link>

      <div className="flex justify-between items-center mb-6 text-start">
        <div>
          <h2 className="text-2xl font-bold">Account Settings</h2>
          <p className="text-sm text-gray-500">
            Manage your account information and preferences
          </p>
        </div>
      </div>
      <div className="text-start mb-6 p-1 bg-gray-100 rounded-sm">
        {['Profile', 'Security'].map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1.5 text-sm rounded font-medium ${activeTab === tab ? 'bg-white text-gray-900' : 'text-gray-500'
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab === 'Profile' && (
        <div className="bg-white border border-gray-300 rounded-lg p-6 text-start space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Profile Information</h3>
            <p className="text-sm text-gray-500 mb-5">
              Update your personal information
            </p>
          </div>
          <div className="flex items-center space-x-6 mt-6 border-b border-gray-300 pb-8">
            <div className="relative">
              <div className='w-16 h-16 mx-auto flex items-center justify-content-center'>
                <Avatar className="h-16 w-16 bg-gray-200">
                  <AvatarFallback>
                    {(() => {
                      const fullName = `${userData?.first_name ?? ''} ${userData?.last_name ?? ''}`.trim();
                      if (!fullName) return 'User Name';
                      return fullName
                        .split(/\s+/)
                        .map(namePart => namePart[0])
                        .join('');
                    })()}
                  </AvatarFallback>


                </Avatar>

              </div>
            </div>
            <div>
              <p className="font-medium text-lg">{`${userData?.first_name ?? ''} ${userData?.last_name ?? ''}`.trim() || 'User Name'}</p>
              <p className="text-sm text-gray-500 font-semibold">{userData?.email || 'email@example.com'}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder={userData?.first_name || 'User'}
                autoComplete="given-name"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder={userData?.last_name || 'User'}
                autoComplete="family-name"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder={userData?.email || 'email@example.com'}
                autoComplete="email"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder={userData?.phone || '+20 123 456 7890'}
                autoComplete="tel"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button className="flex items-center gap-2 text-sm bg-black text-white px-4 py-2 font-medium rounded-md hover:opacity-80">
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>

      )}
      {activeTab === 'Security' && (
        <>
          <div className="border border-gray-300 shadow-xs rounded p-6 text-start">
            <h2 className="text-xl font-semibold mb-1 text-st">Change Password</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Update your password to keep your account secure
            </p>
            <form className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Current Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">New Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded hover:opacity-80"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
          <div className="border border-gray-300 shadow-xs rounded p-6 text-start mt-4">
            <h2 className="text-xl font-semibold mb-1">Two-Factor Authentication</h2>
            <p className="text-sm text-gray-500 mb-5">
              Add an extra layer of security to your account
            </p>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Protect your account with an additional security layer</p>
              </div>
              <button className="bg-white border border-gray-300 text-sm px-4 py-2 rounded-md hover:bg-gray-200">
                Enable 2FA
              </button>
            </div>
          </div>
        </>
      )}




    </div>
  );
}