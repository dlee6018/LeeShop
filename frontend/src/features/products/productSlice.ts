import { IProduct } from './../../types/utils';
import { RootState } from './../../store';
import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

interface SearchInfo {
  keyword: string,
  pageNumber: number
}
export const getAllProducts = createAsyncThunk(
  "product/allProducts",
  async (searchInfo:SearchInfo) => {
    try {
      let keyword = "";
      let pageNumber = 1;
      if (searchInfo) {
        keyword = searchInfo.keyword;
        pageNumber = searchInfo.pageNumber;
      }
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

export const updateProduct = createAsyncThunk<IProduct, IProduct, {state: RootState}>(
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

export const createProduct = createAsyncThunk<IProduct, string, {state: RootState}>(
  "products/createProduct",
  async (id, { getState }) => {
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
  status: string | undefined,
  error: string | undefined,
  productList: Array<IProduct>,
  page: number,
  pages: number,
  productCreate: {
    createdStatus?: "loading" | "succeeded" | "failed",
    product?: IProduct
  }
  updatedStatus?:"loading" | "succeeded" | "failed",
  productDetails? : IProduct,
  topProducts: Array<IProduct>,
  topProductsStatus?: "loading" | "succeeded" | "failed",
  productReview: {
    status: string | undefined,
    error: string | undefined
  }
}


const initialState:ProductsState ={
  status: undefined,
  error: undefined,
  productList:[],
  topProducts:[],
  page: 1,
  pages: 1,
  productCreate:{

  }, 
  productReview:{
    status: undefined,
    error: undefined
  }
};
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder //list Products
      .addCase(getAllProducts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pages = action.payload.pages;
        state.page = action.payload.page;

        const products = action.payload.products;
        state.productList = products
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      }) //product Details
      .addCase(getProductDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        const product = action.payload
        state.productDetails = product
        
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      }) //Delte Product
      .addCase(deleteProduct.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        // const id = action.payload;
        // productsAdapter.removeOne(state, id);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state, action) => {
        state.updatedStatus = "loading";    
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        // productsAdapter.upsertOne(state, action.payload);
        state.updatedStatus = "succeeded"
        state.productCreate.createdStatus = "loading";
      })
      .addCase(createProduct.pending, (state, action) => {
        state.productCreate.createdStatus = "loading";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.productCreate.createdStatus = "succeeded";
        state.updatedStatus = "loading"
        state.productCreate.product = action.payload
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getTopProducts.pending, (state, action) => {
        state.topProductsStatus = "loading"
      })
      .addCase(getTopProducts.fulfilled, (state, action) => {
        state.topProductsStatus = "succeeded"
        state.topProducts = action.payload
      })
      .addCase(getTopProducts.rejected,(state, action) => {
        state.topProductsStatus = "failed"
        state.error = action.error.message
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


export const getProductsStatus = (state:RootState) => state.products.status;
export const getProductsError = (state:RootState) => state.products.error;
export const selectAllProducts = (state: RootState) => state.products.productList
export const selectProductDetails = (state: RootState) => state.products.productDetails
export default productsSlice.reducer;
