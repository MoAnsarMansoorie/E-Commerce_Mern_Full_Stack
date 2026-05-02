import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {

    const currency = "$"
    const delivery_fee = 10
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    // controls the mobile search modal overlay
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState("")
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error("Please select a size for the item.");
            return;
        }

        // Optimistic update using functional setter to avoid stale closures
        setCartItems((prev) => {
            const cartData = structuredClone(prev || {});

            if (cartData[itemId]) {
                if (cartData[itemId][size]) {
                    cartData[itemId][size] += 1;
                } else {
                    cartData[itemId][size] = 1;
                }
            } else {
                cartData[itemId] = {};
                cartData[itemId][size] = 1;
            }

            return cartData;
        });

        // If not authenticated, revert optimistic update and prompt login
        if (!token) {
            toast.error("Please login to add items to the cart.");
            // revert: remove the item we just added
            setCartItems((prev) => {
                const cartData = structuredClone(prev || {});
                try {
                    if (cartData[itemId] && cartData[itemId][size]) {
                        cartData[itemId][size] -= 1;
                        if (cartData[itemId][size] <= 0) delete cartData[itemId][size];
                        if (Object.keys(cartData[itemId] || {}).length === 0) delete cartData[itemId];
                    }
                } catch (e) {
                    console.error('Error reverting cart update', e);
                }
                return cartData;
            });
            return;
        }

        // Send the updated cart to the backend
        try {
            const response = await axios.post(
                `${backendUrl}/api/v1/cart/add`,
                { itemId, size },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Item added to cart successfully.");
            } else {
                toast.error(response.data.message || "Failed to add item to cart.");
                // revert change if backend failed
                setCartItems((prev) => {
                    const cartData = structuredClone(prev || {});
                    try {
                        if (cartData[itemId] && cartData[itemId][size]) {
                            cartData[itemId][size] -= 1;
                            if (cartData[itemId][size] <= 0) delete cartData[itemId][size];
                            if (Object.keys(cartData[itemId] || {}).length === 0) delete cartData[itemId];
                        }
                    } catch (e) {
                        console.error('Error reverting cart update after backend failure', e);
                    }
                    return cartData;
                });
            }

        } catch (error) {
            console.error("Error updating cart on backend:", error);
            toast.error(error.response?.data?.message || "Failed to add item to cart. Please try again later.");
            // revert optimistic update
            setCartItems((prev) => {
                const cartData = structuredClone(prev || {});
                try {
                    if (cartData[itemId] && cartData[itemId][size]) {
                        cartData[itemId][size] -= 1;
                        if (cartData[itemId][size] <= 0) delete cartData[itemId][size];
                        if (Object.keys(cartData[itemId] || {}).length === 0) delete cartData[itemId];
                    }
                } catch (e) {
                    console.error('Error reverting cart update after exception', e);
                }
                return cartData;
            });
        }

    }

    useEffect(() => {
        console.log(cartItems)
    }, [cartItems]);

    // cart count number
    const getCartCount = () => {
        let totalCount = 0;

        for (const item in cartItems) {
            try {
                for (const size in cartItems[item]) {
                    if (cartItems[item][size] > 0) {
                        totalCount += cartItems[item][size];
                    }
                }

            } catch (error) {
                console.error("Error calculating cart count:", error);

            }
        }

        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData);

        if (token) {
            try {
                const response = await axios.post(
                    `${backendUrl}/api/v1/cart/update`,
                    { itemId, size, quantity },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data.success) {
                    toast.success("Cart updated successfully.");
                } else {
                    toast.error(response.data.message || "Failed to update cart.");
                }

            } catch (error) {
                console.error("Error updating quantity on backend:", error);
                toast.error("Failed to update quantity. Please try again later.");

            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;

        for (const items in cartItems) {
            const itemSizes = cartItems[items];
            if (!itemSizes || typeof itemSizes !== 'object') continue;
            const itemInfo = products.find(product => product._id === items);
            if (!itemInfo) {
                console.warn(`Missing product data for cart item ${items}.`);
                continue;
            }

            for (const size in itemSizes) {
                const quantity = itemSizes[size];
                if (!quantity || quantity <= 0) continue;
                totalAmount += itemInfo.price * quantity;
            }
        }

        return totalAmount;
    }

    // fetch products from backend
    const getProductsProducts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/product/list`);
            // console.log("Products fetched successfully:", response.data);
            if (response.data.success) {
                setProducts(response.data.products);
            }
            else {
                toast.error("Failed to load products. Please try again later.");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error(error.message || "Failed to load products. Please try again later.");
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(`${backendUrl}/api/v1/cart/get`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setCartItems(response.data.cartData);
            } else {
                toast.error(response.data.message || "Failed to fetch cart.");
            }

        } catch (error) {
            console.error("Error fetching user cart:", error);
            toast.error(error.response?.data?.message || "Failed to fetch cart. Please login.");
        }
    }

    useEffect(() => {
        getProductsProducts();
    }, [])

    // Load token from localStorage once on mount
    useEffect(() => {
        const stored = localStorage.getItem("token");
        if (stored && !token) {
            setToken(stored);
        }
    }, []);

    // When token changes, fetch the user cart (or clear it when logged out)
    useEffect(() => {
        if (token) {
            getUserCart(token);
        } else {
            setCartItems({});
        }
    }, [token]);

    const value = {
        products, currency, delivery_fee,
        search, setSearch,
        showSearch, setShowSearch,
        // mobile modal state
        showSearchModal, setShowSearchModal,
        cartItems, setCartItems,
        addToCart,
        getCartCount, updateQuantity,
        getCartAmount, navigate,
        token, setToken,
        backendUrl
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    )
};

export default ShopContextProvider;