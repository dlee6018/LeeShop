import { combineReducers } from "redux";
import { useDispatch } from "react-redux";
import { configureStore} from "@reduxjs/toolkit";
import {
  productReviewCreateReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  userRegisterReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from "./reducers/userReducers";
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderDeliverReducer,
  orderListMyReducer,
  orderListReducer,
} from "./reducers/orderReducers";
import productsReducer from "./features/products/productSlice";
import usersReducer from "./features/users/userSlice";
import cartsReducer from './features/cart/cartSlice'

const rootReducer = combineReducers({
  products: productsReducer,
  users: usersReducer,
  cart: cartsReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,

});

const cartItemsFromStorage = JSON.parse(
  localStorage.getItem("cartItems") || "[]"
);

const userInfoFromStorage = JSON.parse(
  localStorage.getItem("userInfo") || "[]"
);

const shippingAddressFromStorage = JSON.parse(
  localStorage.getItem("shippingAddress") || "[]"
);

const preloadedState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
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
