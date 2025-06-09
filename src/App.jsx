import { CartProvider } from "./Context/CartContext";
import UserContextProvider from "./Context/UserContext";
import AppRouter from "./AppRouter";
import toast, { Toaster } from 'react-hot-toast';
function App() {
  return (
    <UserContextProvider>
      <CartProvider>
        <AppRouter />
        <Toaster/>
      </CartProvider>
    </UserContextProvider>
  );
}

export default App;
