import { RootState } from '../../store';
import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
import {IUserInfo} from '../../types/utils'

type LoginInfo = {
  email: string,
  password: string
}
export const login = createAsyncThunk("users/login", async (userInfo:LoginInfo) => {
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
// interface updateInfo extends IUserInfo{}
export const updateUserProfile = createAsyncThunk<IUserInfo, IUserInfo, {state: RootState}>("users/updateProfile", async(updateInfo: IUserInfo, {getState}) => {
  try{
    const {
      users: { userInfo },
    } = getState()

    if (!userInfo){
      throw new Error("User not Logged In")
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(`/api/users/profile`, {name: updateInfo.name, password: updateInfo.password, email: updateInfo.email}, config)
    localStorage.setItem('userInfo', JSON.stringify(data))
    return data
  }catch(error:any){
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    return message
  }
})

export const register = createAsyncThunk("users/register", async({name, email, password}: {name: string, email: string, password: string}) =>{

  try{
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const { data } = await axios.post(
      '/api/users',
      { name, email, password },
      config
    )
    return data
    
  }catch(error:any){
    const message = error.response && error.response.data.message
    ? error.response.data.message
    : error.message

    return message
  }
})

export const listUsers = createAsyncThunk<Array<IUserInfo>, void, {state:RootState}>("users/listUsers", async(_,{getState}) => {
  try{
    const {
      users: { userInfo },
    } = getState()

    if(!userInfo){
      throw new Error("User not logged In")
    }
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/users`, config)
    return data
  }catch(error:any){
    const message = error.response && error.response.data.message
    ? error.response.data.message
    : error.message

    return message
  }
})
  export const deleteUser = createAsyncThunk<{}, string, {state:RootState}>("users/deleteUser", async(id,{getState}) => {
    try{
      const {
        users: { userInfo },
      } = getState()
  
      if(!userInfo){
        throw new Error("User not logged In")
      }
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
  
      await axios.delete(`/api/users/${id}`, config)
    }catch(error:any){
      const message = error.response && error.response.data.message
      ? error.response.data.message
      : error.message
  
      return message
    }
})

interface UserUpdateInfo  {
  _id: string, 
  name:string,
  email:string, 
  isAdmin: boolean 
}
export const updateUser = createAsyncThunk<UserUpdateInfo, UserUpdateInfo, {state:RootState}>("users/updateUser", async(user,{getState}) => {
  try{
    const {
      users: { userInfo },
    } = getState()

    if(!userInfo){
      throw new Error("User not logged In")
    }
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(`/api/users/${user._id}`, user, config)
    return data
  }catch(error:any){
    const message = error.response && error.response.data.message
    ? error.response.data.message
    : error.message

    return message
  }
})
export const getUserDetails = createAsyncThunk<IUserInfo, string, {state:RootState}>("users/getUserDetails", async(id,{getState}) => {
  try{
    const {
      users: { userInfo },
    } = getState()

    if(!userInfo){
      throw new Error("User not logged In")
    }
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/users/${id}`, config)
    return data
  }catch(error:any){
    const message = error.response && error.response.data.message
    ? error.response.data.message
    : error.message

    return message
  }
})


interface UsersState {
  status: string | null,
  error: string | null,
  userInfo : IUserInfo | null,
  userUpdateStatus: string | null,
  userUpdateSuccess: boolean,
  profileUpdateStatus: string | null ,
  registerStatus: string | null,
  userListStatus: string | null,
  userList?: Array<IUserInfo>,
  userDetails:{
    status: string | null,
    error: any,
    user?: IUserInfo
  } 
}
const initialState:UsersState = {
    status: null, 
    error: null,
    profileUpdateStatus: null,
    userUpdateStatus: null,
    userInfo: null,
    registerStatus: null,
    userUpdateSuccess: false,
    userListStatus: null,
    userDetails:{
      status: null,
      error: null,
    }
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
    resetUserUpdate(state){
      state.userUpdateStatus = null
      state.userDetails.user = undefined
      state.userUpdateSuccess = false
    }
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
    })
    builder.addCase(updateUserProfile.pending, (state, action) => {
      state.profileUpdateStatus = "loading"
    })
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.profileUpdateStatus = "succeeded"
      state.userInfo = action.payload
    })
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.profileUpdateStatus = "failed"
    })
    builder.addCase(register.pending, (state, action) => {
      state.registerStatus = "loading"
    })
    builder.addCase(register.fulfilled, (state, action) => {
      state.registerStatus = "succeeded"
      state.userInfo = action.payload
    })
    builder.addCase(register.rejected, (state, action) => {
      state.registerStatus = "failed"
    })
    builder.addCase(listUsers.pending, (state, action) => {
      state.userListStatus = "loading"
      state.userUpdateStatus = null
    })
    builder.addCase(listUsers.fulfilled, (state, action) => {
      state.userListStatus = "succeeded"
      state.userList = action.payload
    })
    builder.addCase(listUsers.rejected, (state, action) => {
      state.userListStatus = "failed"
    })
    builder.addCase(getUserDetails.pending, (state, action) => {
      state.userDetails.status = "loading"
    })
    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      state.userDetails.status = "succeeded"
      state.userDetails.user = action.payload
    })
    builder.addCase(getUserDetails.rejected, (state, action) => {
      state.userDetails.status = "failed"
      state.userDetails.error = action.payload
    })
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.userUpdateStatus = "succeeded"
      state.userUpdateSuccess = true
    })
  },
});


export const { logout, resetUserUpdate } = usersSlice.actions;
export const getUserInfo = (state:RootState) => state.users.userInfo;
export const getUsersStatus = (state:RootState) => state.users.status;
export const getUsersError = (state:RootState) => state.users.error;

export default usersSlice.reducer;
