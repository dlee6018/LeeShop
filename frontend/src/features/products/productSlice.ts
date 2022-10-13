import { IProduct } from './../../types/utils';
import { RootState } from './../../store';
import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

export const getAllProducts = createAsyncThunk<any, {keyword: string, pageNumber: number}, {}>(
  "product/allProducts",
  async ({keyword, pageNumber},) => {
    try {
      const { data } = await axios.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`);
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      throw new Error(errorMessage);
    }
  }
);

export const getProductDetails = createAsyncThunk(
  "product/productDetails",
  async (id:string) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      return data;
    } catch (error:any) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      throw new Error(errorMessage);
    }
  }
);

export const deleteProduct = createAsyncThunk<IProduct, string, {state: RootState}>(
  "products/deleteProduct",
  async (id, { getState }) => {
    try {
      const { 
        users: { userInfo },
      } = getState();

      if (!userInfo){
        throw new Error('User not signed in')
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const {data} = await axios.delete(`/api/products/${id}`, config)
      return data
    } catch (error:any) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      throw new Error(message);
    }
  }
);

interface UpdateInfo {
  _id: string,
  name: string,
  image: string,
  brand: string,
  category: string,
  description: string,
  price: number,
  countInStock: number
}
export const updateProduct = createAsyncThunk<IProduct, UpdateInfo, {state: RootState}>(
  "products/updateProduct",
  async (product, { getState }) => {
    try {
      const {
        users: { userInfo },
      } = getState();

      if (!userInfo){
        throw new Error('User not signed in')
      }
      const config = {
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/products/${product._id}`,
        product,
        config
      );
      return data;
    } catch (error:any) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      throw new Error(message);
    }
  }
);

export const createProduct = createAsyncThunk<IProduct, void, {state: RootState}>(
  "products/createProduct",
  async (_:void, { getState }) => {
    try {
      const {
        users: { userInfo },
      } = getState();

      if (!userInfo){
        throw new Error("User not logged in ")
      }
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(`/api/products`, {}, config);
      return data;
    } catch (error:any) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      throw new Error(errorMessage);
    }
  }
);
interface IReview {
  rating: number,
  comment: string
}
interface createProductReviewParams {
  review: IReview,
  productId: string
}
// <return type, argument type, optional>
export const createProductReview = createAsyncThunk<{}, createProductReviewParams, {state:RootState}>("products/createProductReview", async(reviewParams, {getState}) => {
  const {review, productId} = reviewParams
  try{
    const {
      users: { userInfo },
    } = getState();

  if(!userInfo){
    throw new Error("User not logged in")
  }
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.post(`/api/products/${productId}/reviews`, review, config);

  }catch(error:any){
    const errorMessage =
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  throw new Error(errorMessage);
  }
})

export const getTopProducts = createAsyncThunk("products/getTopProducts", async() =>{
  try{
    const {data} = await axios.get('/api/products/top')
    return data
  }catch(error:any){
    const errorMessage =
    error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      throw new Error(errorMessage);
  }
})



interface ProductsState{
  productList: {
    status: string,
    error: any,
    page: number,
    pages: number,
    products: Array<IProduct>
  },
  productDetails: {
    status: string,
    error: any,
    product?: IProduct
  },
  productCreate: {
    status: string,
    error:any,
    product?: IProduct
  },
  productDelete:{
    status:string,
    error: any,
  },
  productUpdate:{
    status: string,
    error: any,
  },
  topProducts:{
    status: string,
    error: any,
    products: Array<IProduct>
  },
  productReview: {
    status: string | undefined,
    error: string | undefined
  }
}


const initialState:ProductsState ={
  productList:{
    status: "",
    error: null,
    page: 1,
    pages: 1,
    products: []
  },
  productDetails:{
    status: "",
    error: null, 
  },
  topProducts:{
    status: "",
    error: null,
    products:[]
  },
  productCreate:{
    status: "",
    error: null,
  }, 
  productDelete:{
    status: "",
    error: null
  },
  productUpdate:{
    status: "",
    error: null
  },
  productReview:{
    status: undefined,
    error: undefined
  }
};
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    reset(state){
      return initialState
    }
  },
  extraReducers(builder) {
    builder //list Products
      .addCase(getAllProducts.pending, (state, action) => {
        state.productList.status = "loading";
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.productList.status = "succeeded";
        const {pages, page, products} = action.payload
        state.productList.pages = pages;
        state.productList.page = page;
        state.productList.products = products
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.productList.status = "failed";
        state.productList.error = action.error.message;
      }) 
      .addCase(getProductDetails.pending, (state, action) => {
        state.productDetails.status = "loading";
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.productDetails.status = "succeeded";
        state.productDetails.product = action.payload
        
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.productDetails.status = "failed";
        state.productDetails.error = action.error.message;
      }) 
      .addCase(deleteProduct.pending, (state, action) => {
        state.productDelete.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.productDelete.status = "succeeded";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.productDelete.status = "failed";
        state.productDelete.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state, action) => {
        state.productUpdate.status = "loading";    
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.productUpdate.status = "succeeded"
      })
      .addCase(createProduct.pending, (state, action) => {
        state.productCreate.status = "loading";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.productCreate.status = "succeeded";
        state.productCreate.product = action.payload
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.productCreate.status = "failed";
        state.productCreate.error = action.error.message;
      })
      .addCase(getTopProducts.pending, (state, action) => {
        state.topProducts.status = "loading"
      })
      .addCase(getTopProducts.fulfilled, (state, action) => {
        state.topProducts.status = "succeeded"
        state.topProducts.products = action.payload
      })
      .addCase(getTopProducts.rejected,(state, action) => {
        state.topProducts.status = "failed"
        state.topProducts.error = action.error.message
      })
      .addCase(createProductReview.pending, (state, action) => {
        state.productReview.status = "loading"
      })
      .addCase(createProductReview.fulfilled, (state, action) => {
        state.productReview.status = "succeeded"
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.productReview.status = "failed"
        state.productReview.error = action.error.message
      })
  },
});



export const selectAllProducts = (state: RootState) => state.products.productList
export const selectProductDetails = (state: RootState) => state.products.productDetails
export const {reset} = productsSlice.actions

export default productsSlice.reducer;
