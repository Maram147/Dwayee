import React, { useContext, useState } from 'react';
import { CreditCard, Trash, SquarePen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../Context/UserContext';

export default function PaymentMethods() {
  const [defaultId, setDefaultId] = useState(1);
  const { userLogin, loading } = useContext(UserContext);
  
    if (loading) return <p>Loading...</p>;
  
    if (!userLogin) return <Navigate to="/signin" />;
  
    const userData = userLogin.user;
    const fullName = `${userData?.first_name ?? ''} ${userData?.last_name ?? ''}`.trim() || 'User Name';
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiry: '12/2025',
      name: 'Ahmed Mohamed',
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '5555',
      expiry: '09/2024',
      name: 'Ahmed Mohamed',
    },
  ]);
  const handleDelete = (id) => {
    setPaymentMethods((prev) => {
      const updated = prev.filter((method) => method.id !== id);
      if (id === defaultId) {
        setDefaultId(updated.length > 0 ? updated[0].id : null);
      }
      return updated;
    });
  };
  return (
    <>
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">
         <Link
                to="/userdashboard"
                className="text-lg ml-4 mb-4 block text-start font-semibold"
              >
                <span className="hover:bg-gray-100 px-1 rounded">&lt; Back to Dashboard</span>
              </Link>

        <div className="flex justify-between items-center mb-6 text-start">
          <div>
            <h2 className="text-2xl font-bold">Payment Methods</h2>
            <p className="text-sm text-gray-500">
              Manage your payment methods
            </p>
          </div>
          <button className="bg-black text-white px-4 py-2 rounded-md text-sm hover:opacity-80">
            + Add Payment Method
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="border border-gray-300 rounded-lg p-4 bg-white shadow-xs text-start"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-1 text-teal-600" />
                  <h3 className="font-bold text-xl">
                    {method.type} •••• {method.last4}
                  </h3>
                </div>
                {defaultId === method.id && (
                  <span className="text-xs border border-gray-300 text-gray-800 px-2 py-0.5 rounded-full font-semibold">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4">Expires {method.expiry}</p>
              <div className="text-sm space-y-1 mb-5">
                <p className="font-medium">{fullName}</p>
              </div>
              <div className="flex gap-2 mt-2 justify-between">
                <div className="flex gap-2">
                  {defaultId !== method.id && (
                    <button
                      onClick={() => setDefaultId(method.id)}
                      className="text-sm border px-3 py-1 rounded-md border-gray-200 hover:bg-gray-100 font-semibold"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="text-sm border border-gray-200 text-red-500 px-3 py-1 rounded-md hover:bg-red-50 font-semibold flex items-center"
                  >
                    <Trash className="w-4 h-4 mr-1 text-red-500" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-6 text-start space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Add Payment Method</h3>
            <p className="text-sm text-gray-500 mb-5">
              Enter your card details to add a new payment method
            </p>
          </div>
          <div className="">
            <div className="space-y-1">
              <label htmlFor="" className="block text-sm font-medium">
                Cardholder Name
              </label>
              <input
                id=""
                type="text"
                placeholder="Name as it appears on card"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="">
            <div className="space-y-1">
              <label htmlFor="" className="block text-sm font-medium">
                Card Number
              </label>
              <input
                id=""
                type="text"
                placeholder="1234 5678 9012 3456"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="expiry-month" className="block text-sm font-medium">
                Expiry Month
              </label>
              <select
                id="expiry-month"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Month</option>
                {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="expiry-year" className="block text-sm font-medium">
                Expiry Year
              </label>
              <select
                id="expiry-year"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Year</option>
                {['2023', '2024', '2025', '2026', '2027', '2028'].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="cvv" className="block text-sm font-medium">
                CVV
              </label>
              <input
                id="cvv"
                type="text"
                placeholder="123"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input id="setDefault" type="checkbox" className="h-4 w-4" />
            <label htmlFor="setDefault" className="text-sm font-medium">
              Set as default payment method
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button className="text-sm border border-gray-300 px-4 py-2 font-medium rounded-md hover:bg-gray-100">
              Cancel
            </button>
            <button className="text-sm bg-black text-white px-4 py-2 font-medium rounded-md hover:opacity-80">
              Save Payment Method
            </button>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 bg-white mt-10 text-start">
          <h2 className="text-xl font-semibold mb-1">Payment Security</h2>
          <p className="text-gray-500 mb-4">Your payment information is secure</p>
          <div className="flex items-start">
            <div className="bg-teal-100 text-teal-600 rounded-full p-2 mr-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Secure Payment Processing</p>
              <p className="text-sm text-gray-500">
                Your payment information is encrypted and securely stored. We never store your full card details on our servers. All transactions are processed through secure payment gateways.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
