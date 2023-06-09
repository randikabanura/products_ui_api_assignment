import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";
import { fetchProduct, fetchProducts, searchProducts } from "./productAPI";

export interface ProductState {
  products: {}[]
  product: null
  status: "idle" | "loading" | "failed"
}

const initialState: ProductState = {
  products: [],
  product: null,
  status: "idle",
}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const getProductAsync = createAsyncThunk(
  "product/fetchProduct",
  async (id: number) => {
    const response = await fetchProduct(id)
    // The value we return becomes the `fulfilled` action payload
    return response.data
  },
)

export const getAllProductsAsync = createAsyncThunk(
  "product/fetchProducts",
  async () => {
    // The value we return becomes the `fulfilled` action payload
    return await fetchProducts()
  },
)

export const searchProductsAsync = createAsyncThunk(
  "product/searchProducts",
  async (query: string) => {
    // The value we return becomes the `fulfilled` action payload
    return await searchProducts(query)
  },
)

export const productSlice = createSlice({
  name: "product",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    removeCurrentProduct: (state) => {
      state.product = null
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getProductAsync.pending, (state) => {
        state.status = "loading"
      })
      .addCase(getProductAsync.fulfilled, (state, action) => {
        state.status = "idle"
        state.product = action.payload
      })
      .addCase(getProductAsync.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(getAllProductsAsync.pending, (state) => {
        state.status = "loading"
      })
      .addCase(getAllProductsAsync.fulfilled, (state, action) => {
        state.status = "idle"
        state.products = action.payload
      })
      .addCase(getAllProductsAsync.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(searchProductsAsync.pending, (state) => {
        state.status = "loading"
      })
      .addCase(searchProductsAsync.fulfilled, (state, action) => {
        state.status = "idle"
        state.products = action.payload
      })
      .addCase(searchProductsAsync.rejected, (state) => {
        state.status = "failed"
      })
  },
})

export const { removeCurrentProduct } = productSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.product.product)`
export const selectProduct = (state: RootState) => state.product.product
export const selectProducts = (state: RootState) => state.product.products
export const currentStatus = (state: RootState) => state.product.status


export default productSlice.reducer
