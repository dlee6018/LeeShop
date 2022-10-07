import { IShippingAddress } from './types/utils';
import { combineReducers } from "redux";
import { useDispatch } from "react-redux";
import { configureStore} from "@reduxjs/toolkit";
import productsReducer from "./features/products/productSlice";
import usersReducer from "./features/users/userSlice";
import cartsReducer from './features/cart/cartSlice'
import ordersReducer from './features/orders/orderSlice'

const rootReducer = combineReducers({
  products: productsReducer,
  users: usersReducer,
  cart: cartsReducer,
  orders: ordersReducer,
});

const cartItemsFromStorage = JSON.parse(
  localStorage.getItem("cartItems") || "[]"
);

const userInfoFromStorage = JSON.parse(
  localStorage.getItem("userInfo") || "[]"
);

const shippingAddressFromStorage = JSON.parse(
  localStorage.getItem("shippingAddress") || "{}"
);

const preloadedState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage as IShippingAddress,
    paymentMethod: "",
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0
  },
  users: { 
    status: null,
    error:null,
    profileUpdateStatus: null,
    userUpdateStatus: null,
    registerStatus: null,
    userListStatus: null,
    userDetails:{
      status: null,
      error: null,
    },
    userUpdateSuccess: false,
    userInfo: userInfoFromStorage },
};


const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
