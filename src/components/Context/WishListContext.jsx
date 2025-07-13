import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export let WishContext = createContext();

export function WishContextProvider({ children }) {
  const [wishCount, setWishCount] = useState(0);

  const headers = {
    token: localStorage.getItem("usreToken"),
  };

  async function getWishList() {
    try {
      const response = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { headers }
      );
      setWishCount(response.data.count); // ✅ تحديث العداد
      return response.data;
    } catch (error) {
      console.error("Get wishlist error", error);
      return error;
    }
  }

  async function addToWish(productId) {
    try {
      const response = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { productId },
        { headers }
      );
      await getWishList(); // ✅ تحديث القائمة + العداد
      return response;
    } catch (error) {
      console.error("Add to wishlist error", error);
      return error;
    }
  }

  async function removeFromWish(productId) {
    try {
      const response = await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        { headers }
      );
      await getWishList(); // ✅ تحديث القائمة + العداد
      console.log(response);
      if (response?.data?.status === 'success') {
        toast.success(response?.data?.message, { duration: 4000, position: 'top-right' });
      } else {
        toast.error('error');
      }

      return response;

    } catch (error) {
      console.error("Remove from wishlist error", error);
      return error;
    }
  }

  // تحميل القائمة تلقائياً عند بداية التطبيق
  useEffect(() => {
    getWishList();
  }, []);

  return (
    <WishContext.Provider
      value={{ addToWish, removeFromWish, getWishList, wishCount }}
    >
      {children}
    </WishContext.Provider>
  );
}
