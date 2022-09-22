import { combineReducers } from "redux";
import { useDispatch } from "react-redux";
import { configureStore} from "@reduxjs/toolkit";
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
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
import { IUserInfo, IShippingAddress } from "./types/utils";

const rootReducer = combineReducers({
  products: productsReducer,
  users: usersReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated: productTopRatedReducer,
  cart: cartReducer,
  userRegister: userRegisterReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,

});


// export interface IUser{
//   name: string,
//   email:string,
//   password: string,
//   isAdmin: boolean
// }
// interface shippingAddress{
//   address: string,
//   city: string,
//   postalCode: string,
//   country: string
// }

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
  // cart: {
  //   cartItems: cartItemsFromStorage,
  //   shippingAddress: shippingAddressFromStorage,
  // },
  users: { 
    status: null,
    error:null,
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
