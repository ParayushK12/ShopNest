import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(() => {
        const localData = localStorage.getItem("season_wishlist");
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem("season_wishlist", JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const toggleWishlist = (product) => {
        setWishlistItems((prevItems) => {
            const exists = prevItems.some((item) => item._id === product._id);
            if (exists) {
                return prevItems.filter((item) => item._id !== product._id);
            } else {
                return [...prevItems, product];
            }
        });
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some((item) => item._id === productId);
    };

    const wishlistCount = wishlistItems.length;

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                toggleWishlist,
                isInWishlist,
                wishlistCount,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    return useContext(WishlistContext);
};
