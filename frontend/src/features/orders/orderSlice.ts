import { RootState } from './../../store';
import { IOrder } from './../../../../backend/utils/interface';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { logout } from "../users/userSlice"

const createOrder = createAsyncThunk<IOrder, IOrder, {state:RootState}>("order/createOrder", async(order, {getState}) => {
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

interface InitialState {
    createOrder:{
        status: string | null,
        error: any,
        order?: IOrder
    }
}
const initialState:InitialState = {
    createOrder :{
        status: null,
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
        }),
        builder.addCase(createOrder.fulfilled, (state, action) => {
            state.createOrder.status = "succeeded"
            state.createOrder.order = action.payload
        }),
        builder.addCase(createOrder.rejected, (state, action) => {
            state.createOrder.status = "failed"
            state.createOrder.error = action.payload
        })
    }
})