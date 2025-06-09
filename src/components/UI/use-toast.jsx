import { useState } from "react";

// Simplified version of the toast hook
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = (props) => {
    setToasts((prev) => [...prev, props]);

    // In a real implementation, this would display a toast notification
    console.log("Toast:", props);

    // Remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== props));
    }, 5000);
  };

  return { toast, toasts };
}
