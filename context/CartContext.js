// context/CartContext.js
// Global cart state using React Context + useReducer
// This lets any screen read or update the cart without prop-drilling

import React, { createContext, useContext, useReducer } from 'react';

// ─── Action Types ─────────────────────────────────────────────────────────────
// String constants for each possible cart action
const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  items: [], // Array of { ...menuItem, quantity }
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
// A reducer is a pure function: (currentState, action) => newState
// We never mutate state directly — we always return a new object
function cartReducer(state, action) {
  switch (action.type) {
    case ADD_ITEM: {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingIndex >= 0) {
        // Item already in cart → increment its quantity
        const updatedItems = state.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return { ...state, items: updatedItems };
      } else {
        // New item → add with quantity 1
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }
    }

    case REMOVE_ITEM: {
      // Filter out the item with the matching id
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }

    case UPDATE_QUANTITY: {
      // Set a specific quantity; if quantity reaches 0, remove the item
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case CLEAR_CART: {
      // Reset to empty cart (called after order is placed)
      return { ...state, items: [] };
    }

    default:
      return state;
  }
}

// ─── Context & Provider ───────────────────────────────────────────────────────
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Derived value: total number of items in cart (sum of all quantities)
  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  // Derived value: total price of all cart items
  const cartTotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Action dispatchers — simple wrappers so screens don't need to know action types
  const addItem = (item) => dispatch({ type: ADD_ITEM, payload: item });
  const removeItem = (item) => dispatch({ type: REMOVE_ITEM, payload: item });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: UPDATE_QUANTITY, payload: { id, quantity } });
  const clearCart = () => dispatch({ type: CLEAR_CART });

  return (
    <CartContext.Provider
      value={{ items: state.items, cartCount, cartTotal, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook so any component can do: const { items, addItem } = useCart();
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
