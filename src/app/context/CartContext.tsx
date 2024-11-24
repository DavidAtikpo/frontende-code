// import React, { createContext, useContext, useReducer, useEffect } from "react";

// // Définition du type pour un article du panier
// interface CartItem {
//   _id: number;
//   title: string;
//   images: string | string[];
//   quantity: number;
//   finalPrice: number;
// }

// // Définition du type pour un article de la wishlist
// interface WishlistItem {
//   _id: number;
//   title: string;
//   images: string | string[];
//   finalPrice: number;
// }

// // État initial
// const initialState = {
//   cart: [] as CartItem[],
//   wishlist: [] as WishlistItem[],
// };

// // Types des actions pour le reducer
// type Action =
//   | { type: "ADD_TO_CART"; payload: CartItem }
//   | { type: "REMOVE_FROM_CART"; payload: number }
//   | { type: "ADD_TO_WISHLIST"; payload: WishlistItem }
//   | { type: "REMOVE_FROM_WISHLIST"; payload: number }
//   | { type: "UPDATE_QUANTITY"; payload: { _id: number; delta: number } }
//   | { type: "SET_CART"; payload: CartItem[] }
//   | { type: "SET_WISHLIST"; payload: WishlistItem[] };

// // Réducteur pour gérer les actions du panier
// const cartReducer = (state: typeof initialState, action: Action) => {
//   switch (action.type) {
//     case "ADD_TO_CART":
//       const existingCartItem = state.cart.find((item) => item._id === action.payload._id);
//       if (existingCartItem) {
//         // Si le produit est déjà dans le panier, augmenter sa quantité
//         return {
//           ...state,
//           cart: state.cart.map((item) =>
//             item._id === action.payload._id
//               ? { ...item, quantity: item.quantity + 1 }
//               : item
//           ),
//         };
//       }
//       return {
//         ...state,
//         cart: [...state.cart, { ...action.payload, quantity: 1 }],
//       };

//     case "REMOVE_FROM_CART":
//       return {
//         ...state,
//         cart: state.cart.filter((item) => item._id !== action.payload),
//       };

//     case "ADD_TO_WISHLIST":
//       if (state.wishlist.find((item) => item._id === action.payload._id)) {
//         // Ne pas ajouter un article déjà présent dans la wishlist
//         return state;
//       }
//       return {
//         ...state,
//         wishlist: [...state.wishlist, action.payload],
//       };

//     case "REMOVE_FROM_WISHLIST":
//       return {
//         ...state,
//         wishlist: state.wishlist.filter((item) => item._id !== action.payload),
//       };

//     case "UPDATE_QUANTITY":
//       return {
//         ...state,
//         cart: state.cart.map((item) =>
//           item._id === action.payload._id
//             ? { ...item, quantity: Math.max(1, item.quantity + action.payload.delta) }
//             : item
//         ),
//       };

//     case "SET_CART":
//       return {
//         ...state,
//         cart: action.payload, // Charger les données dans le panier
//       };

//     case "SET_WISHLIST":
//       return {
//         ...state,
//         wishlist: action.payload, // Charger les données dans la wishlist
//       };

//     default:
//       return state;
//   }
// };

// // Création du contexte
// const CartContext = createContext<{
//   state: typeof initialState;
//   dispatch: React.Dispatch<Action>;
// }>({ state: initialState, dispatch: () => null });

// // Fournisseur du contexte
// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [state, dispatch] = useReducer(cartReducer, initialState);

//   // Charger le panier depuis localStorage au démarrage
//   useEffect(() => {
//     const savedCart = localStorage.getItem("cart");
//     if (savedCart) {
//       dispatch({ type: "SET_CART", payload: JSON.parse(savedCart) });
//     }
//   }, []);

//   // Sauvegarder le panier dans localStorage à chaque mise à jour
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(state.cart));
//   }, [state.cart]);

//   // Charger la wishlist depuis localStorage au démarrage
//   useEffect(() => {
//     const savedWishlist = localStorage.getItem("wishlist");
//     if (savedWishlist) {
//       dispatch({ type: "SET_WISHLIST", payload: JSON.parse(savedWishlist) });
//     }
//   }, []);

//   // Sauvegarder la wishlist dans localStorage à chaque mise à jour
//   useEffect(() => {
//     localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
//   }, [state.wishlist]);

//   return (
//     <CartContext.Provider value={{ state, dispatch }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Hook pour utiliser le contexte
// export const useCartContext = () => useContext(CartContext);


import React, { createContext, useContext, useReducer, useEffect } from "react";

// Définition des types
interface CartItem {
  _id: string; // Changé en string
  title: string;
  images: string | string[];
  quantity: number;
  finalPrice: number;
}

interface WishlistItem {
  _id: string;
  title: string;
  images: string | string[];
  finalPrice: number;
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
  | { type: "SET_WISHLIST"; payload: WishlistItem[] };

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
          .filter((item) => item.quantity > 0),
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

export const useCartContext = () => useContext(CartContext);



// import React, { createContext, useContext, useReducer, useEffect } from "react";

// // Définition des types pour les articles
// interface CartItem {
//   _id: number;
//   title: string;
//   images: string | string[];
//   quantity: number;
//   finalPrice: number;
// }

// interface WishlistItem {
//   _id: number;
//   title: string;
//   images: string | string[];
//   finalPrice: number;
// }

// // Définition des types pour l'état global
// interface CartState {
//   cart: CartItem[];
//   wishlist: WishlistItem[];
// }

// // État initial
// const initialState: CartState = {
//   cart: [],
//   wishlist: [],
// };

// // Types des actions pour le reducer
// type Action =
//   | { type: "ADD_TO_CART"; payload: CartItem }
//   | { type: "REMOVE_FROM_CART"; payload: number }
//   | { type: "ADD_TO_WISHLIST"; payload: WishlistItem }
//   | { type: "REMOVE_FROM_WISHLIST"; payload: number }
//   | { type: "UPDATE_QUANTITY"; payload: { _id: number; delta: number } }
//   | { type: "SET_CART"; payload: CartItem[] }
//   | { type: "SET_WISHLIST"; payload: WishlistItem[] };

// // Réducteur pour gérer les actions
// const cartReducer = (state: CartState, action: Action): CartState => {
//   switch (action.type) {
//     case "ADD_TO_CART": {
//       const existingCartItem = state.cart.find((item) => item._id === action.payload._id);
//       if (existingCartItem) {
//         return {
//           ...state,
//           cart: state.cart.map((item) =>
//             item._id === action.payload._id
//               ? { ...item, quantity: item.quantity + 1 }
//               : item
//           ),
//         };
//       }
//       return {
//         ...state,
//         cart: [...state.cart, { ...action.payload, quantity: 1 }],
//       };
//     }

//     case "REMOVE_FROM_CART":
//       return {
//         ...state,
//         cart: state.cart.filter((item) => item._id !== action.payload),
//       };

//     case "ADD_TO_WISHLIST":
//       if (state.wishlist.find((item) => item._id === action.payload._id)) {
//         return state;
//       }
//       return {
//         ...state,
//         wishlist: [...state.wishlist, action.payload],
//       };

//     case "REMOVE_FROM_WISHLIST":
//       return {
//         ...state,
//         wishlist: state.wishlist.filter((item) => item._id !== action.payload),
//       };

//     case "UPDATE_QUANTITY":
//       return {
//         ...state,
//         cart: state.cart.map((item) =>
//           item._id === action.payload._id
//             ? { ...item, quantity: Math.max(1, item.quantity + action.payload.delta) }
//             : item
//         ),
//       };

//     case "SET_CART":
//       return {
//         ...state,
//         cart: action.payload,
//       };

//     case "SET_WISHLIST":
//       return {
//         ...state,
//         wishlist: action.payload,
//       };

//     default:
//       return state;
//   }
// };

// // Création du contexte
// const CartContext = createContext<{
//   state: CartState;
//   dispatch: React.Dispatch<Action>;
// }>({ state: initialState, dispatch: () => undefined });

// // Fournisseur du contexte
// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [state, dispatch] = useReducer(cartReducer, initialState);

//   useEffect(() => {
//     try {
//       const savedCart = localStorage.getItem("cart");
//       if (savedCart) {
//         dispatch({ type: "SET_CART", payload: JSON.parse(savedCart) });
//       }
//       const savedWishlist = localStorage.getItem("wishlist");
//       if (savedWishlist) {
//         dispatch({ type: "SET_WISHLIST", payload: JSON.parse(savedWishlist) });
//       }
//     } catch (error) {
//       console.error("Erreur lors du chargement de localStorage :", error);
//     }
//   }, []);

//   useEffect(() => {
//     try {
//       localStorage.setItem("cart", JSON.stringify(state.cart));
//       localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
//     } catch (error) {
//       console.error("Erreur lors de la sauvegarde dans localStorage :", error);
//     }
//   }, [state.cart, state.wishlist]);

//   return (
//     <CartContext.Provider value={{ state, dispatch }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Hook pour utiliser le contexte
// export const useCartContext = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCartContext doit être utilisé dans un CartProvider");
//   }
//   return context;
// };
