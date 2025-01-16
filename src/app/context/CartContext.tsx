import React, { createContext, useContext, useReducer, useEffect } from "react";

// Définition des types
interface CartItem {
  _id: string;
  title : string;
  images: string | string[];
  quantity: number;
  finalPrice: number;
  sellerId: string;
}

interface WishlistItem {
  _id: string;
  title: string;
  images: string | string[];
  finalPrice: number;
  sellerId: string;
}


const initialState = {
  cart: [] as CartItem[],
  wishlist: [] as WishlistItem[],
};

type Action =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "ADD_TO_WISHLIST"; payload: WishlistItem }
  | { type: "REMOVE_FROM_WISHLIST"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { _id: string; delta: number } }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "SET_WISHLIST"; payload: WishlistItem[] }
  | { type: "CLEAR_CART" };

const cartReducer = (
  state: typeof initialState,
  action: Action
): typeof initialState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingCartItem = state.cart.find(
        (item) => item._id === action.payload._id
      );
      if (existingCartItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: action.payload.quantity || 1 }],
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item._id !== action.payload),
      };

    case "ADD_TO_WISHLIST":
      if (state.wishlist.find((item) => item._id === action.payload._id)) {
        console.warn(`Produit déjà dans la wishlist : ${action.payload._id}`);
        return state;
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };

    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item._id !== action.payload),
      };

      case "UPDATE_QUANTITY":
        return {
          ...state,
          cart: state.cart
            .map((item) =>
              item._id === action.payload._id
                ? { ...item, quantity: item.quantity + action.payload.delta }
                : item
            )
            .filter((item) => item.quantity > 0), // Supprime les items avec une quantité <= 0
        };
      

    case "SET_CART":
      return {
        ...state,
        cart: action.payload,
      };

    case "SET_WISHLIST":
      return {
        ...state,
        wishlist: action.payload,
      };

    case "CLEAR_CART":
      return {
        ...state,
        cart: []
      };

    default:
      return state;
  }
};

const CartContext = createContext<{
  state: typeof initialState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          dispatch({ type: "SET_CART", payload: parsedCart });
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement du panier :", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          dispatch({ type: "SET_WISHLIST", payload: parsedWishlist });
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la wishlist :", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }

  const addToCart = (id: string, title: string, price: number, image: string, sellerId: string) => {
    context.dispatch({ 
      type: "ADD_TO_CART", 
      payload: { _id: id, title, finalPrice: price, images: [image], sellerId, quantity: 1 } 
    });
  };

  const addToWishlist = (id: string, title: string, price: number, image: string, sellerId: string) => {
    context.dispatch({ 
      type: "ADD_TO_WISHLIST", 
      payload: { _id: id, title, finalPrice: price, images: [image], sellerId } 
    });
  };

  return {
    state: context.state,
    dispatch: context.dispatch,
    addToCart,
    addToWishlist
  } as const;
};
