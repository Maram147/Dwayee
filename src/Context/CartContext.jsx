
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

 const { userLogin } = useContext(UserContext);
 const token = userLogin?.token

  

    const fetchCart = async () => {
      if(!userLogin?.token)  return;
  try {
    const res = await axios.get(`${apiUrl}/cart`, {
      headers: {
        Authorization: `Bearer ${userLogin.token}`,
        Accept: 'application/json'
      }
    });

    if (res.data && res.data.data) {
      const items = res.data.data.items.map(item => ({
        id: item.medication.id,
        name: item.medication.name,
        image: item.medication.image,
        price: parseFloat(item.medication.price),
        quantity: item.quantity,
        pharmacy: item.medication.pharmacy.name,
      }));

      setCartItems(items);
    }
  } catch (err) {
    console.error("Failed to load cart", err);
  }
};


 useEffect(() => {
   if (!token) return;

    fetchCart();
  }, [token]);

 const addToCart = async (item) => {
  if (!userLogin?.token) return;

  try {
    await axios.post(`${apiUrl}/cart/add`, {
      medication_id: item.id,
      quantity: item.quantity
    }, {
      headers: {
        Authorization: `Bearer ${userLogin.token}`,
        Accept: 'application/json'
      }
    });

    fetchCart(); 
  } catch (err) {
    console.error("Failed to add to cart", err);
  }
};

 const updateQuantity = async (id, change) => {
  const item = cartItems.find(i => i.id === id);  
  if (!item || !userLogin?.token) return;
  
  let newQty = item.quantity + change;

  if (newQty < 1) {
    toast.error("Quantity cannot be less than 1");
    return;
  }

  if (newQty > 10) {
    toast.error("You cannot add more than 10 items of this medication");
    return;
  }

  try {
    await axios.post(`${apiUrl}/cart/update`, {
      medication_id: id,
      quantity: newQty
    }, {
      headers: {
        Authorization: `Bearer ${userLogin.token}`,
        Accept: 'application/json'
      }
    });

    setCartItems(prevItems =>
      prevItems.map(i =>
        i.id === id ? { ...i, quantity: newQty } : i 
      )
    );
  } catch (error) {
    console.error("Failed to update quantity:", error);
  }
};




 const removeItem = async (id) => {
  if (!userLogin?.token) return;

  try {
    await axios.post(`${apiUrl}/cart/remove-item`, 
      { medication_id: id },
      {
        headers: {
          Authorization: `Bearer ${userLogin.token}`,
          Accept: 'application/json'
        }
      }
    );

    setCartItems(prev => prev.filter(i => i.id !== id));
  } catch (error) {
    console.error("Failed to remove item:", error);
  }
};


 
  //   try {
  //     await axios.post(`${apiUrl}/cart/delete`, {}, axiosConfig);
  //     setCartItems([]);
  //   } catch (error) {
  //     console.error("Failed to delete cart:", error);
  //   }
  // };

//  const deleteCart = async () => {
//   if (!userLogin?.token) return;

//   try {
//     await axios.post(`${apiUrl}/cart/delete`, {}, {
//       headers: {
//         Authorization: `Bearer ${userLogin.token}`,
//         Accept: 'application/json'
//       }
//     });

//     setCartItems([]);
//     await fetchCart();
//   } catch (error) {
//     console.error("Failed to delete cart:", error);
//   }
// };


const deleteCart = async () => {
  try {
    const response = await axios.post(`${apiUrl}/cart/delete`, {}, {
      headers: { Authorization: `Bearer ${userLogin.token}` }
    });
           if (response.data.success || response.data.message === "Cart is empty") {
      setCartItems([]);
    } else {
      throw new Error(response.data.message || "Failed to delete cart");
    }
  } catch (error) {
    console.error("Error deleteing cart:", error.message);
  }
};


 function Resetitems(){
  setCartItems([])
}
  

  return (
    <CartContext.Provider
     value={{
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    deleteCart,
    setCartItems,
    fetchCart, 
    Resetitems,
  }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
