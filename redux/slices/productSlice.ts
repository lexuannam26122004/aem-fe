import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store'
import { ICart } from '@/models/Cart'

interface ProductState {
    products: ICart[] | null
}

const initialState: ProductState = {
    products: null
}

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts(state, action: PayloadAction<ICart[]>) {
            state.products = action.payload
        }
    }
})

export const { setProducts } = productSlice.actions

export const productSelector = (state: RootState) => state.products

export default productSlice.reducer
