import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store'

interface ProductCompareState {
    ids: number[]
}

const initialState: ProductCompareState = {
    ids: []
}

export const productCompareSlice = createSlice({
    name: 'productCompare',
    initialState,
    reducers: {
        setProductIds(state, action: PayloadAction<number[]>) {
            const uniqueIds = Array.from(new Set(action.payload))
            state.ids = uniqueIds.slice(0, 2)
        },
        addProductId(state, action: PayloadAction<number>) {
            if (state.ids.includes(action.payload)) return
            if (state.ids.length >= 2) return
            state.ids.push(action.payload)
        },
        removeProductId(state, action: PayloadAction<number>) {
            state.ids = state.ids.filter(id => id !== action.payload)
        },
        clearCompare(state) {
            state.ids = []
        }
    }
})

export const { addProductId, removeProductId, clearCompare, setProductIds } = productCompareSlice.actions

export const productCompareSelector = (state: RootState) => state.productCompare?.ids || []

export default productCompareSlice.reducer
