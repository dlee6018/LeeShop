import { RootState } from '../../store';
import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
import {IUserInfo} from '../../types/utils'

type UserInfo = {
  email: string,
  password: string
}
export const login = createAsyncThunk("users/login", async (userInfo:UserInfo) => {
  try {
    const {email, password } = userInfo;

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/login",
      { email, password },
      config
    );
    localStorage.setItem("userInfo", JSON.stringify(data));
    return data;
  } catch (error:any) {
    const errorMessage =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    throw new Error(errorMessage);
  }
});

interface UsersState {
  status: string | null,
  error: string | null,
  userInfo? : IUserInfo 
}
const initialState:UsersState = {
    status: null, 
    error: null,
} 

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("shippingAddress");
      localStorage.removeItem("paymentMethod");
      return initialState
    },
  },
  extraReducers(builder) {
    builder.addCase(login.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userInfo = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = "failed";
      if (action.error.message){
        state.error = action.error.message;
      }
    });
  },
});


export const { logout } = usersSlice.actions;
export const getUserInfo = (state:RootState) => state.users.userInfo;
export const getUsersStatus = (state:RootState) => state.users.status;
export const getUsersError = (state:RootState) => state.users.error;

export default usersSlice.reducer;
