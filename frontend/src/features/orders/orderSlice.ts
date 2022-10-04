import { ICreateOrder } from './../../types/utils';
import { RootState } from './../../store';
import { IOrder } from '../../types/utils';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { logout } from "../users/userSlice"

export const createOrder = createAsyncThunk<IOrder, ICreateOrder, {state:RootState}>("order/createOrder", async(order, {getState}) => {
    try{
        const {
            users: { userInfo },
          } = getState()

          if (!userInfo){
            throw new Error("User not logged in ")
          }

          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
      
      
        const { data } = await axios.post(`/api/orders`, order, config)
        localStorage.removeItem('cartItems')
        return data
    }catch(error:any){
        const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message

        if (message === 'Not authorized, token failed') {
            logout()
        }
        return message
    }
})

export const getOrderDetails = createAsyncThunk<IOrder, string, {state:RootState}>("order/getOrderDetails", async(id, {getState}) => {
    try{
        const {
            users: { userInfo },
          } = getState()

          if (!userInfo){
            throw new Error("User not logged in ")
          }

          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
      
      
        const { data } = await axios.get(`/api/orders/${id}`, config)
        return data
    }catch(error:any){
        const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message

        if (message === 'Not authorized, token failed') {
            logout()
        }
        return message
    }
})

export const payOrder = createAsyncThunk<IOrder, any, {state:RootState}>("order/payOrder", async({orderId, paymentResult}, {getState}) => {
    try{
        const {
            users: { userInfo },
          } = getState()

          if (!userInfo){
            throw new Error("User not logged in ")
          }

          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
      
      
          const { data } = await axios.put(
            `/api/orders/${orderId}/pay`,
            paymentResult,
            config
          )
        return data
    }catch(error:any){
        const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message

        if (message === 'Not authorized, token failed') {
            logout()
        }
        return message
    }
})

export const deliverOrder = createAsyncThunk<IOrder, string, {state:RootState}>("order/deliverOrder", async(id, {getState}) => {
    try{
        const {
            users: { userInfo },
          } = getState()

          if (!userInfo){
            throw new Error("User not logged in ")
          }

          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
      
      
          const { data } = await axios.put(
            `/api/orders/${id}/deliver`,
            {},
            config
          )
        return data
    }catch(error:any){
        const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message

        if (message === 'Not authorized, token failed') {
            logout()
        }
        return message
    }
})

export const getMyOrders = createAsyncThunk<Array<IOrder>, void, {state:RootState}>("order/getMyOrders", async(_, {getState}) => {
  try{
      const {
          users: { userInfo },
        } = getState()

        if (!userInfo){
          throw new Error("User not logged in ")
        }

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
        const { data } = await axios.get(`/api/orders/myorders`, config)
        console.log(data, "data")
      return data
  }catch(error:any){
      const message =
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message

      if (message === 'Not authorized, token failed') {
          logout()
      }
      return message
  }
})

export const getAllOrders = createAsyncThunk<Array<IOrder>, void, {state:RootState}>("order/getAllOrders", async(_, {getState}) => {
  try{
      const {
          users: { userInfo },
        } = getState()

        if (!userInfo){
          throw new Error("User not logged in ")
        }

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
        const { data } = await axios.get(`/api/orders`, config)
      return data
  }catch(error:any){
      const message =
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message

      if (message === 'Not authorized, token failed') {
          logout()
      }
      return message
  }
})

interface InitialState {
    createOrder:{
        status: string,
        error: any,
        order?: IOrder
    },
    orderDetails: {
        status: string,
        error: any,
        order?:IOrder
    },
    orderPay:{
        status: string,
        error: any,
        paySuccess?: boolean
    },
    orderDeliver:{
        status: string,
        error: any,
        deliverSuccess?: boolean
    },
    myOrders:{
      status: string,
      error:any,
      orders?: Array<IOrder>
    },
    allOrders:{
      status: string,
      error:any,
      orders?: Array<IOrder>
    }
}
const initialState:InitialState = {
    createOrder :{
        status: "",
        error: null,
    },
    orderDetails: {
        status: "",
        error: null
    },
    orderPay:{
        status: "",
        error: null,
    },
    orderDeliver:{
        status: "",
        error: null
    },
    myOrders:{
      status:"",
      error:null,
    },
    allOrders:{
      status: "",
      error: null,

    }
}

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
    },
    extraReducers(builder){
        builder.addCase(createOrder.pending, (state, action) => {
            state.createOrder.status = "loading"
        })
        .addCase(createOrder.fulfilled, (state, action) => {
            state.createOrder.status = "succeeded"
            state.createOrder.order = action.payload
        })
        .addCase(createOrder.rejected, (state, action) => {
            state.createOrder.status = "failed"
            state.createOrder.error = action.payload
        })
        .addCase(getOrderDetails.pending, (state, action) => {
            state.orderDetails.status = "loading"
            state.orderPay.paySuccess = false
            state.orderDeliver.deliverSuccess = false
        })
        .addCase(getOrderDetails.fulfilled, (state, action) => {
            state.orderDetails.status = "succeeded"
            state.orderDetails.order = action.payload
        })
        .addCase(getOrderDetails.rejected, (state, action) => {
            state.orderDetails.status = "failed"
            state.orderDetails.error = action.payload
        })
        .addCase(payOrder.pending, (state, action) => {
            state.orderPay.status = "loading"
        })
        .addCase(payOrder.fulfilled, (state, action) => {
            state.orderPay.status = "succeeded"
            state.orderPay.paySuccess = true
        })
        .addCase(payOrder.rejected, (state, action) => {
            state.orderPay.status = "failed"
            state.orderPay.error = action.payload
        })
        .addCase(deliverOrder.pending, (state, action) => {
            state.orderDeliver.status = "loading"
        })
        .addCase(deliverOrder.fulfilled, (state, action) => {
            state.orderDeliver.status = "succeeded"
            state.orderDeliver.deliverSuccess = true
        })
        .addCase(deliverOrder.rejected, (state, action) => {
            state.orderDeliver.status = "failed"
            state.orderDeliver.error = action.payload
        })
        .addCase(getMyOrders.pending, (state,action)=> {
          state.myOrders.status = "loading"
        })
        .addCase(getMyOrders.fulfilled, (state,action)=> {
          state.myOrders.status = "succeeded"
          state.myOrders.orders = action.payload
          
        })
        .addCase(getMyOrders.rejected, (state,action)=> {
          state.myOrders.status = "failed"
          
        })
        .addCase(getAllOrders.pending, (state, action) => {
          state.allOrders.status = "loading"
        })
        .addCase(getAllOrders.fulfilled, (state, action) => {
          state.allOrders.status = "succeeded"
          state.allOrders.orders = action.payload
        })
        .addCase(getAllOrders.rejected, (state, action) => {
          state.allOrders.status = "failed"
        })
    },
})

export default ordersSlice.reducer;
