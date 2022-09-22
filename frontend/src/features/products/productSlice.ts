import { IProduct } from './../../types/utils';
import { RootState } from './../../store';
import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

interface SearchInfo {
  keyword: string,
  pageNumber: 1
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

export const createProduct = createAsyncThunk<IProduct, IProduct, {state: RootState}>(
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



interface ProductsState{
  status: string | null,
  error?: string | null,
  productList: Array<IProduct>,
  page: number,
  pages: number,
  createdStatus?: boolean,
  updatedStatus?:boolean,
  productDetails? : IProduct
}


const initialState:ProductsState ={
  status: null,
  productList:[],
  page: 1,
  pages: 1, 
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
        state.updatedStatus = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        // productsAdapter.upsertOne(state, action.payload);
        state.createdStatus = false;
        state.updatedStatus = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        // productsAdapter.upsertOne(state, action.payload);
        state.createdStatus = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});


export const getProductsStatus = (state:RootState) => state.products.status;
export const getProductsError = (state:RootState) => state.products.error;
export const selectAllProducts = (state: RootState) => state.products.productList
export const selectProductDetails = (state: RootState) => state.products.productDetails
export default productsSlice.reducer;
