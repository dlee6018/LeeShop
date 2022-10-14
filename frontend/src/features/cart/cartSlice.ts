import { IShippingAddress } from './../../types/utils';
import { RootState } from './../../store';
import { IProduct } from './../../../../backend/utils/interface';
import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
  } from "@reduxjs/toolkit";
import axios from "axios";

interface addToCartParams {
    id: string,
    qty: number
}

interface CartProductInfo{
        _id: string,
        name: string,
        image: string,
        price: number,
        countInStock: number,
        qty: number
}

export const addToCart = createAsyncThunk<CartProductInfo, addToCartParams, {state:RootState} >("cart/addToCart", async(addToCartParams, {getState}) => {
    const {id, qty} = addToCartParams
    const {data} = await axios.get(`/api/products/${id}`)

    const payload:CartProductInfo = {
        _id: data._id,
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        qty
    }
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
  return payload
})

interface InitialState {
    cartItems: Array<CartProductInfo>,
    shippingAddress: IShippingAddress,
    paymentMethod: string,
    itemsPrice: number,
    shippingPrice: number,
    taxPrice: number,
    totalPrice: number
}
const initialState:InitialState = {
    cartItems: [],
    shippingAddress:{
        address: "",
        city: "",
        postalCode: "",
        country:""
    },
    paymentMethod: "",
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0
    
}
const cartSlice = createSlice({
    name : "cart",
    initialState,
    reducers:{
        removeFromCart(state, action){
            const id = action.payload
            state.cartItems = state.cartItems.filter((product) => product._id !== id)
        },
        clearCart(state){
            state.cartItems = []
        },
        changeQuantity(state, action){
            const {id, qty} = action.payload
            const existItem = state.cartItems.find((product) => product._id === id)
            if (existItem){
                existItem.qty = qty
            }
        },
        saveShippingAddress(state, action){
            const shippingInformation = action.payload
            state.shippingAddress = shippingInformation
            localStorage.setItem('shippingAddress', JSON.stringify(shippingInformation))
        },
        savePaymentMethod(state, action) {
            const paymentInformation = action.payload
            state.paymentMethod = paymentInformation
            localStorage.setItem('paymentMethod', JSON.stringify(paymentInformation))
        },
        calculateTotal(state, action){
            state.itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            state.itemsPrice = Number(state.itemsPrice.toFixed(2))
            state.shippingPrice = state.itemsPrice > 100? 0: 10
            state.taxPrice = (0.15 * state.itemsPrice)
            state.taxPrice = Number(state.taxPrice.toFixed(2))
            state.totalPrice = state.itemsPrice + state.shippingPrice + state.taxPrice
            state.totalPrice = Number(state.totalPrice.toFixed(2))

        },
    },
    extraReducers: (builder) => {
        builder.addCase(addToCart.fulfilled, (state, action) => {
            const item = action.payload
            const existItem = state.cartItems.find((product) => product._id === item._id)
            if (existItem){
                state.cartItems = state.cartItems.map((product) => product._id === existItem._id ? item : product)
            }else{
                state.cartItems.push(item)
            }
        })
    }
})

export const {removeFromCart, changeQuantity,saveShippingAddress, savePaymentMethod, calculateTotal, clearCart} = cartSlice.actions
export default cartSlice.reducer;